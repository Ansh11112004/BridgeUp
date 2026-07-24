# BizEventBridge API

Node.js + Express + MongoDB backend for the BizEventBridge app, with real-time
chat via Socket.io.

## Stack
- Express 4, Mongoose 8 (MongoDB)
- JWT auth (bcrypt password hashing)
- Socket.io for real-time organizer↔sponsor chat
- Zod for request validation
- helmet, cors, express-rate-limit, express-mongo-sanitize for hardening

## Local setup

```bash
cd backend
npm install
cp .env.example .env
# fill in MONGO_URI (Atlas free tier works) and JWT_SECRET
npm run seed   # optional: populates demo events/sponsors, password123 for all
npm run dev    # starts on http://localhost:5000
```

Get a free MongoDB: https://www.mongodb.com/cloud/atlas/register — create a
cluster, add a database user, allow access from anywhere (0.0.0.0/0) for
Railway to connect, then copy the connection string into `MONGO_URI`.

## API overview

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | /api/auth/register | – | Create account (organizer or sponsor) |
| POST | /api/auth/login | – | Login, returns JWT |
| GET | /api/auth/me | required | Current user |
| GET | /api/events | – | List live events (search/category/location query params) |
| GET | /api/events/mine | organizer | Organizer's own events |
| GET | /api/events/:id | – | Event detail |
| POST | /api/events | organizer | Create event |
| PATCH | /api/events/:id | organizer (owner) | Update event |
| DELETE | /api/events/:id | organizer (owner) | Delete event |
| GET | /api/sponsors | – | List sponsor profiles |
| GET | /api/sponsors/me | sponsor | Own profile |
| GET | /api/sponsors/:id | – | Sponsor detail |
| POST | /api/sponsors | sponsor | Create/update own profile |
| POST | /api/interests | required | Start/continue a conversation about an event |
| GET | /api/interests/mine | required | Dashboard inbox (role-aware) |
| GET | /api/interests/:id | required (participant) | One conversation |
| PATCH | /api/interests/:id/status | required (participant) | new/in-talks/confirmed |
| GET | /api/interests/:id/messages | required (participant) | Chat history |
| POST | /api/interests/:id/messages | required (participant) | Send message (REST fallback) |
| GET | /api/health | – | Health check |

## Real-time chat (Socket.io)

Connect with the JWT in the auth payload:

```js
const socket = io(API_URL, { auth: { token: jwtToken } });
socket.emit("join_conversation", interestId);
socket.emit("send_message", { interestId, text }, (ack) => {...});
socket.on("new_message", (message) => {...});
socket.on("typing", ({ userId, isTyping }) => {...});
```

## Deploying to Railway

1. Push this `backend/` folder to a GitHub repo (or a subfolder of your repo —
   set Railway's "Root Directory" to `backend`).
2. On https://railway.app, "New Project" → "Deploy from GitHub repo".
3. Add environment variables in Railway's dashboard: `MONGO_URI`,
   `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_ORIGINS` (your deployed frontend
   URL, e.g. `https://your-app.vercel.app`), `NODE_ENV=production`.
4. Railway auto-detects `npm start`. It also sets `PORT` automatically — the
   app already reads `process.env.PORT`.
5. Once deployed, copy the Railway-issued URL — you'll need it as
   `VITE_API_URL` on the frontend.
6. Run the seed script once against production data if you want demo content:
   `railway run npm run seed` (or run it locally pointed at the same
   `MONGO_URI`).

## Security notes
- Passwords are hashed with bcrypt, never stored or returned in plaintext.
- JWTs expire after `JWT_EXPIRES_IN` (default 7 days).
- CORS is locked to the origins listed in `CLIENT_ORIGINS`.
- Auth routes are rate-limited (50 requests / 15 min / IP) to slow brute force.
- All request bodies are validated with Zod before touching the database.
