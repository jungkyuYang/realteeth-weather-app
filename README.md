<div align="center">
  <h1>
    ☁️ Real-Weather App 
    <sub style="font-size: 0.5em;">
      <a href="https://realteeth-weather-app.netlify.app/">🔗 배포 링크</a>
    </sub>
  </h1>

  <blockquote style="max-width: 500px; text-align: center; border: none; background: none;">
    이 프로젝트는 사용자에게 실시간 날씨 정보를 제공하는 모던 웹 애플리케이션입니다.
    <br>
    사용자의 현재 위치 날씨를 자동으로 보여주고, 원하는 지역을 검색하거나 
    즐겨찾기에 추가하여 날씨를 쉽게 확인할 수 있습니다.
  </blockquote>
</div>

<div align="center">
  <img width="512" height="512" alt="AIDrawing" src="https://github.com/user-attachments/assets/bc0acf19-e0bb-4ff7-913b-5e9b665eed79" />
</div>

## 🚀 프로젝트 실행 방법

1.  **저장소 복제**:
    ```bash
    git clone https://github.com/your-username/weather-app.git
    cd weather-app
    ```

2.  **종속성 설치**:
    ```bash
    npm install
    ```

3.  **개발 서버 실행**:
    ```bash
    npm run dev
    ```
    이후 브라우저에서 `http://localhost:5173` (혹은 다른 포트)으로 접속할 수 있습니다.

### 기타 스크립트

- **빌드**: `npm run build`
- **린트**: `npm run lint`
- **E2E 테스트**: `npm run test:e2e`
- **Storybook 실행**: `npm run storybook`

---

## ✨ 구현 기능

- **현재 위치 날씨 제공**: 앱에 처음 진입 시, 브라우저의 Geolocation API를 사용하여 사용자의 현재 위치를 기반으로 날씨 정보를 보여줍니다.
- **위치 검색**:
  - 텍스트 기반으로 원하는 지역(도시, 동네 등)을 검색할 수 있습니다.
  - 검색어 입력 시, API를 통해 관련 지역 목록을 비동기적으로 로드하여 보여줍니다.
  - 검색 결과가 없는 경우, "해당 장소의 정보가 제공되지 않습니다"와 같은 메시지를 표시하여 사용자에게 피드백을 줍니다.
- **지역 선택**:
  - '지역 선택' 기능을 통해 시/도, 시/군/구, 읍/면/동 순서로 주소를 단계적으로 선택하여 날씨를 확인할 수 있습니다.
- **즐겨찾기 관리**:
  - 검색한 지역을 즐겨찾기에 추가할 수 있습니다.
  - 즐겨찾기 목록은 최대 6개까지 등록할 수 있으며, 개수 제한 초과 시 더 이상 추가되지 않습니다.
  - 즐겨찾기에 등록된 지역의 별칭(예: "우리집", "회사")을 자유롭게 수정할 수 있습니다.
  - 즐겨찾기 목록에서 특정 지역을 클릭하면 해당 지역의 상세 날씨 페이지로 이동합니다.
- **상세 날씨 정보**:
  - 특정 지역의 상세 날씨 페이지에서는 시간대별 예보, 주간 예보 등 더 자세한 날씨 정보를 제공합니다.
- **UI/UX 개선**:
  - **다크/라이트 모드**: 사용자의 시스템 설정에 따라 테마를 자동으로 전환하며, 수동으로도 변경할 수 있습니다.
  - **로딩 및 에러 상태 처리**: `Suspense`와 `ErrorBoundary`를 활용하여 데이터 로딩 중에는 스켈레톤 UI를, 에러 발생 시에는 에러 메시지를 명확하게 보여줍니다.
  - **토스트 알림**: GPS 권한 오류나 즐겨찾기 추가/수정 같은 주요 액션에 대한 피드백을 토스트 메시지로 제공합니다.
  - **반응형 디자인**: 모바일, 태블릿, 데스크탑 등 다양한 화면 크기에서 최적화된 레이아웃을 제공합니다.

---

## 🤔 주요 기술 및 결정 이유

1.  **아키텍처: Feature-Sliced Design (FSD)**
    - **결정**: 프로젝트의 구조를 `pages`, `widgets`, `features`, `entities`, `shared`의 5가지 레이어로 나누는 FSD 방법론을 채택했습니다.
    - **이유**:
        - **관심사 분리**: 각 모듈이 명확한 책임을 갖게 되어 코드의 응집도를 높이고 결합도를 낮춥니다.
        - **재사용성 및 확장성**: `shared`와 `entities` 레이어의 컴포넌트와 로직을 여러 `features`나 `widgets`에서 쉽게 재사용할 수 있습니다.
        - **유지보수 용이성**: 코드의 위치를 예측하기 쉬워 새로운 기능을 추가하거나 기존 코드를 수정할 때 생산성이 향상됩니다.

2.  **상태 관리: React Query와 React Hooks의 조합**
    - **결정**: 서버 상태는 React Query로, 클라이언트 상태는 React의 기본 Hooks(useState, useReducer 등)를 중심으로 관리합니다. `Zustand`와 같은 전역 상태 관리 라이브러리는 검토했으나 도입하지 않았습니다.
    - **이유**:
        - **최소한의 의존성**: 현재 애플리케이션의 복잡도에서는 전역으로 공유해야 할 클라이언트 상태가 많지 않았습니다. React Query의 캐시와 React의 기본 기능만으로 충분하다고 판단하여, 불필요한 라이브러리 추가를 지양하고 번들 크기를 최적화했습니다.
        - **명확한 데이터 흐름**: 서버 상태와 클라이언트 상태를 명확히 분리하여 데이터 흐름을 예측 가능하게 유지했습니다.

