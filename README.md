# TaskManager — Kanban Board (Next.js + Supabase)

A clean, fast Kanban-style task manager. Create projects, add tasks, drag them across columns, and track completion with a donut chart.

> **Mode:** This README documents a **no-auth** setup (public/anonymous access). An optional “Enable Auth later” section is included at the end if you want to lock it down by user.

---
![tm1](https://github.com/user-attachments/assets/3e20a508-b450-4693-b5da-83c7c8d5fb9a)

## Features

- Multiple **Projects** with per-project **Kanban Board** (Todo / In-Progress / Done)
- Drag & drop between columns
- Donut progress chart + stat cards
- Global search box for tasks
- Smooth UX: toasts, counters, responsive layout
- Built on **Next.js (App Router)** + **Supabase** + **TailwindCSS**

---

## Tech Stack

- **Frontend:** Next.js (App Router, React), TailwindCSS
- **DB & API:** Supabase (Postgres + RLS)
- **UI Utils:** sonner (toasts), lucide-react (icons), react-countup
- **Charts:** Custom DonutChart component (SSR disabled via `next/dynamic`)


### Getting Started

## Website

Deployed on Vercel

https://task-manager-two-orcin.vercel.app/