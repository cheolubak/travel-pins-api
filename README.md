# Travel Pins API

네이버 지도 기반 여행 장소 공유 서비스의 백엔드 API

## Tech Stack

- **Runtime**: NestJS v10, TypeScript
- **ORM**: Prisma v7 + `@prisma/adapter-pg`
- **DB**: PostgreSQL (Supabase)
- **Auth**: JWT + Kakao / Naver / Google OAuth
- **Image**: Sharp → WebP → Supabase Storage
- **Build**: pnpm workspace + Turborepo

## Project Structure

```
apps/api/                  → NestJS API (port 4000)
packages/database/         → Prisma + DatabaseModule
packages/eslint-config/    → Shared ESLint config
packages/typescript-config/ → Shared TypeScript config
```

## Getting Started

### Prerequisites

- Node.js v20+
- pnpm v10+
- PostgreSQL (or Supabase)

### Installation

```bash
pnpm install
```

### Environment Variables

루트에 `.env` 파일 생성:

```env
DATABASE_URL=postgresql://...
DIRECT_URL=postgresql://...
SUPABASE_URL=https://...
SUPABASE_ANON_KEY=...
SUPABASE_STORAGE_BUCKET=...
KAKAO_ADMIN_KEY=...
NAVER_CLIENT_ID=...
NAVER_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
JWT_SECRET=...
```

### Development

```bash
pnpm db:generate  # Prisma 클라이언트 생성
pnpm db:push      # 스키마를 DB에 반영
pnpm dev           # 개발 서버 (port 4000)
```

### Build

```bash
pnpm build        # 프로덕션 빌드
pnpm start        # 프로덕션 실행
```

## API Endpoints

### Auth

| Method | Path | Description |
|--------|------|-------------|
| POST | `/auth/kakao` | 카카오 로그인 |
| POST | `/auth/naver` | 네이버 로그인 |
| POST | `/auth/google` | 구글 로그인 |
| POST | `/auth/refresh` | 토큰 갱신 |

### Places

| Method | Path | Description |
|--------|------|-------------|
| GET | `/places` | 지도 범위 내 장소 조회 |
| POST | `/places` | 장소 등록 |

### My Places

| Method | Path | Description |
|--------|------|-------------|
| GET | `/my-places` | 저장한 장소 목록 |
| POST | `/my-places/:placeId` | 장소 저장 |
| DELETE | `/my-places/:placeId` | 장소 저장 해제 |

### Reviews

| Method | Path | Description |
|--------|------|-------------|
| GET | `/reviews?placeId=` | 장소별 리뷰 목록 |
| GET | `/reviews/:id` | 리뷰 상세 |
| POST | `/reviews` | 리뷰 작성 |
| PATCH | `/reviews/:id` | 리뷰 수정 |
| DELETE | `/reviews/:id` | 리뷰 삭제 |

### Groups

| Method | Path | Description |
|--------|------|-------------|
| POST | `/groups` | 그룹 생성 |
| GET | `/groups` | 내 그룹 목록 |
| GET | `/groups/:id` | 그룹 상세 |
| PATCH | `/groups/:id` | 그룹 수정 |
| DELETE | `/groups/:id` | 그룹 삭제 |
| POST | `/groups/:id/members` | 멤버 추가 |
| DELETE | `/groups/:id/members/:userId` | 멤버 제거 |

### Travels

| Method | Path | Description |
|--------|------|-------------|
| POST | `/travels` | 여행 생성 |
| GET | `/travels` | 여행 목록 |
| GET | `/travels/:id` | 여행 상세 |
| PATCH | `/travels/:id` | 여행 수정 |
| DELETE | `/travels/:id` | 여행 삭제 |

### Users

| Method | Path | Description |
|--------|------|-------------|
| GET | `/users/me` | 내 프로필 조회 |
| PATCH | `/users/me` | 프로필 수정 |
