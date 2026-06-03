# Workflow Automation Platform 🚀

A modern **TaskOrbit-inspired workflow automation platform** built with **Next.js, TypeScript, Prisma, PostgreSQL, React Flow, TRPC, Inngest, and Tailwind CSS**. Create visual workflows, connect triggers and actions, and automate tasks across multiple services.

![Workflow Automation Platform](https://img.shields.io/badge/Next.js-16-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Database-blue?logo=postgresql)
![Inngest](https://img.shields.io/badge/Inngest-Workflow-purple)

---

## ✨ Features

### 🔐 Authentication

* User Registration & Login
* Secure Session Management
* Protected Routes
* Credential Management

### 🎨 Visual Workflow Builder

* Drag-and-drop workflow editor
* Built with React Flow
* Visual node connections
* Real-time workflow updates

### ⚡ Triggers

* Manual Trigger
* Google Form Trigger
* Stripe Trigger

### 🤖 Actions

* HTTP Request
* Gemini AI Integration
* Discord Notifications
* WhatsApp Messaging

### 📊 Workflow Executions

* Execution History
* Execution Status Tracking
* Success / Failure Monitoring
* Detailed Execution Logs

### 🔄 Workflow Engine

* Topological Sorting
* Context Passing Between Nodes
* Async Task Execution
* Event-Driven Architecture using Inngest

---

## 🛠 Tech Stack

### Frontend

* Next.js 16
* React
* TypeScript
* Tailwind CSS
* Shadcn/UI
* React Flow
* TanStack Query

### Backend

* TRPC
* Prisma ORM
* PostgreSQL (Neon)
* Better Auth

### Workflow Engine

* Inngest
* Real-time Channels

### Integrations

* Google Forms
* Stripe
* Gemini AI
* Discord
* WhatsApp
* Custom HTTP APIs

---

## 📁 Project Structure

```bash
src/
├── app/
├── components/
├── features/
│   ├── workflows/
│   ├── editor/
│   ├── executions/
│   ├── trigger/
│   └── credentials/
├── inngest/
├── lib/
├── config/
└── trpc/
```

---

## 🚀 Getting Started

### Clone Repository

```bash
git clone https://github.com/omjha-git/workflow-automation-platform.git
cd workflow-automation-platform
```

### Install Dependencies

```bash
npm install
```

### Configure Environment Variables

Create a `.env` file:

```env
DATABASE_URL=
BETTER_AUTH_SECRET=
BETTER_AUTH_URL=

GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

GEMINI_API_KEY=

DISCORD_WEBHOOK_URL=

WHATSAPP_ACCESS_TOKEN=

INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate deploy
```

### Start Development Server

```bash
npm run dev
```

### Start Inngest Dev Server

```bash
npx inngest-cli@latest dev
```

---

## 📸 Workflow Example

```text
Google Form Trigger
          ↓
      Gemini AI
          ↓
 Discord Notification
          ↓
 WhatsApp Message
```

When a Google Form response is submitted:

1. Workflow starts automatically.
2. Gemini processes the response.
3. Result is sent to Discord.
4. WhatsApp notification is delivered.

---

## 🔥 Future Improvements

* Gmail Integration
* Slack Integration
* Telegram Integration
* Workflow Templates
* Team Collaboration
* Version Control
* Analytics Dashboard
* AI Workflow Generation

---

## 👨‍💻 Author

**Om Jha**

* GitHub: [https://github.com/omjha-git](https://github.com/omjha-git)
* LinkedIn: [www.linkedin.com/in/omjha2](http://www.linkedin.com/in/omjha2)

---

## 📄 License

This project is licensed under the MIT License.

---

⭐ If you like this project, consider giving it a star on GitHub!
