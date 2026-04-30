# ✦ Sensory House — eBook & Live Sessions Platform

A full-stack Next.js 14 e-commerce platform for selling eBooks and paid Google Meet live sessions, with automated email reminders and secure downloads.

---

## 🗂 Project Structure

```
sensory-house/
├── app/
│   ├── page.tsx                        ← Landing / Home page
│   ├── layout.tsx                      ← Root layout (Navbar, Footer)
│   ├── providers.tsx                   ← NextAuth SessionProvider
│   ├── auth/
│   │   ├── login/page.tsx              ← Login page
│   │   └── register/page.tsx           ← Register page
│   ├── shop/page.tsx                   ← eBook listing / shop
│   ├── ebook/[id]/page.tsx             ← eBook detail + buy
│   ├── sessions/
│   │   ├── page.tsx                    ← Sessions listing
│   │   └── [id]/page.tsx              ← Session detail + register
│   ├── dashboard/page.tsx              ← User dashboard (my books, sessions)
│   ├── admin/page.tsx                  ← Admin panel
│   └── api/
│       ├── auth/[...nextauth]/route.ts ← NextAuth (login, session)
│       ├── auth/register/route.ts      ← Registration endpoint
│       ├── stripe/checkout/route.ts    ← Create Stripe checkout session
│       ├── webhooks/stripe/route.ts    ← Fulfillment after payment
│       ├── download/[purchaseId]/route.ts ← Secure signed download URL
│       ├── dashboard/route.ts          ← User data for dashboard
│       ├── cron/session-reminders/route.ts ← Hourly cron: reminders + links
│       └── admin/
│           ├── stats/route.ts          ← Admin dashboard stats
│           ├── ebooks/route.ts         ← List + create ebooks
│           └── sessions/
│               ├── route.ts            ← List + create sessions
│               └── [id]/route.ts      ← Update / delete session
├── components/
│   └── layout/
│       ├── Navbar.tsx
│       └── Footer.tsx
├── lib/
│   ├── prisma.ts                       ← Prisma client singleton
│   ├── stripe.ts                       ← Stripe client
│   ├── supabase.ts                     ← Supabase clients (public + admin)
│   └── email.ts                        ← All email templates (Resend)
├── prisma/
│   ├── schema.prisma                   ← Full database schema
│   └── seed.ts                         ← Demo data seeder
├── styles/globals.css                  ← Global CSS + Tailwind
├── middleware.ts                       ← Route protection
├── vercel.json                         ← Cron job config
└── .env.example                        ← Environment variables template
```

---

## 🚀 Setup Instructions

### 1. Clone & Install

```bash
git clone <your-repo-url>
cd sensory-house
npm install
```

### 2. Set Up Environment Variables

```bash
cp .env.example .env.local
```

Then fill in every value in `.env.local`. See the section below for how to get each one.

### 3. Set Up Supabase (Database + Storage)

1. Go to [supabase.com](https://supabase.com) → New project
2. Copy your **Project URL**, **Anon Key**, and **Service Role Key** into `.env.local`
3. Copy the **Database URL** (under Settings → Database → Connection String → URI)
4. Create a **Storage bucket** called `ebooks` — set it to **private**
5. Upload your PDF files to the `ebooks` bucket (e.g. `ebooks/my-book.pdf`)

### 4. Set Up the Database

```bash
npm run db:generate   # Generate Prisma client
npm run db:push       # Push schema to Supabase
npm run db:seed       # Seed with demo data
```

After seeding, you'll have:
- **Admin:** `admin@sensoryhouse.com` / `admin123!`
- **Demo User:** `demo@example.com` / `password123`

### 5. Set Up Stripe

1. Go to [stripe.com](https://stripe.com) → Dashboard → Developers → API Keys
2. Copy your **Secret Key** and **Publishable Key** into `.env.local`
3. Set up a webhook for local development:
   ```bash
   stripe listen --forward-to localhost:3000/api/webhooks/stripe
   ```
4. Copy the **Webhook Secret** (`whsec_...`) into `.env.local`
5. For production: add the webhook endpoint in Stripe Dashboard → Webhooks

### 6. Set Up Resend (Email)

1. Go to [resend.com](https://resend.com) → API Keys → Create
2. Copy the key into `RESEND_API_KEY` in `.env.local`
3. Add and verify your sending domain (or use `@resend.dev` for testing)
4. Update `EMAIL_FROM` with your verified sender address

### 7. Run Locally

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

---

## 🔑 Environment Variables Reference

| Variable | Where to get it |
|---|---|
| `DATABASE_URL` | Supabase → Settings → Database → URI |
| `NEXTAUTH_SECRET` | Run: `openssl rand -base64 32` |
| `NEXTAUTH_URL` | `http://localhost:3000` (dev) or your domain (prod) |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → service_role key |
| `STRIPE_SECRET_KEY` | Stripe → Developers → API Keys → Secret key |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe → Developers → API Keys → Publishable key |
| `STRIPE_WEBHOOK_SECRET` | Stripe CLI output or Stripe Dashboard → Webhooks |
| `RESEND_API_KEY` | Resend → API Keys |
| `EMAIL_FROM` | Your verified sending email |
| `NEXT_PUBLIC_APP_URL` | `http://localhost:3000` (dev) or your domain (prod) |
| `CRON_SECRET` | Any random string — used to secure the cron endpoint |

---

## 🏗 Deployment (Vercel)

1. Push your code to GitHub
2. Import the repo in [vercel.com](https://vercel.com)
3. Add all environment variables in Vercel → Settings → Environment Variables
4. Deploy — Vercel will automatically handle the cron job in `vercel.json`
5. In Stripe Dashboard, add your production webhook URL:
   ```
   https://yourdomain.com/api/webhooks/stripe
   ```

---

## ✉️ Email Flow

| Trigger | Email Sent |
|---|---|
| eBook purchased | Confirmation with link to dashboard |
| Session registered | Confirmation to account email + Gmail |
| 24 hours before session | Reminder to account email + Gmail |
| 1 hour before session | Google Meet link to account email + Gmail |

The cron job (`/api/cron/session-reminders`) runs every hour on Vercel and handles both reminder and link delivery.

---

## 🛡 Security Notes

- eBook files are stored in a **private** Supabase bucket
- Downloads use **signed URLs** that expire after 15 minutes
- Stripe webhooks are verified with a signature secret
- Admin routes are protected by middleware checking the user's `role` field
- Passwords are hashed with `bcrypt` (12 rounds)
- The cron endpoint requires a `CRON_SECRET` Bearer token

---

## 🧩 Extending the Platform

**Add Google OAuth login:**
```bash
# Add to NextAuth providers in app/api/auth/[...nextauth]/route.ts
import GoogleProvider from 'next-auth/providers/google'
// providers: [GoogleProvider({ clientId: ..., clientSecret: ... })]
```

**Add a reviews system:**
The `Review` model is already in the schema. Build a POST `/api/reviews` endpoint and a star-rating component on the ebook detail page.

**Add subscription/membership:**
Replace one-time Stripe payments with `mode: 'subscription'` and Stripe Price IDs for recurring billing.

**Add PDF preview:**
Use `react-pdf` to render the first 2-3 pages of an eBook as a free preview before purchase.

---

## 📦 Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Database | PostgreSQL via Supabase |
| ORM | Prisma |
| Auth | NextAuth.js (Credentials) |
| Payments | Stripe Checkout |
| File Storage | Supabase Storage |
| Email | Resend |
| Cron Jobs | Vercel Cron |
| Deployment | Vercel |

# Sensory-house-GH
