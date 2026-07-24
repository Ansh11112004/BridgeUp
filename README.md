# BizEventBridge

A full-stack platform connecting **college event organizers** with **business
sponsors** — browse events or sponsors, start a conversation, negotiate in
real time, and track every deal through a pipeline from first contact to
confirmed sponsorship.

<!-- Add a real link once deployed: -->
<!-- 🔗 **Live demo:** https://your-app.vercel.app -->

---

## Features

- 🔐 **Role-based auth** — separate organizer and sponsor accounts, JWT-secured
- 🔍 **Live search & filtering** for events and sponsors
- 💬 **Real-time chat** between organizers and sponsors via Socket.io
- 📊 **Deal pipeline** — every conversation tracked as New → In Talks → Confirmed
- 📅 **Event listings** with budget, footfall, stall types, highlights, and photo galleries
- 🧑‍💼 **Two dashboards** — organizers manage events & inbound sponsor interest;
  sponsors manage outreach & active sponsorships
- 📸 **Client-side image pipeline** — photos are resized/compressed in-browser,
  no external storage service required

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, TypeScript, Vite, Tailwind CSS, shadcn/ui, React Query, Framer Motion |
| Backend | Node.js, Express, MongoDB (Mongoose), Socket.io |
| Auth | JWT + bcrypt |
| Validation | Zod |
| Real-time | Socket.io (room-based conversations, typing indicators) |
| Deployment | Vercel/Netlify (frontend) · Railway (backend) · MongoDB Atlas (database) |

## Architecture

```
┌─────────────────┐        REST + WebSocket        ┌──────────────────┐
│                 │ ─────────────────────────────▶ │                  │
│  React Frontend │                                 │  Express Backend │
│  (Vite + TS)    │ ◀───────────────────────────── │  + Socket.io     │
│                 │                                 │                  │
└─────────────────┘                                 └────────┬─────────┘
                                                               │
                                                               ▼
                                                      ┌──────────────────┐
                                                      │  MongoDB Atlas   │
                                                      └──────────────────┘
```

**Data model:** `User` (organizer/sponsor) → `Event` (owned by organizer) →
`Interest` (one conversation thread per event↔sponsor pair, also the pipeline
status object) → `Message` (chat history within a thread).

## Project Structure

```
biz-event-bridge/
├── frontend/               React app
│   ├── src/
│   │   ├── pages/          Route-level pages (Events, Sponsors, Dashboards, etc.)
│   │   ├── components/     Reusable UI (shadcn/ui + custom: chat, forms, tag input)
│   │   ├── hooks/          React Query hooks (useEvents, useSponsors, useInterests, useChat)
│   │   ├── contexts/       AuthContext
│   │   └── lib/            API client, Socket.io client, shared types
│   └── .env.example
│
└── backend/                Express API
    ├── src/
    │   ├── models/         User, Event, SponsorProfile, Interest, Message
    │   ├── controllers/    Route handlers (auth, events, sponsors, interests, messages)
    │   ├── routes/          Express routers
    │   ├── middleware/     JWT auth guard, role guard, error handler
    │   ├── sockets/        Socket.io chat handler
    │   └── config/         Database connection
    ├── server.js            Entry point
    └── .env.example
```

## Getting Started

### Prerequisites
- Node.js 18+
- A MongoDB database ([Atlas free tier](https://www.mongodb.com/cloud/atlas/register) works well)

### 1. Backend

```bash
cd backend
npm install
cp .env.example .env
```

Fill in `.env`:
```
MONGO_URI=<your MongoDB connection string>
JWT_SECRET=<generate with: openssl rand -base64 48>
```

```bash
npm run seed    # optional — populates demo events/sponsors (login: password123)
npm run dev     # http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
npm install
cp .env.example .env    # default VITE_API_URL=http://localhost:5000 works for local dev
npm run dev              # http://localhost:8080
```

### 3. Try it out
- Organizer demo login: `aarav@iitbombay.edu` / `password123`
- Sponsor demo login: `priya@freshbrew.com` / `password123`

## API Overview

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/api/auth/register` | – | Create account |
| POST | `/api/auth/login` | – | Login, returns JWT |
| GET | `/api/auth/me` | ✅ | Current user |
| GET | `/api/events` | – | List events (search/category/location filters) |
| GET | `/api/events/mine` | organizer | Organizer's own events |
| POST | `/api/events` | organizer | Create event |
| GET | `/api/sponsors` | – | List sponsor profiles |
| POST | `/api/sponsors` | sponsor | Create/update own profile |
| POST | `/api/interests` | ✅ | Start/continue a conversation about an event |
| GET | `/api/interests/mine` | ✅ | Role-aware dashboard inbox |
| PATCH | `/api/interests/:id/status` | ✅ (participant) | Update pipeline status |
| GET/POST | `/api/interests/:id/messages` | ✅ (participant) | Chat history / send (REST fallback) |

Real-time chat runs over Socket.io alongside these routes — see
[`backend/README.md`](backend/README.md) for the event contract.

## Security

- Passwords hashed with bcrypt, never returned in API responses
- JWT-based auth with configurable expiry
- Request validation on every endpoint via Zod
- Rate limiting on auth routes, CORS allowlisting, MongoDB query sanitization (helmet + express-mongo-sanitize)

## Deployment

- **Backend → Railway**: connect the repo, set `Root Directory` to `backend`,
  add the environment variables from `.env.example`. Full steps in
  [`backend/README.md`](backend/README.md).
- **Frontend → Vercel/Netlify**: deploy `frontend/` as a standard Vite app,
  set `VITE_API_URL` to your Railway URL.
- Update the backend's `CLIENT_ORIGINS` env var to your deployed frontend URL.

## Known Limitations / Roadmap

- Images are stored as compressed data URLs in MongoDB rather than an object
  store (S3/Cloudinary) — fine for a handful of photos per event, but would
  need real file storage to scale
- No email verification or password reset flow yet
- Sponsor profiles don't yet support richer content (product catalogs, past
  sponsorship galleries) — `SponsorProfile` model would need extending

## License

MIT
