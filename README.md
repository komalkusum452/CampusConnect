# 🎓 CampusConnect

CampusConnect is a full-stack campus management platform built to streamline day-to-day student and administrator activities. It provides a centralized dashboard with secure authentication, AI-powered notice management, Lost & Found tracking, and Event Management, all backed by Supabase and enhanced with Google's Gemini API.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- Secure email/password authentication using Supabase Auth
- Session persistence across browser refreshes
- Role-based access control (Student/Admin)
- Protected routes using Next.js Middleware
- Automatic user profile creation after registration

---

### 📢 AI-Powered Notice Board
- Admins can create, pin, edit, and delete notices
- Category-based notice filtering
- Individual notice detail pages
- Gemini AI automatically generates concise notice summaries
- Pinned notices displayed at the top

---

### 🎒 Lost & Found
- Report lost and found items
- Upload images using Supabase Storage
- Gemini AI automatically generates relevant tags
- Filter by Lost/Found type and status
- Owner-only permission to mark items as resolved
- Real-time status tracking

---

### 📅 Event Management
- Admin event creation
- Student event registration
- Upcoming and Past event categorization
- Duplicate registration prevention
- Automatic **"Full"** status when capacity is reached
- Category-based filtering

---

## 🛠️ Tech Stack

### Frontend
- Next.js (App Router)
- React.js
- TypeScript
- Tailwind CSS

### Backend
- Supabase
- PostgreSQL
- Supabase Auth
- Supabase Storage

### AI
- Gemini API

## 📂 Project Structure

```
app/
├── dashboard/
├── login/
├── register/
├── notices/
├── lost-found/
├── events/
├── middleware.ts
├── lib/
│   └── supabase.ts
└── api/
```

---

## ✨ AI Features

### Notice Summarizer
Generates concise summaries for every notice using Gemini API.

### Lost & Found Auto-Tagging
Automatically generates relevant tags based on the item's title and description to improve discoverability.

---

## 🔒 Security Features

- Authentication with Supabase Auth
- Session persistence
- Protected routes via Next.js Middleware
- Role-based authorization
- Owner-only access for sensitive actions

Built as a modern full-stack campus utility platform leveraging AI to simplify everyday campus workflows.
