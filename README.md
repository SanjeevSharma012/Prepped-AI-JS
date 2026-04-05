# Prepped — AI Mock Interview Platform

100% free, open-source AI mock interview platform. No login, no signup — just open and practise.

## Stack
- **Next.js 14** App Router (JavaScript)
- **Prisma** + PostgreSQL — sessions and answers saved automatically
- **Claude API** (Anthropic) — question generation + answer evaluation
- **Tailwind CSS**

## Folder structure

```
/prepped-js
├── app/
│   ├── page.jsx                        ← Landing page
│   ├── interview/page.jsx              ← Full interview flow
│   ├── dashboard/page.jsx              ← Session history
│   ├── globals.css
│   ├── layout.jsx
│   └── api/
│       ├── generate-questions/route.js ← AI question generation (server)
│       ├── evaluate/route.js           ← AI evaluation + DB save (server)
│       └── sessions/route.js           ← Fetch past sessions
├── components/
│   └── nav.jsx                         ← Navigation bar
├── lib/
│   ├── prisma.js                       ← DB client singleton
│   ├── ai.js                           ← Claude API helpers
│   └── questions.js                    ← 177-question bank + smart picker
├── prisma/
│   └── schema.prisma                   ← Database schema
├── .env                                ← Your API key + DB URL
├── jsconfig.json                       ← Path aliases (@/*)
├── next.config.js
├── tailwind.config.js
└── package.json
```

## Setup (5 steps)

### 1. Install dependencies
```bash
npm install
```

### 2. Fill in .env
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/prepped"
ANTHROPIC_API_KEY="sk-ant-..."
```
Get your API key from https://console.anthropic.com

### 3. Start PostgreSQL with Docker
```bash
docker run --name prepped-db \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=prepped \
  -p 5432:5432 -d postgres:15
```

### 4. Create database tables
```bash
npx prisma db push
```

### 5. Run
```bash
npm run dev
# → http://localhost:3000
```

## Every time you restart your computer
```bash
docker start prepped-db
npm run dev
```

## Features
- **Q1 always:** "Tell me about yourself" — every session, every role
- **177 questions** across 7 roles (Dev, Data & AI, DevOps, QA, Security, Design, Management)
- **Smart rotation** — different 8 questions every session based on level
- **AI question generation** — paste a job description for targeted questions
- **AI evaluation** — score, what worked, what was missing, stronger model answer
- **Answer recording** — live timer + word count + STAR detection
- **Attempt history** — retries saved with "what you added" diff
- **Dashboard** — all sessions saved to PostgreSQL automatically
- **No login required** — completely open and free
