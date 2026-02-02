import { test, expect } from '@playwright/test';

/**
 * [테스트 개요] 날씨 앱 주요 사용자 시나리오 테스트
 * 1. 현재 위치 기반 날씨 로드
 * 2. 지역 검색 및 상세 정보 조회
 * 3. 즐겨찾기(CRUD) 및 등록 개수 제한(Max 6)
 */
test.describe('날씨 앱 구현 기능 테스트', () => {
  // 각 테스트 실행 전 독립적인 브라우저 환경 설정
  test.beforeEach(async ({ page, context }) => {
    // [요구사항 2-2] 브라우저 권한 및 위치 정보 시뮬레이션 (서울시청 좌표)
    await context.setGeolocation({ latitude: 37.5665, longitude: 126.978 });
    await context.grantPermissions(['geolocation']);

    // 홈 화면으로 이동
    await page.goto('/');
  });

  test('요구사항 1,2: 초기 진입 시 사용자 현재 위치의 날씨가 표시되는가', async ({ page }) => {
    // '내 주변' 텍스트 포함 여부로 현재 위치 기반 렌더링 확인
    const weatherContainer = page.locator('body');
    await expect(weatherContainer).toContainText('내 주변');

    // 하단 시간대별 예보 섹션이 정상적으로 나타나는지 확인
    const timeForecastText = page.getByText('시간대별 예보');
    await expect(timeForecastText).toBeVisible();
  });

  test('요구사항 3-1: 검색 시 지연 로딩(Skeleton/Empty) 이후 결과가 정상 노출되는가', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색/i);

    // 1. "종로구" 검색어 입력
    await searchInput.fill('종로구');

    // 2. 검색 중 또는 로딩 상태 메세지 노출 확인
    const emptyMessage = page.getByText('해당 장소의 정보가 제공되지 않습니다', { exact: false });
    await expect(emptyMessage).toBeVisible();

    // 3. 비동기 데이터 로딩 대기 (최대 7초 내에 안내 문구가 사라져야 함)
    await expect(emptyMessage).toBeHidden({ timeout: 7000 });

    // 4. 검색 결과 리스트에서 첫 번째 항목 확인 및 클릭
    const resultItem = page.getByText('종로구', { exact: false }).first();
    await expect(resultItem).toBeVisible();
    await resultItem.click();

    // 5. 상세 페이지 진입 후 텍스트 일치 여부 검증
    await expect(page.locator('body')).toContainText('종로구');
  });

  test('요구사항 3-2: 계층형 지역 선택(시/도 > 구/군 > 동) 절차가 정상 작동하는가', async ({ page }) => {
    // 1. 지역 선택 모달/드롭다운 오픈
    const areaSelectButton = page.getByRole('button', { name: /지역/i });
    await areaSelectButton.click();

    // 2. 1단계: 서울특별시 선택
    const seoul = page.getByText('서울특별시').first();
    await expect(seoul).toBeVisible({ timeout: 3000 });
    await seoul.click();

    // 3. 2단계: 종로구 선택
    const jongno = page.getByText('종로구').first();
    await expect(jongno).toBeVisible({ timeout: 3000 });
    await jongno.click();

    // 4. 3단계: 청운동 최종 선택
    const cheongun = page.getByText('청운동').first();
    await expect(cheongun).toBeVisible({ timeout: 3000 });
    await cheongun.click();

    // 5. 로딩 처리 및 최종 결과 클릭 프로세스 (3-1 시나리오와 동일)
    const emptyMessage = page.getByText('해당 장소의 정보가 제공되지 않습니다', { exact: false });
    await expect(emptyMessage).toBeVisible();
    await expect(emptyMessage).toBeHidden({ timeout: 7000 });

    const resultItem = page.getByText('청운동', { exact: false }).first();
    await expect(resultItem).toBeVisible();
    await resultItem.click();

    // 6. 청운동 날씨 상세 정보 렌더링 확인
    await expect(page.locator('body')).toContainText('청운동');
  });

  test('요구사항 3-3: 검색 결과가 없는 경우 적절한 안내 문구가 표시되는가', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색/i);

    // 유효하지 않은 지역명 입력
    await searchInput.fill('Real');

    // 에러/안내 메시지 노출 확인
    const emptyMessage = page.getByText('해당 장소의 정보가 제공되지 않습니다', { exact: false });
    await expect(emptyMessage).toBeVisible();
  });

  test('요구사항 4-1: 즐겨찾기 등록 및 최대 개수(6개) 제한 로직이 작동하는가', async ({ page }) => {
    const cities = ['종로구', '강남구', '송파구', '서초구', '마포구', '영등포구'];

    const searchInput = page.getByPlaceholder(/검색/i);

    // 1. 반복문을 통한 6개 지역 즐겨찾기 추가 시뮬레이션
    for (let i = 0; i < cities.length; i++) {
      await searchInput.fill(cities[i]);
      const resultItem = page.getByText(cities[i]).first();
      await expect(resultItem).toBeVisible();

      const favButton = page.getByRole('button', { name: /즐겨찾기 등록/i });
      await favButton.click();
      await resultItem.click();

      // 즐겨찾기 카운트 UI 업데이트 확인 (예: 1/6, 2/6 ...)
      const currentCount = `${i + 1}/6`;
      await expect(page.getByText(currentCount)).toBeVisible();

      await searchInput.clear();
    }

    // 2. 최대 개수 도달 상태 확인
    await expect(page.getByText('6/6')).toBeVisible();

    // 3. 7번째 등록 시도 시 추가 차단 확인
    await searchInput.fill('강동구');
    const gangdong = page.getByText('강동구').first();
    await expect(gangdong).toBeVisible();

    const favButton = page.getByRole('button', { name: /즐겨찾기 등록/i });
    await favButton.click();

    // 카운트가 6/6을 유지하는지 검증
    await expect(page.getByText('6/6')).toBeVisible();
  });

  test('요구사항 4-2: 즐겨찾기 별칭 수정 및 상세 페이지 이동이 가능한가', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/검색/i);

    // 1. 대상 지역(강동구) 등록
    await searchInput.fill('강동구');
    const gangdong = page.getByText('강동구').first();
    await expect(gangdong).toBeVisible();

    const favButton = page.getByRole('button', { name: /즐겨찾기 등록/i });
    await favButton.click();

    // 2. 별칭 수정 모드 진입
    const editButton = page.getByRole('button', { name: /수정/i });
    await editButton.click();

    // 3. 새로운 별칭 '우리집' 입력 및 저장
    const aliasInput = page.locator('#editable-input');
    await aliasInput.fill('우리집');
    const confirmButton = page.getByRole('button', { name: /확인/i });
    await confirmButton.click();

    // 4. UI 반영 확인 및 안정화 대기
    const updatedAlias = page.getByText('우리집').first();
    await expect(updatedAlias).toBeVisible();
    await page.waitForTimeout(1000); // UI 안정화 지연

    // 5. 수정된 별칭 클릭 시 상세 페이지로 이동하는지 최종 확인
    await updatedAlias.click();
    const detailPage = page.getByText('상세 날씨').first();
    await expect(detailPage).toBeVisible();
  });
});
