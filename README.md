This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Login

The dashboard requires credentials configured on the server:

```env
LOGIN_USERNAME=your-admin-username
LOGIN_PASSWORD=use-a-long-unique-password
SESSION_SECRET=generate-a-random-secret-with-openssl-rand-base64-32
```

Set these values in `.env.local` for local development and in the deployment environment for production. Generate the secret with `openssl rand -base64 32`. The session expires after 8 hours, and dashboard data API routes require a valid session.

## SDM and Zawiyah API requests

The upstream URLs default to the endpoints below; set the URL variables in the server environment only if the endpoint changes:

- `API_SDM_URL`: SDM endpoint (example: `https://api.idrisiyyah.or.id/sdm/getSdm`)
- `API_ZAWIYAH_URL`: Zawiyah/jamaah endpoint (example: `https://api.idrisiyyah.or.id/jamaah/getRekapJamaah`)
- `KEY_SIGNATURE`: required shared HMAC signing key

The dashboard calls these authenticated local endpoints:

```http
POST /api/sdm/rekap
POST /api/jamaah/rekap
Content-Type: application/json

{"date_trx":"2026-11-25"}
```

Both routes send the same upstream request: `POST` with that JSON body, `Content-Type: application/json`, and `Authorization: Bearer <HMAC-SHA512 hex signature>`. The signature is calculated from the exact JSON body using `KEY_SIGNATURE`. The signing key stays on the server; callers need a valid dashboard session cookie.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
