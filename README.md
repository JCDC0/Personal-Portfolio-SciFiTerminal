# Personal Portfolio: Sci-Fi Terminal

[![Made with AI](https://img.shields.io/badge/Made_with-AI_assistance-blue)](AI-USAGE.md)

A personal portfolio for a computer science student, styled after the surveillance-machine interfaces in *Person of Interest*. It is built for recruiters: it shows each project as a problem, the solution that was built, and the tools used, with links to the live app and the source.

**Live site (demo mode):** https://jcdc0.github.io/Personal-Portfolio-SciFiTerminal/
**Full app with API and database:** https://jcdc0-portfolio.onrender.com (behind a login, see below)

> **Two addresses.** The GitHub Pages site runs in demo mode: its backend is simulated in your browser and nothing is saved to a database, so anyone can open it. The Render address is the real app, where one Express server serves the site and the API and the contact form writes to PostgreSQL. Because it writes to a database, it is behind an HTTP Basic Auth login; the login is shared privately with my instructor. The free host sleeps when idle, so the first load can take up to a minute. See [Demo mode](#demo-mode).

![The projects panel](docs/assets/projects.png)

## Features and usage

| Route | What it shows |
| --- | --- |
| `/` | Home panel: the handle, a one-line pitch, and buttons to the projects and the contact form |
| `/projects` | A full-screen surveillance wall. Each project is a camera feed with its screenshot, and the camera scans from feed to feed on its own. Click a feed to lock on, click again to open it; the arrow keys and the Prev / Next buttons move the camera by hand. On a phone, or with reduced motion on, it falls back to a plain list of cards. It shows a loading line first, or an error with a *Try again* button |
| `/projects/:id` | One project: the problem, what was built, tech tags, and links to the live site and source code. An unknown id shows "Project not found" |
| `/about` | A short bio, skills, strengths and languages, with a link to my resume on Google Drive (the resume is not stored in this repository) |
| `/contact` | A contact form (name, email, message) that saves to the database. On *Send* it shows "MESSAGE RECEIVED" or the server's error |
| anything else | A 404 panel with a link back home |

The header and footer navigation reach every panel, so no page is a dead end.

**The main flow:** open the site, click **View projects**, open a project card, read it, click **Back to projects**, then use **Contact** to send a message.

### API

An Express server in `server/`, backed by PostgreSQL. Every query uses parameters (`$1`, `$2`, …), never string concatenation.

| Method | Path | Success | Errors |
| --- | --- | --- | --- |
| GET | `/api/projects` | 200 with an array of projects, in id order | 500 `{ "error": "Something went wrong on the server" }` |
| GET | `/api/projects/:id` | 200 with one project | 404 `{ "error": "Not found" }` for an unknown or non-numeric id |
| POST | `/api/messages` | 201 with the saved message (`id`, `name`, `email`, `message`, `created_at`) | 400 if `name`, `email` or `message` is missing or blank, longer than 120 / 254 / 2000 characters, or the body is not valid JSON |
| GET | `/healthz` | 200 `{ "ok": true }`: the process is running | |
| GET | `/readyz` | 200 `{ "ok": true, "db": "up" }`: the database answers | 503 `{ "ok": false, "db": "down" }` |

A project looks like this:

```json
{
  "id": 1,
  "title": "ulolTris",
  "problem": "Arcade players that ... want to practice Tetris ...",
  "summary": "A Tetr.io-inspired stacker ...",
  "tech": ["JavaScript", "HTML Canvas", "Web Audio API", "esbuild"],
  "image_url": "",
  "live_url": "",
  "repo_url": "https://github.com/JCDC0/ulolTris"
}
```

Sending a message from PowerShell:

```powershell
Invoke-RestMethod -Method Post -Uri http://localhost:3000/api/messages -ContentType "application/json" -Body '{"name":"Ada","email":"ada@example.com","message":"Hello"}'
```

## Setup and installation

You need **Node.js 20 or newer** (npm comes with it), **Git**, and a **PostgreSQL database**. The project uses a free [Neon](https://neon.com) database, but any PostgreSQL 14+ works, including a local one.

1. Get the code:

    ```bash
    git clone https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal.git
    cd Personal-Portfolio-SciFiTerminal
    ```

2. Create a database. On Neon, sign up, create a project, and copy its connection string from **Connect**.

3. Set up the server. Use `copy` on Windows and `cp` on macOS or Linux:

    ```bash
    cd server
    npm install
    copy .env.example .env
    ```

    Open `server/.env` and set `DATABASE_URL` to your connection string. Never commit this file.

4. Create the tables and load the sample projects:

    ```bash
    npm run db:reset
    ```

    This runs `db/schema.sql`, then `db/seed.sql`. The seed starts with `TRUNCATE`, so it empties the `projects` table first.

5. Set up the client:

    ```bash
    cd ../client
    npm install
    copy .env.example .env
    ```

    Open `client/.env` and set `VITE_USE_MOCK_API=false` and `VITE_API_BASE_URL=http://localhost:3000`. Leave them as they are to stay in demo mode, which needs no server.

### Environment variables

None of these are committed. Each folder's `.env.example` lists them with placeholder values.

| Name | Where | Example | What it is |
| --- | --- | --- | --- |
| `DATABASE_URL` | server | `postgresql://user:password@host.neon.tech/neondb?sslmode=require` | PostgreSQL connection string. Contains a password |
| `CORS_ORIGINS` | server | `http://localhost:5173` | Comma-separated origins allowed to call the API |
| `NODE_ENV` | server | `development` | `production` on a host |
| `BASIC_AUTH_USER` | server | `change-me` | The login name for the whole site and API. Without it and the password, every request gets 401 |
| `BASIC_AUTH_PASS` | server | `change-me-to-something-long` | The login password. Set it in the host's dashboard, never in the repository |
| `VITE_USE_MOCK_API` | client, at build time | `false` | Only the exact value `false` turns demo mode off |
| `VITE_API_BASE_URL` | client, at build time | `http://localhost:3000` | The API's address, no trailing slash |

Every `VITE_` value is compiled into the public JavaScript, so none of them may hold a password or key.

## How to run it

Two terminals.

**Terminal 1, the API** (from `server/`):

```bash
npm run dev
```

It prints `API listening on http://localhost:3000`. Open http://localhost:3000/readyz and expect `{"ok":true,"db":"up"}`.

**Terminal 2, the site** (from `client/`):

```bash
npm run dev
```

Open http://localhost:5173. There is no yellow demo notice, and **Projects** shows the five projects from the database after a short loading line.

To build the production version of the client:

```bash
npm run build
```

## Demo mode

`VITE_USE_MOCK_API` chooses the backend at build time:

| Value | What happens |
| --- | --- |
| unset, or `true` | Projects come from `client/src/api/seed.json`, and contact messages are saved to the visitor's own `localStorage`. There is no server and no database. The GitHub Pages site uses this. |
| `false` | The client calls the Express API at `VITE_API_BASE_URL`, which reads and writes PostgreSQL. |

Both implementations (`mockApi.js` and `httpApi.js`) export the same three functions, `listProjects`, `getProject` and `sendMessage`. That is why switching to the real API needed no changes to the pages.

## Project structure

```
client/                 React 18 + Vite front end
  src/api/              index.js picks mockApi.js or httpApi.js; seed.json is the demo data
  src/components/       Header, Footer, ProjectCard, SurveillanceWall, SoundToggle, DemoNotice
  src/sound.js          the camera sound effects, generated with the Web Audio API
  src/links.js          the resume (Google Drive) and GitHub links
  src/pages/            one panel per route: Home, Projects, ProjectDetail, About, Contact, NotFound
  src/styles.css        the Machine (dark) and Samaritan (light) colour tokens
server/                 Express API
  server.js             routes, input validation and error handling
  projectsRepo.js       SQL for projects (read only)
  messagesRepo.js       SQL for contact messages (insert)
  db/schema.sql         the projects and messages tables, with length limits enforced by the database
  db/seed.sql           the five projects
  db/pool.js, db/run.js the connection pool, and the runner behind npm run db:reset
docs/assets/            screenshots
.github/workflows/      builds the client and deploys the demo to GitHub Pages
```

## Screenshots

| Home | Project detail | Contact |
| --- | --- | --- |
| ![Home panel](docs/assets/home.png) | ![Project detail panel](docs/assets/detail.png) | ![Contact panel](docs/assets/contact.png) |

## Known issues and next steps

- **Deployed on Render's free plan.** One web service builds the client and runs Express, which serves the site and `/api` from the same address. Build command: `npm --prefix client ci --include=dev && npm --prefix client run build && npm --prefix server ci`; start command: `node server/server.js`. The service sleeps after 15 minutes without visitors.
- **The login is HTTP Basic Auth, not a full account system.** It is one shared username and password from the host's environment settings. I first planned Cloudflare Zero Trust on my own domain, but its free plan asks for payment details, so I used the instructor's other accepted option.
- **The database accepts connections from any address.** Neon's free plan has no IP allow-list. It is protected by the password and TLS. The app still connects as the database owner; a separate user that can only read projects and add messages is the next step (the insert already returns only `id` and `created_at` to make that possible).
- **The *Person of Interest* look is partly done.** The surveillance wall, the camera sounds (off by default; toggle in the header) and the dark Machine colours are in. Not built: the light Samaritan theme toggle, camera travel between the other pages (they are still plain panels), cards with 3D depth, a greyscale background, and trace lines that make the wall look like the Machine searching a directory.
- **Fonts:** Jost and Space Mono (both free under the SIL Open Font Licence). The Futura PT and Magda Clean Mono fonts in the original design are commercial, so they are not used.

## AI use

Built with **Claude Code** (Anthropic), which wrote most of the code: the React client, the Express routes and validation, and the database schema. The login gate was first drafted by GitHub Copilot and then rewritten by Claude Code. The parts I wrote are the project content (`client/src/api/seed.json`), the seed data (`server/db/seed.sql`) and the three SQL queries in `server/projectsRepo.js` and `server/messagesRepo.js`. I also chose the features, the validation rules, the database and the hosting, and I tested every step. The full record, including where the AI got it wrong, is in [AI-USAGE.md](AI-USAGE.md).

## Author

[JCDC0](https://github.com/JCDC0)

## Licence

MIT, see [LICENSE](LICENSE).
