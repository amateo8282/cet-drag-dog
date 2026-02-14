# Fetch Boy

웹페이지에서 텍스트를 드래그하면 리트리버가 달려가서 텍스트를 "물어와서" 스크랩해주는 크롬 익스텐션입니다.

## 주요 기능

- **텍스트 드래그 스크랩**: 웹페이지에서 텍스트를 드래그하면 "Fetch!" 버튼이 나타남
- **리트리버 애니메이션**: Fetch! 클릭 시 리트리버가 텍스트를 물어오는 애니메이션 재생
- **스크랩 관리**: 팝업에서 저장된 스크랩 목록 조회, 검색, 복사, 삭제
- **토스트 알림**: 저장 완료 시 "멍! 물어왔어요!" 알림
- **키보드 단축키**: `Ctrl+Shift+F` (Mac: `Cmd+Shift+F`)로 빠르게 스크랩
- **설정**: 애니메이션/토스트 ON/OFF

## 기술 스택

- **빌드**: Vite + vite-plugin-web-extension
- **팝업 UI**: React + TypeScript + Tailwind CSS v4 + shadcn/ui
- **Content Script**: Vanilla TypeScript + Shadow DOM
- **스토리지**: chrome.storage.local
- **테스트**: Vitest + Testing Library
- **아키텍처**: Clean Architecture (Domain -> Application -> Infrastructure -> Presentation)

## 설치 (개발)

```bash
# 의존성 설치
pnpm install

# 개발 모드 실행
pnpm run dev

# 빌드
pnpm run build

# 테스트
pnpm run test
```

## 크롬에 로드

1. `pnpm run build`로 빌드
2. 크롬에서 `chrome://extensions` 접속
3. 우측 상단 "개발자 모드" 활성화
4. "압축해제된 확장 프로그램을 로드합니다" 클릭
5. `dist/` 폴더 선택

## 사용법

1. 아무 웹페이지에서 텍스트를 드래그
2. "Fetch!" 버튼 클릭 (또는 `Ctrl+Shift+F`)
3. 리트리버가 텍스트를 물어오는 애니메이션 재생
4. 팝업에서 저장된 스크랩 확인/검색/복사/삭제

## 프로젝트 구조

```
src/
├── domain/                 # 엔티티 (ScrapItem, Settings)
├── application/
│   ├── ports/              # Repository 인터페이스, 메시지 프로토콜
│   ├── usecases/           # SaveScrap, GetAllScraps, DeleteScrap, SearchScraps
│   └── services/           # textSelection 유틸
├── infrastructure/
│   ├── background/         # Service Worker, messageHandler
│   └── storage/            # ChromeStorage Repository 구현
└── presentation/
    ├── content/            # Content Script, FetchButton, RetrieverAnimation, Toast
    └── popup/              # React 팝업 UI (App, ScrapCard, SearchBar, SettingsPanel)
```
