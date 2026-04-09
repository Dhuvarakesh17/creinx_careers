# JB Portal - Premium Job Portal

Startup-ready careers portal built with Next.js 16 + Tailwind CSS 4.

## Features Implemented

- Premium animated landing and story sections
- Two sector hiring layout:
  - Technical sector
  - Digital marketing sector
- Role-specific apply flow (click role -> preselected application form)
- Application form with validation and PDF resume upload
- Submission pipeline:
  - Resume upload to Supabase Storage
  - Application record in Supabase Postgres
  - Notification email through Resend

## Stack

- Next.js 16 (App Router)
- Tailwind CSS 4
- Framer Motion
- React Hook Form + Zod
- Supabase (DB + Storage)
- Resend (email)

## Quick Setup

1. Install dependencies

```bash
npm install
```

2. Add environment variables

```bash
cp .env.example .env.local
```

Fill all keys in `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_RESUME_BUCKET`
- `RESEND_API_KEY`
- `RESEND_FROM_EMAIL`
- `RESEND_APPLICANT_FROM_EMAIL` (recommended, for applicant confirmations)
- `CAREERS_INBOX_EMAIL`

3. Create Supabase objects

Run SQL in Supabase SQL editor:

- `supabase/schema.sql`

4. Start development server

```bash
npm run dev
```

Open http://localhost:3000

## Validation Commands

```bash
npm run lint
npm run build
```

## Notes

- The form endpoint is at `/api/applications`.
- Storage bucket defaults to `resumes`.
- Email is sent only when both `RESEND_FROM_EMAIL` and `CAREERS_INBOX_EMAIL` are configured.
- Applicant confirmation emails must use a verified sender (`RESEND_APPLICANT_FROM_EMAIL` or `RESEND_FROM_EMAIL`).
