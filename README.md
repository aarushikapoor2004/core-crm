# 🧠 Core CRM

A full-stack CRM platform for customer segmentation, personalized campaigns, and AI-powered insights.

[🌐 Live Demo](https://core-crm-22bcs14907.vercel.app/)

---

## 🔧 Tech Stack

- **Frontend & Backend:** Next.js (React)
- **Database:** PostgreSQL
- **ORM:** Prisma
- **Authentication:** NextAuth.js (Google OAuth 2.0)
- **UI:** Tailwind CSS, ShadCN
- **Forms:** React Hook Form
- **Tables:** TanStack Table
- **Deployment:** Vercel
- **AI:** OpenAI GPT for message and rule generation

---

## 🚀 Features

### ✅ Authentication
- Google OAuth via NextAuth.js
- Route protection and session handling

### 📊 Dashboard
- Paginated customer & order table
- Global search (Cmd/Ctrl + K)

### 🧩 Customer Segmentation
- Visual rule builder with AND/OR logic
- Real-time audience size preview
- Natural language to rules via AI

### 📣 Campaigns
- Message creation & variant suggestions (via OpenAI)
- Simulated delivery via dummy vendor API
- Tracks delivery receipts with webhook

### 🌗 UI & UX
- Dark/light mode toggle
- Fully responsive

---

## 🧠 AI Integration

- Convert prompts like `"Users who haven’t shopped in 6 months and spent ₹5K+"` into segment rules.
- Suggest message variants tailored to campaign goals.

---

## 🏗️ Architecture

```mermaid
graph TD
  A[User] --> B[Next.js Frontend]
  B --> C[API Routes]
  C --> D[Prisma ORM]
  D --> E[PostgreSQL]
  C --> F[NextAuth (Google OAuth)]
  C --> G[OpenAI API]
  C --> H[Dummy Vendor API]
  H --> I[Delivery Receipt API]
  I --> D
