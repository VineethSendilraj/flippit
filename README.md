# Flippit

AI-powered arbitrage platform for luxury jewelry and watches.

## Getting Started

Both frontend and backend use pnpm for package management.

### Frontend Development

```bash
cd frontend
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the frontend.

### Backend Development

```bash
cd backend
pnpm install
pnpm dev
```

The backend API will run on [http://localhost:3001](http://localhost:3001).

### Development Workflow

Run both simultaneously:

```bash
# Terminal 1 - Frontend
cd frontend && pnpm dev

# Terminal 2 - Backend  
cd backend && pnpm dev
```

## Project Structure

- `frontend/` - Next.js application
- `backend/` - Express.js API server

## Features

- AI-powered search for luxury retailers
- Buy/sell mode analysis
- Automated calling integration
- Real-time arbitrage opportunities
- Supabase integration for data storage

## Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js, TypeScript
- **Database**: Supabase
- **AI/API**: Perplexity, OpenAI
- **Voice**: VAPI integration
