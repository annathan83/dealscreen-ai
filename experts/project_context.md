# Project Context — DealHub AI

Project: DealHub AI

Purpose:
A web-first deal workspace for acquisition entrepreneurs and investors to organize deal information, notes, uploaded files, financials, contracts, and AI-assisted first-pass analysis. Structure should stay reusable for a future PWA or React Native client if needed.

Target users:
- Acquisition entrepreneurs
- Search fund operators
- Private investors
- Small business buyers
- Consultants evaluating deals

Core stack:
- Next.js 14 App Router, TypeScript, React server components and server actions
- Supabase (Postgres, Auth, Storage); RLS on all tables
- Tailwind CSS, design tokens, shadcn-style UI
- Google Drive API (per-user OAuth, drive.file scope)
- OpenAI API (extraction, scoring, narrative analysis)

Core features:
- Deal dashboard
- Deal workspace
- Notes
- File upload
- Timeline / activity log
- Google Drive-backed deal folders
- Future AI document analysis

Business priorities:
- Fast MVP delivery
- Clean architecture
- Strong security
- Web-first UX (mobile-responsive)
- Future paid subscription model

Security priority:
High. The app may store confidential financial, legal, and acquisition-related material.

Collaboration principle:
All experts should reference this file before making recommendations. For implementation conventions, schema, migrations, and code structure, experts should also follow `AGENTS.md` at the project root.
