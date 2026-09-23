# MERN Thinkboard

A full-stack notes application built with MongoDB, Express, React, and Node.js. Create, browse, edit, and delete notes through a responsive interface backed by a REST API.

**[Live demo → thinkboard.konradpatla.pl](https://thinkboard.konradpatla.pl/)**

> Learning project built while following the **Codesistency** course and later extended as part of my full-stack development practice.

## Features

- Create notes with a title and content.
- Browse notes in a responsive card grid, with the newest notes first.
- Open a note to view and edit its contents.
- Delete notes with a confirmation prompt.
- Persist notes in MongoDB with creation and update timestamps.
- Display loading states, empty states, and toast notifications.
- Handle rate-limit responses with a dedicated UI.
- Limit requests using Upstash Redis and a sliding-window algorithm.

The application currently uses a shared notes collection without user accounts or per-user access controls. Notes in the public demo can be viewed, edited, and deleted by other visitors.

## Tech Stack

| Area | Technologies |
| --- | --- |
| Frontend | React 19, JavaScript, Vite, React Router |
| Styling | Tailwind CSS 3, DaisyUI, Lucide icons |
| HTTP requests | Axios |
| Notifications | React Hot Toast |
| Backend | Node.js, Express 4 |
| Database | MongoDB, Mongoose |
| Rate limiting | Upstash Redis, @upstash/ratelimit |
| Development tools | Nodemon, ESLint |

## Architecture

React communicates with the Express REST API through Axios. Controllers read and update notes using Mongoose, while Upstash Redis tracks request usage.

During local development, Vite and Express run separately on ports `5173` and `5001`. In production, Express also serves the compiled frontend from `frontend/dist`, and the client sends API requests to the same origin under `/api`.

The rate limiter currently uses a shared key for all visitors and allows **100 requests per 60-second sliding window**. It runs before the API routes and production static-file middleware, so requests for frontend assets also pass through it.

## Project Structure

| Path | Purpose |
| --- | --- |
| `backend/src/server.js` | Express setup and application startup |
| `backend/src/config/` | MongoDB and Upstash configuration |
| `backend/src/controllers/` | Note operations |
| `backend/src/routes/` | REST API routes |
| `backend/src/models/` | Mongoose note schema |
| `backend/src/middleware/` | Rate-limiting middleware |
| `frontend/src/pages/` | Notes list, creation form, and note editor |
| `frontend/src/components/` | Navigation, note cards, and status UI |
| `frontend/src/lib/` | Axios configuration and utilities |

## Local Development

### Prerequisites

- Node.js compatible with the frontend tooling, such as Node.js 24, and npm.
- A MongoDB database, locally or on MongoDB Atlas.
- An Upstash Redis database with REST API credentials.

### 1. Clone and install

```bash
git clone https://github.com/konrad3211/mern-thinkboard.git
cd mern-thinkboard
npm ci --prefix backend
npm ci --prefix frontend
```

### 2. Configure the backend

Create `backend/.env`:

```dotenv
PORT=5001
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/thinkboard

UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

Use your Atlas connection string instead of the local `MONGO_URI` if needed. Copy the Redis REST URL and token from your Upstash database settings. Keep credentials out of version control.

No frontend environment file is required by the current implementation.

### 3. Start both services

From the repository root, start the backend:

```bash
npm run dev --prefix backend
```

In a second terminal, start the frontend:

```bash
npm run dev --prefix frontend
```

Open **http://localhost:5173**. The API runs at **http://localhost:5001/api/notes**.

The development API URL and allowed frontend origin are configured in `frontend/src/lib/axios.js` and `backend/src/server.js`. Update both if you change the development ports.

## REST API

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/notes` | List all notes, newest first |
| GET | `/api/notes/:id` | Retrieve one note |
| POST | `/api/notes` | Create a note |
| PUT | `/api/notes/:id` | Update a note |
| DELETE | `/api/notes/:id` | Delete a note |

Create and update requests accept JSON:

```json
{
  "title": "Project ideas",
  "content": "Add search and categories to the notes board."
}
```

The API returns `404` when a note is not found and `429` when the request limit is exceeded.

## Available Commands

Run these commands from the repository root:

| Command | Purpose |
| --- | --- |
| `npm run dev --prefix backend` | Start Express with nodemon |
| `npm run dev --prefix frontend` | Start the Vite development server |
| `npm run lint --prefix frontend` | Run frontend ESLint checks |
| `npm run build --prefix frontend` | Build the frontend |
| `npm run build` | Install backend/frontend dependencies and build the frontend |
| `npm start` | Start the backend |

Automated tests are not currently configured.

## Production Build

Configure the backend environment, then run from the repository root on Linux or macOS:

```bash
npm run build
NODE_ENV=production npm start
```

The root build script uses `npm install` for both packages and produces `frontend/dist`. With `NODE_ENV=production`, Express serves these files alongside the API and provides an SPA fallback for frontend routes.

MongoDB and Upstash must remain accessible to the backend. A reverse proxy can forward public HTTPS requests to the application's configured port, which defaults to `5001`.

## Author

**Konrad Patla** · [@konrad3211](https://github.com/konrad3211)
