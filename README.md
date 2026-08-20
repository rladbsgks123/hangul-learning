# 한글 놀이터

한글을 처음 배우는 아이를 위한 놀이형 한글 학습 웹앱입니다. 자음 14자와 모음 10자를 카드, 획순 애니메이션, 발음 듣기, 게임, 진행현황 대시보드로 재미있게 익힐 수 있습니다.

## 화면 구성

- **홈**: 자음/모음 카드 그리드 + 레벨에 따라 표정이 바뀌는 마스코트
- **학습**: 큰 글자 + 획순 애니메이션 + 연관 단어 그림 + 발음 듣기(Web Speech API)
- **게임**: 그림-글자 짝맞추기(메모리 매칭), 소리 듣고 글자 고르기 퀴즈
- **진행현황**: 학습 진도율·퀴즈 정답률 차트(recharts), XP/레벨, 스티커 보상

## 기술 스택

- React + Vite + TypeScript
- Tailwind CSS v4 + shadcn/ui
- motion (애니메이션), recharts (차트)
- Web Speech API(발음), Web Audio API(효과음) — 전부 브라우저 내장 기능으로 동작, 외부 서비스 불필요
- localStorage로 학습 기록 저장

## 실행 방법

```cmd
npm install
npm run dev
```

또는 `start.bat` 파일을 더블클릭하면 의존성 설치 후 개발 서버가 자동으로 실행됩니다.

## 빌드

```cmd
npm run build
```
