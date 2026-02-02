import { test, expect } from '@playwright/test';

test.describe('날씨 앱 구현 기능 테스트', () => {
  // 모든 테스트 전 홈으로 이동 및 위치 권한 설정
  test.beforeEach(async ({ page, context }) => {
    // 요구사항 2-2: 사용자 현재 위치 감지 시뮬레이션 (서울 좌표)
    await context.setGeolocation({ latitude: 37.5665, longitude: 126.978 });
    await context.grantPermissions(['geolocation']);
    await page.goto('/');
  });

  test('요구사항 1,2: 첫 진입 시 현재 위치의 날씨 정보가 표시되어야 한다', async ({ page }) => {
    // 기온 정보(°C)나 '서울'이라는 텍스트가 나타나는지 확인
    const weatherContainer = page.locator('body');
    await expect(weatherContainer).toContainText('내 주변');

    const Text = page.getByText('시간대별 예보');
    await expect(Text).toBeVisible();
  });

  test('요구사항 3-1: 검색 결과 없음 상태가 사라진 후 결과 렌더링 확인', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색/i);

    // 1. "종로구" 입력
    await searchInput.fill('종로구');

    // 2. "결과가 없어요" 문구가 뜨는 것을 확인
    const emptyMessage = page.getByText('해당 장소의 정보가 제공되지 않습니다', { exact: false });
    await expect(emptyMessage).toBeVisible();

    // 3. 💡 핵심: "결과가 없어요" 문구가 화면에서 사라질 때까지 대기
    // hidden 상태가 될 때까지 최대 7초간 기다립니다.
    await expect(emptyMessage).toBeHidden({ timeout: 7000 });

    // 4. 이제 실제 검색 결과(종로구)가 나타났는지 확인
    const resultItem = page.getByText('종로구', { exact: false }).first();
    await expect(resultItem).toBeVisible();

    // 5. 클릭하여 상세 정보 렌더링
    await resultItem.click();

    // 6. 상세 데이터에 '종로구'가 포함되어 있는지 확인
    await expect(page.locator('body')).toContainText('종로구');
  });

  test('요구사항 3-2: 지역 선택 버튼을 통해 상세 주소까지 순차적으로 선택한다', async ({ page }) => {
    // 1. 지역선택 버튼 클릭 (전체 리스트 열기)
    const areaSelectButton = page.getByRole('button', { name: /지역/i });
    await areaSelectButton.click();

    // 2. 서울특별시 클릭
    const seoul = page.getByText('서울특별시').first();
    await expect(seoul).toBeVisible({ timeout: 3000 });
    await seoul.click();

    // 3. 종로구 클릭 (서울 클릭 후 리스트가 업데이트될 시간을 기다림)
    const jongno = page.getByText('종로구').first();
    await expect(jongno).toBeVisible({ timeout: 3000 });
    await jongno.click();

    // 4. 청운동 클릭 (최종 동 단위 선택)
    const cheongun = page.getByText('청운동').first();
    await expect(cheongun).toBeVisible({ timeout: 3000 });
    await cheongun.click();

    const emptyMessage = page.getByText('해당 장소의 정보가 제공되지 않습니다', { exact: false });
    await expect(emptyMessage).toBeVisible();

    await expect(emptyMessage).toBeHidden({ timeout: 7000 });

    const resultItem = page.getByText('청운동', { exact: false }).first();
    await expect(resultItem).toBeVisible();

    await resultItem.click();

    await expect(page.locator('body')).toContainText('청운동');
  });

  test('요구사항 3-3: 검색 결과 없음 "해당 장소의 정보가 제공되지 않습니다" 문구가 뜨는지 확인', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색/i);

    await searchInput.fill('Real');

    const emptyMessage = page.getByText('해당 장소의 정보가 제공되지 않습니다', { exact: false });
    await expect(emptyMessage).toBeVisible();
  });

  test('요구사항 4-1: 즐겨찾기를 6개까지 추가하고 카운트를 확인한다', async ({ page }) => {
    // 1. 등록할 도시 리스트 (중복 방지를 위해 6개 준비)
    const cities = ['종로구', '강남구', '송파구', '서초구', '마포구', '영등포구'];
    const searchInput = page.getByPlaceholder(/검색/i);

    for (let i = 0; i < cities.length; i++) {
      // 도시 입력
      await searchInput.fill(cities[i]);
      // 검색 결과에서 해당 도시가 나타날 때까지 대기 및 클릭
      const resultItem = page.getByText(cities[i]).first();
      await expect(resultItem).toBeVisible();

      // 즐겨찾기 등록 버튼 클릭
      const favButton = page.getByRole('button', { name: /즐겨찾기 등록/i });
      await favButton.click();
      await resultItem.click();

      // 중간 카운트 확인 (선택 사항: i+1 / 6 형식일 경우)
      const currentCount = `${i + 1}/6`;
      await expect(page.getByText(currentCount)).toBeVisible();

      // 다음 검색을 위해 입력창 비우기 (필요 시)
      await searchInput.clear();
    }

    // 2. 최종적으로 6/6 문구가 뜨는지 확인
    await expect(page.getByText('6/6')).toBeVisible();

    // 3. 7번째 추가 시도 시 제한 로직이 작동하는지 확인 (추가 점수 포인트)
    await searchInput.fill('강동구');
    const gangdong = page.getByText('강동구').first();
    await expect(gangdong).toBeVisible();

    // 6개가 꽉 찼을 때 버튼이 비활성화(disabled)되어 있거나 에러 메시지가 뜨는지 확인
    const favButton = page.getByRole('button', { name: /즐겨찾기 등록/i });
    await favButton.click();

    await expect(page.getByText('6/6')).toBeVisible();
  });

  test('요구사항 4-2: 즐겨찾기에 추가된 장소의 이름(별칭)을 수정하고 해당 상세 페이지로 이동한다', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색/i);

    await searchInput.fill('강동구');
    const gangdong = page.getByText('강동구').first();
    await expect(gangdong).toBeVisible();

    const favButton = page.getByRole('button', { name: /즐겨찾기 등록/i });
    await favButton.click();

    await expect(page.getByText('1/6')).toBeVisible();
    const editButton = page.getByRole('button', { name: /수정/i });
    await editButton.click();

    const aliasInput = page.locator('#editable-input');
    // 기존 내용을 지우고 새로운 별칭 입력
    await aliasInput.fill('우리집');
    // 2. 확인 버튼 클릭
    // 버튼에 ID가 없다면 텍스트나 Role로 찾습니다.
    const confirmButton = page.getByRole('button', { name: /확인/i });

    // 만약 엔터를 쳐야 한다면: await aliasInput.press('Enter');
    await confirmButton.click();

    const updatedAlias = page.getByText('우리집').first();
    await expect(updatedAlias).toBeVisible();

    // 💡 4. 1초 대기 (UI 안정화 대기)
    // 23시 제출 전, 확실한 동작을 위해 1초간 지연 시간을 줍니다.
    await page.waitForTimeout(1000);

    // 5. '우리집' 클릭하여 상세 페이지(또는 관련 동작) 이동
    await updatedAlias.click();

    const detailPage = page.getByText('상세 날씨').first();
    await expect(detailPage).toBeVisible();
  });
});
