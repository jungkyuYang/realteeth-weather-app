# 🚀 template-vite-fsd-react

Vite와 React, TypeScript를 기반으로 하며, 지속 가능한 협업을 위해 FSD(Feature-Sliced Design) 아키텍처와 엄격한 코드 품질 관리 도구들을 통합한 스타터 패키지입니다.

## ✨ 핵심 기능

### 🏗 아키텍처 및 환경
- **FSD (Feature-Sliced Design)**: 계층 간 결합도를 최소화하고 유지보수성을 극대화한 아키텍처 적용
- **Vite**: 최신 브라우저의 Native ESM을 활용한 초고속 빌드 및 HMR 환경
- **GitHub Actions**: CI 파이프라인을 통한 Lint, Build, Test 자동화 검사

### 🛠 코드 품질 및 테스트 전략
- **Storybook 10**: 컴포넌트 주도 개발(CDD) 환경 및 UI 컴포넌트 격리 개발
- **Vitest (Storybook Addon)**: 별도 설정 없이 스토리북 내에서 컴포넌트의 렌더링 안정성을 검증하는 **자동 스모크 테스트**
- **Playwright**: 실제 사용자 시나리오에 기반한 전체 서비스 흐름을 검증하는 **E2E 테스트**
- **ESLint & Prettier**: 저장 시 자동 코드 교정 및 스타일 일관성 유지
- **Husky & lint-staged**: Git Hook을 활용하여 커밋 전 결함 코드 방지
- **Commitlint**: Conventional Commits 규격을 준수하는 일관된 커밋 히스토리 관리

### 🎨 협업 도구
- **Storybook Autodocs**: 컴포넌트 명세 및 사용법 자동 문서화
- **Issue & PR Template**: 체계적인 협업을 위한 구조화된 템플릿 제공
- **GitHub Labels**: 직관적인 작업 분류를 위한 라벨 시스템

## 📁 프로젝트 구조 (FSD)
- **app**: 앱 전역 설정 (Providers, Router, Global Styles)
- **pages**: 라우트 단위의 페이지 컴포넌트
- **widgets**: 여러 엔티티/기능을 결합한 독립적인 UI 블록
- **features**: 사용자 상호작용 및 비즈니스 가치를 담은 기능 (예: 날씨 조회)
- **entities**: 비즈니스 도메인 모델 및 관련 데이터 처리 (예: 날씨 정보 객체)
- **shared**: 재사용 가능한 공용 UI, API 클라이언트, 유틸리티 함수

## 🧪 실행 및 테스트
- **개발 서버**: `npm run dev`
- **스토리북**: `npm run storybook`
- **E2E 테스트**: `npx playwright test`