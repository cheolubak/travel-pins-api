# Travel Pins API

네이버 지도 기반으로 여행을 간 곳을 공유하는 서비스를 만들려고 하고 있어.
다양한 관점에서 이 서비스를 만들 에이전트 팀을 구성해서 작업해줘.
팀원 중 한 명은 UX, 한 명은 기술 아키텍처, 그리고 한 명은 반대 의견을 제시하고, 마지막 한 명은 모든걸 확인하고 승인하는 역할을 맡아줘.
4명의 팀원으로 구성된 팀을 만들어 해당 서비스를 개발해줘.

## 프로젝트 개요

네이버 지도 기반 여행 장소 공유 서비스의 백엔드 API.
사용자가 방문한 장소를 저장하고, 리뷰·이미지를 남기며, 그룹 여행을 관리할 수 있다.

핵심 기능: 장소 검색/저장, 리뷰 작성, 이미지 업로드, 그룹 여행, 카카오, 네이버, 구글 로그인

## 기술 스택

- **Runtime**: NestJS v10, TypeScript
- **ORM**: Prisma v7 (preview: relationJoins)
- **DB**: PostgreSQL (Supabase)
- **인증**: JWT (1h 만료, Refresh Token 30d 만료) + Kakao OAuth, Naver OAuth, Google OAuth
  - `POST /auth/kakao` — 카카오 로그인 (Kakao API: `kapi.kakao.com/v2/user/me`)
  - `POST /auth/naver` — 네이버 로그인 (Naver API: `openapi.naver.com/v1/nid/me`)
  - `POST /auth/google` — 구글 로그인 (Google API: `googleapis.com/oauth2/v2/userinfo`)
  - `POST /auth/refresh` — 토큰 갱신
- **이미지**: Sharp → WebP(quality:80, max 1024px) → Supabase Storage
- **빌드**: pnpm workspace + Turborepo

## 프로젝트 구조

```
apps/api/                → NestJS API (@travel-pins/api, port 4000)
packages/database/       → Prisma + DatabaseModule (@travel-pins/database)
packages/eslint-config/  → 공유 ESLint 설정 (@travel-pins/eslint-config)
packages/typescript-config/ → 공유 TS 설정 (@travel-pins/typescript-config)
```

- Prisma 생성 클라이언트: `packages/database/generated/prisma/` (gitignored)
- Database 빌드 체인: `prisma generate → tsc → ln -snf ../generated dist/generated`

## 주요 명령어

```bash
pnpm dev          # 개발 서버 실행
pnpm build        # 프로덕션 빌드
pnpm lint         # ESLint 검사
pnpm db:generate  # Prisma 클라이언트 생성
pnpm db:push      # 스키마를 DB에 반영
```

빌드 순서: `db:generate` → `build` (Turborepo가 database → api 순서 보장)

## 환경 변수

루트 `.env` 파일 사용. 필요 키:

- `DATABASE_URL` — PostgreSQL 연결 (pooling)
- `DIRECT_URL` — PostgreSQL 직접 연결
- `SUPABASE_URL` — Supabase 프로젝트 URL
- `SUPABASE_ANON_KEY` — Supabase 익명 키
- `SUPABASE_STORAGE_BUCKET` — 이미지 저장 버킷
- `KAKAO_ADMIN_KEY` — 카카오 인증 키
- `NAVER_CLIENT_ID` — 네이버 클라이언트 ID
- `NAVER_CLIENT_SECRET` — 네이버 클라이언트 시크릿
- `GOOGLE_CLIENT_ID` — 구글 클라이언트 ID
- `GOOGLE_CLIENT_SECRET` — 구글 클라이언트 시크릿
- `JWT_SECRET` — JWT 서명 키

## 코딩 컨벤션

- **Prettier**: singleQuote, trailingComma: all
- **ESLint**: `perfectionist/sort-imports: 'error'` (알파벳 정렬)
- **커밋**: Conventional commits (`feat`/`fix`/`refactor`), 한/영 혼용
- **DTO**: class-validator 데코레이터 사용, GlobalValidationPipe (transform + implicitConversion)
- **삭제**: soft delete (`deleted: Boolean` 플래그) — Reviews, ReviewImages, Travels

## 아키텍처 패턴

- Module → Controller → Service 구조
- Global: ConfigModule, JwtModule, ValidationPipe
- 이미지 파이프라인: URL fetch → Sharp resize(1024px) → WebP(quality:80) → Supabase 업로드

## 패키지 매니저

pnpm만 사용. npm 사용 금지.
