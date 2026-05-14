# SOMA Uganda - AI Institutional Platform

SOMA is a production-ready, AI-driven curriculum assistant designed specifically for the Ugandan education system. It empowers teachers to generate NCDC-standard lesson plans, UNEB-style exams, and schemes of work in seconds.

## 🚀 Key Features

- **Institutional Infrastructure:** Role-Based Access Control (RBAC) for Principals, Teachers, and Secretaries.
- **Ugandan Soul:** AI prompts grounded in NCDC syllabi and UNEB assessment rubrics.
- **Secretary Print Queue:** A dedicated workflow for administrative document management.
- **Stealth Licensing:** A secure 16-character voucher system for school-wide activations.
- **Super-Admin Portal:** A centralized dashboard for platform owners to monitor school usage and revenue.

## 🛠️ Technology Stack

- **Frontend:** React (Vite) + Tailwind CSS (v4)
- **State Management:** Zustand
- **Animations:** GSAP + Framer Motion
- **AI Engine:** Google Gemini 2.0 Flash / Flash-Lite
- **Backend/DB:** Supabase (PostgreSQL)
- **Deployment:** Vercel

## 📦 Setup & Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd soma-uganda
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment:**
   Create a `.env` file in the root directory (never commit this to Git):
   ```env
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   GEMINI_API_KEY=your_google_gemini_key
   ```

4. **Run Locally:**
   ```bash
   npm run dev
   ```

## 🔐 Deployment

The project is optimized for deployment on **Vercel**. 
1. Push your code to GitHub (excluding `.env`).
2. Import the project into Vercel.
3. Add the environment variables in the Vercel Dashboard.

---

© 2026 SOMA Uganda. Professional AI for Ugandan Schools.
