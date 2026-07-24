# BizEventBridge

Connects college event organizers with business sponsors. Organizers list
events; sponsors browse and reach out (or vice versa); both sides negotiate
in real-time chat and track deals through a pipeline (New → In Talks →
Confirmed).

## Structure

```
biz-event-bridge/
├── frontend/   React + Vite + TypeScript (the original UI, untouched visually)
└── backend/    Node.js + Express + MongoDB + Socket.io (new)
```

## Quick start (local)

**1. Backend**
```bash
cd backend
npm install
cp .env.example .env
# Get a free MongoDB Atlas connection string (see backend/README.md), paste into MONGO_URI
# Generate a JWT_SECRET: openssl rand -base64 48
npm run seed     # populates demo events + sponsors; login with password123
npm run dev      # http://localhost:5000
```

**2. Frontend**
```bash
cd frontend
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev            # http://localhost:8080
```

Demo logins after seeding (all password123):
- Organizer: `aarav@iitbombay.edu`
- Sponsor: `priya@freshbrew.com`

## Deploying

- **Backend → Railway**: see `backend/README.md` for exact steps (env vars,
  root directory setting, etc.)
- **Frontend → Vercel/Netlify**: set `VITE_API_URL` to your Railway URL as
  a build-time environment variable, then deploy the `frontend/` folder as
  a standard Vite app (`npm run build`, output in `dist/`).
- Once both are live, update the backend's `CLIENT_ORIGINS` env var to your
  deployed frontend URL so CORS allows it.

## What changed from the original

The original project was UI-only — every page used hardcoded mock arrays,
login didn't check any password, and buttons like search/filter/"list an
event" didn't do anything. None of the visual design was touched. What was
added:

- **Full backend**: Express + MongoDB, JWT auth with bcrypt, Zod-validated
  REST API for events, sponsor profiles, and an organizer↔sponsor
  conversation/pipeline model.
- **Real-time chat** via Socket.io (with a REST fallback + polling so it
  still works if a socket connection drops).
- **Real auth**: registration/login now actually validates credentials;
  dashboards are behind a route guard and require the correct role.
- **Working search/filter** on the Events and Sponsors pages.
- **A working "list a new event" flow** (dialog form → real event in the DB).
- **A working "sponsor this event" / "contact sponsor" flow** that creates a
  real conversation thread and shows up in both dashboards' inboxes, with
  status tracking (New/In Talks/Confirmed) editable from the chat dialog.
- Fixed a bug where the password field on both registration forms was
  missing its `name` attribute, so passwords were silently never submitted.

### Known simplifications (worth knowing about)
- The sponsor detail page originally had a lot of extra hardcoded content
  (product catalogs, a demo video thumbnail, Instagram follower counts,
  past-sponsored-event galleries). None of that has a real data source yet,
  so those sections were removed rather than left as fake/hardcoded data.
  If you want them, the sponsor profile model (`backend/src/models/SponsorProfile.js`)
  is the place to add fields like `products`, `pastEvents`, etc., along with
  a corresponding editor UI (not currently built).
- Image uploads aren't wired up — `images` fields accept URLs today. Adding
  actual file upload (e.g. to S3/Cloudinary) would be a follow-up.
- No email verification / password reset flow yet.
