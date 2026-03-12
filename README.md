# 🚀 WDC — Web App Developers of Chicago

A premium, high-performance agency portfolio built with modern web technologies. Features stunning animations, a fully automated blog system, and a powerful admin dashboard.

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-3178C6?logo=typescript&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-7.3-646CFF?logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?logo=tailwindcss&logoColor=white)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-FF0050?logo=framer&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3FCF8E?logo=supabase&logoColor=white)

---

## ✨ Features

- **🎨 Premium Design** — Dark-mode glassmorphism UI with smooth micro-animations (Framer Motion + GSAP)
- **📝 Auto-Synced Blog** — Blog posts are fetched live from [Dev.to](https://dev.to) via API — publish on Dev.to, it appears on your site instantly
- **📢 Smart Announcement Bar** — Automatically highlights your latest Dev.to article; falls back to a custom CTA
- **🖥️ Admin Dashboard** — Protected admin panel to manage projects and content via Supabase
- **📱 Fully Responsive** — Optimized for all screen sizes with mobile-first design
- **⚡ Lightning Fast** — Built on Vite with code-splitting and optimized asset loading
- **🔍 SEO Optimized** — Structured data (JSON-LD), Open Graph, Twitter Cards, and semantic HTML

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript, Vite |
| **Styling** | Tailwind CSS 4, Custom CSS |
| **Animations** | Framer Motion, GSAP + ScrollTrigger |
| **Backend** | Supabase (Auth, Database, Storage) |
| **Blog Engine** | Dev.to API (auto-synced) |
| **Routing** | React Router v7 |
| **State** | TanStack React Query |
| **Icons** | Lucide React |

## 📂 Project Structure

```
src/
├── admin/              # Protected admin dashboard
│   ├── AdminLayout.tsx
│   ├── Dashboard.tsx
│   ├── ManageProjects.tsx
│   └── ManageBlogs.tsx
├── assets/             # Images & static assets
├── components/         # Reusable UI components
│   ├── Header.tsx
│   ├── Hero.tsx
│   ├── Services.tsx
│   ├── Projects.tsx
│   ├── WorkExperience.tsx
│   ├── Testimonials.tsx
│   ├── Blog.tsx
│   ├── Contact.tsx
│   ├── Footer.tsx
│   ├── AnnouncementBar.tsx
│   └── ui/             # shadcn/ui primitives
├── contexts/           # Auth context
├── hooks/              # Custom React hooks
├── lib/                # Supabase client config
├── pages/              # Route-level pages
│   ├── Index.tsx
│   ├── BlogList.tsx
│   ├── BlogPost.tsx
│   └── Login.tsx
├── routes/             # Protected route wrapper
├── services/           # API service layer
│   ├── public.api.ts   # Dev.to + Supabase fetchers
│   └── admin.api.ts    # Admin CRUD operations
├── types/              # TypeScript interfaces
└── utils/              # Helpers & formatters
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/usmanimran-dev/Webappdevelopersofchicago.git
cd Webappdevelopersofchicago

# Install dependencies
npm install

# Start development server
npm run dev
```

### Environment Variables

Create a `.env` file in the root:

```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📝 Blog System

The blog is **fully automated** via the Dev.to API:

1. Write and publish an article on [dev.to](https://dev.to)
2. Your website's `/blog` page automatically displays it
3. The announcement bar highlights your latest post
4. Individual blog posts are rendered with full HTML at `/blog/:slug`

No code changes needed — just write and publish!

## 📄 License

This project is proprietary. All rights reserved.

---

<p align="center">
  Built with ❤️ by <strong>WDC</strong> — Web App Developers of Chicago
</p>
