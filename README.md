# Core CRM
![image](https://github.com/user-attachments/assets/b4d21c1c-af9d-4891-8af4-9c66bb823126)


**A Modern Customer Relationship Management Platform**

[Live Demo](https://core-crm-22bcs14907.vercel.app/) | [GitHub Repository](https://github.com/aarushikapoor2004/core-crm)

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Database Schema](#database-schema)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Overview

Core CRM is a full-stack Customer Relationship Management platform designed for modern businesses. It combines intelligent customer segmentation, AI-powered campaign generation, and real-time analytics to help companies build stronger customer relationships and drive growth.

### Why Core CRM?

- **AI-Powered**: Leverage GPT-4 for intelligent customer segmentation and personalized campaign creation
- **High Performance**: Built with Next.js 14 and optimized for speed and scalability
- **Modern UI**: Clean, responsive interface with dark/light mode support
- **Secure**: Enterprise-grade authentication with Google OAuth 2.0
- **Data-Driven**: Real-time analytics and insights dashboard
- **Developer-Friendly**: Well-documented API and modular architecture

## Key Features

### Authentication & Security

- **Google OAuth 2.0** integration via NextAuth.js
- **Protected Routes** with session-based access control
- **Secure API** endpoints with authentication middleware
- **Role-based permissions** (Admin, Manager, User)

### Dashboard & Analytics

- **Real-time data visualization** with interactive charts
- **Customer lifecycle tracking** and engagement metrics
- **Order analytics** with revenue insights
- **Search & filtering** with advanced query capabilities
- **Keyboard navigation** for power users

### AI-Powered Customer Segmentation

- **Dynamic Rule Builder** with intuitive drag-and-drop interface
- **Natural Language Processing** - convert plain English to logical rules
- **Boolean Logic Support** - complex AND/OR condition combinations

### User Experience

- **Responsive Design** - works perfectly on desktop, tablet, and mobile
- **Dark/Light Mode** - automatic theme switching based on user preference

## Tech Stack

### Frontend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js** | React Framework | 14.x |
| **React** | UI Library | 18.x |
| **TypeScript** | Type Safety | 5.x |
| **Tailwind CSS** | Styling Framework | 3.x |
| **ShadCN/UI** | Component Library | Latest |
| **React Hook Form** | Form Management | 7.x |
| **TanStack Table** | Data Tables | 8.x |
| **Recharts** | Data Visualization | 2.x |

### Backend

| Technology | Purpose | Version |
|------------|---------|---------|
| **Next.js API Routes** | Backend API | 14.x |
| **NextAuth.js** | Authentication | 4.x |
| **Prisma** | Database ORM | 5.x |
| **PostgreSQL** | Primary Database | 15.x |
| **Zod** | Schema Validation | 3.x |

### AI & External Services

| Service | Purpose | Integration |
|---------|---------|-------------|
| **OpenAI API** | AI Content Generation | GPT-4 |
| **Google OAuth** | User Authentication | OAuth 2.0 |
| **Webhook API** | Real-time Updates | Custom Implementation |

### DevOps & Deployment

| Tool | Purpose |
|------|---------|
| **Vercel** | Hosting & Deployment |
| **ESLint** | Code Linting |
| **Prettier** | Code Formatting |

## Architecture
![image](https://github.com/user-attachments/assets/6763448d-4ad1-44fc-9fc9-7f9819acfbff)

### Architecture Overview

Core CRM follows a **modern full-stack architecture** with clear separation of concerns:

#### Frontend Layer

- **Next.js App Router** for server-side rendering and routing
- **React Server Components** for optimal performance
- **Client-side state management** with React hooks
- **Responsive UI components** built with Tailwind CSS and ShadCN

#### API Layer

- **RESTful API design** with Next.js API routes
- **Authentication middleware** for protected endpoints
- **Input validation** using Zod schemas
- **Error handling** with structured error responses

#### Business Logic Layer

- **Service layer** for business logic separation
- **AI integration** for intelligent features

#### Data Layer

- **PostgreSQL** as primary database
- **Prisma ORM** for type-safe database operations
- **Connection pooling** for optimal performance
- **Database migrations** and seeding

## Database Schema

![image](https://github.com/user-attachments/assets/21761bbb-7e7c-4436-903d-b22467216a06)


## API Documentation

### Authentication

All API endpoints require authentication via NextAuth.js session cookies.

### Customer Management

-  `POST /api/customers`
- `POST /apoi/orders`


**Query Parameters:**

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search term for name/email
- `sortBy`: Sort field (name, email, totalSpent, createdAt)
- `sortOrder`: Sort direction (asc, desc)


## Getting Started

### Prerequisites

- **Node.js** 18.x or higher
- **PostgreSQL** 15.x or higher
- **npm** or **yarn** or **pnpm** package manager

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/core-crm.git
   cd core-crm
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Set up the database**

   ```bash
   # Generate Prisma client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev

   # Seed database (optional)
   npx prisma db seed
   ```

5. **Start the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Environment Variables

Create a `.env.local` file in the root directory:

```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/core_crm"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"

# Webhook Configuration
WEBHOOK_SECRET="your-webhook-secret"
```

### Required API Keys

1. **Google OAuth**: Get credentials from [Google Cloud Console](https://console.cloud.google.com/)
2. **Gemini API**: Get your API key
3. **Database**: Set up PostgreSQL locally or use a cloud provider or use docker compose file provided in root of the project

## Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**

   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Deploy to Vercel**

   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push to main branch

3. **Set up database**

   - Use Vercel Postgres or external PostgreSQL provider
   - Run migrations in production environment

### Manual Deployment

1. **Build the application**

   ```bash
   npm run build
   ```

2. **Start production server**

   ```bash
   npm start
   ```

## Acknowledgments

- **Next.js Team** for the amazing framework
- **Vercel** for hosting and deployment platform
- **OpenAI** for AI capabilities
- **ShadCN** for beautiful UI components
- **Prisma** for the excellent ORM

---

**Built with ❤️ by Aarushi Kapoor**

[Live Demo](https://core-crm-22bcs14907.vercel.app/) • [GitHub](https://github.com/aarushikapoor2004/core-crm) • [Contact](mailto:aarushik250@gmail.com)