3.  **데이터 페칭: React Query (TanStack Query)**
    - **결정**: 서버 상태 관리를 위해 React Query를 도입했습니다. `Suspense` 및 `ErrorBoundary`와 함께 사용하여 데이터 페칭 로직을 선언적으로 관리합니다.
    - **이유**:
        - **캐싱 및 동기화**: 서버 데이터를 자동으로 캐싱하고, 백그라운드에서 데이터를 최신 상태로 유지하여 사용자 경험을 향상시킵니다.
        - **로딩/에러 상태 관리 간소화**: `isLoading`, `isError`, `data` 등의 상태를 제공하여 복잡한 데이터 페칭 상태 로직을 직접 구현할 필요가 없습니다.
        - **선언적 코드**: `Suspense`와 결합하여 데이터가 준비될 때까지 렌더링을 지연시키는 코드를 매우 간결하게 작성할 수 있습니다.

4.  **React 19 및 React Compiler**
    - **결정**: 최신 버전인 React 19를 사용하고, `babel-plugin-react-compiler`를 빌드 과정에 포함시켰습니다.
    - **이유**:
        - **성능 최적화**: React Compiler는 코드를 자동으로 메모이제이션(memoization)하여 불필요한 리렌더링을 최소화하고, 수동으로 `useMemo`, `useCallback`을 사용해야 하는 번거로움을 줄여줍니다.
        - **최신 기능 활용**: React 19의 `useTransition` 같은 동시성(Concurrency) 기능을 적극적으로 사용하여 UI의 반응성을 높였습니다. 예를 들어, 지역 검색 결과가 업데이트될 때 화면 전환을 부드럽게 처리합니다.

5.  **모니터링 및 분석: Sentry와 Google Analytics**
    - **결정**: 에러 추적을 위해 Sentry를, 사용자 행동 분석을 위해 Google Analytics(React GA4)를 도입했습니다.
    - **이유**:
        - **선제적 오류 대응**: Sentry를 통해 프로덕션 환경에서 발생하는 오류를 실시간으로 감지하고 빠르게 대응하여 애플리케이션의 안정성을 높입니다.
        - **데이터 기반 개선**: Google Analytics로 사용자의 주요 행동(예: 어떤 지역을 가장 많이 검색하는지, 즐겨찾기 기능을 얼마나 사용하는지)을 분석하여 향후 기능 개선의 우선순위를 정하는 데 활용할 수 있습니다.

6.  **테스트: Playwright를 사용한 E2E 테스트**
    - **결정**: 사용자 시나리오 기반의 End-to-End 테스트를 위해 Playwright를 도입했습니다.
    - **이유**:
        - **신뢰성 높은 테스트**: "현재 위치 날씨 확인", "지역 검색 및 즐겨찾기 추가" 등 실제 사용자 흐름을 시뮬레이션하여 애플리케이션의 핵심 기능이 정상적으로 동작하는지 보장합니다.
        - **브라우저 호환성**: Chromium, Firefox, WebKit 등 여러 브라우저에서 테스트를 실행하여 크로스 브라우저 이슈를 사전에 방지할 수 있습니다.
        - **Geolocation 모의**: 테스트 환경에서 특정 위치(Geolocation)를 모의(mocking)하여 위치 기반 기능의 테스트를 용이하게 합니다.

7.  **빌드 최적화: Vite와 Rollup 설정**
    - **결정**: `vite.config.ts`에서 `manualChunks` 옵션을 사용하여 써드파티 라이브러리(recharts, tanstack 등)를 별도의 청크(chunk)로 분리했습니다.
    - **이유**:
        - **초기 로딩 속도 개선**: 거대한 `vendor.js` 파일 하나 대신, 기능별로 분리된 작은 자바스크립트 파일을 생성하여 초기 페이지 로드 시 필요한 코드만 다운로드하도록 합니다.
        - **효율적인 캐싱**: 자주 변경되지 않는 라이브러리 코드를 별도 파일로 분리하면, 애플리케이션 코드만 변경되었을 때 브라우저가 라이브러리 코드를 다시 다운로드하지 않고 캐시를 활용할 수 있습니다.

---

## 📂 프로젝트 구조

이 프로젝트는 **Feature-Sliced Design (FSD)** 아키텍처를 기반으로 설계되었습니다. 각 디렉토리의 역할은 다음과 같습니다.

```
src
├── app/         # 애플리케이션의 전역 설정, 레이아웃, 라우팅 등 초기화 코드
├── pages/       # 각 페이지를 구성하는 컴포넌트
├── widgets/     # 여러 features와 entities를 조합하는 독립적인 UI 블록 (예: 헤더, 즐겨찾기 목록)
├── features/    # 사용자 상호작용을 포함하는 기능 단위 (예: 지역 검색, 즐겨찾기 추가)
├── entities/    # 핵심 비즈니스 모델 (예: 날씨, 위치)
└── shared/      # 모든 레이어에서 재사용 가능한 공용 코드 (UI 컴포넌트, 유틸리티 함수, API 클라이언트 등)

```

## 🛠️ 기술 스택

### 프레임워크 및 라이브러리
- **Framework**: React (v19)
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: React Query
- **Routing**: React Router
- **UI Components**: Radix UI, Recharts (차트), Sonner (토스트), Lucide React (아이콘)
- **Testing**: Playwright (E2E), Vitest, Storybook
- **Monitoring & Analytics**: Sentry, React GA4
