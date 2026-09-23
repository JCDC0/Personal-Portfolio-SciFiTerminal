# Personal Portfolio: Sci-Fi Terminal

A personal portfolio for a computer science student, styled after the surveillance-machine interfaces in *Person of Interest*. It is built for recruiters: it shows each project as a problem, the solution that was built, and the tools used, with links to the live app and the source.

**Live site:** https://jcdc0.github.io/Personal-Portfolio-SciFiTerminal/
**API:** not deployed yet (week 2 to 3)

> **This deployment is running in demo mode.** The interface is real, but the backend is simulated in your browser, so the site works without a server. See [Demo mode](#demo-mode).

![The projects panel](docs/assets/projects.png)

## Features and usage

| Route | What it shows |
| --- | --- |
| `/` | Home panel: the handle, a one-line pitch, and buttons to the projects and the contact form |
| `/projects` | Every project as a card with its summary and tech tags. It shows a loading line, then the cards, or an error with a *Try again* button |
| `/projects/:id` | One project: the problem, what was built, tech tags, and links to the live site and source code. An unknown id shows "Project not found" |
| `/about` | Placeholder for the bio, skills and resume download |
| `/contact` | A contact form (name, email, message). On *Send* it shows "MESSAGE RECEIVED" or the error |
| anything else | A 404 panel with a link back home |

The header and footer navigation reach every panel, so no page is a dead end.

**The main flow:** open the site, click **View projects**, open a project card, read it, click **Back to projects**, then use **Contact** to send a message.

### API

The client calls these through `client/src/api/`. In demo mode they are answered in the browser. The Express versions are the week 2 work.

| Method | Path | What it does |
| --- | --- | --- |
| GET | `/api/projects` | List all projects |
| GET | `/api/projects/:id` | One project, or 404 |
| POST | `/api/messages` | Save a contact message (`name`, `email` and `message` are required, otherwise 400) |

## Setup and installation

You need **Node.js 20 or newer** (npm comes with it) and **Git**.

1. Get the code:

    ```bash
    git clone https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal.git
    cd Personal-Portfolio-SciFiTerminal/client
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

3. Create your environment file from the example. Use `copy` on Windows and `cp` on macOS or Linux:

    ```bash
    copy .env.example .env
    ```

No database is needed yet. The client runs in demo mode until the API exists.

### Environment variables

None of these are committed. `.env.example` lists them with placeholder values.

| Name | Where | Example | What it is |
| --- | --- | --- | --- |
| `VITE_USE_MOCK_API` | client, at build time | `true` | Only the exact value `false` turns demo mode off |
| `VITE_API_BASE_URL` | client, at build time | `http://localhost:3000` | The API's address, no trailing slash. Ignored in demo mode |
| `DATABASE_URL` | server (week 2) | `postgresql://postgres:devpassword@localhost:5432/portfolio` | PostgreSQL connection string |
| `CORS_ORIGINS` | server (week 2) | `http://localhost:5173` | Origins allowed to call the API |

Every `VITE_` value is compiled into the public JavaScript, so none of them may hold a password or key.

## How to run it

From the `client` folder:

```bash
npm run dev
```

Open http://localhost:5173. You should see the Home panel with a yellow **Demo mode** notice under the header. Click **Projects** and five project cards appear after a short loading line.

To build the production version, which is what GitHub Pages serves:

```bash
npm run build
```

## Demo mode

`VITE_USE_MOCK_API` chooses the backend at build time:

| Value | What happens |
| --- | --- |
| unset, or `true` | Projects come from `client/src/api/seed.json`, and contact messages are saved to the visitor's own `localStorage`. There is no server and no database. |
| `false` | The client calls the Express API at `VITE_API_BASE_URL`, which will read and write PostgreSQL. |

Both implementations (`mockApi.js` and `httpApi.js`) export the same three functions, `listProjects`, `getProject` and `sendMessage`. That makes switching to the real API a one-variable change.

## Project structure

```
client/                 React 18 + Vite front end
  src/api/              index.js picks mockApi.js or httpApi.js; seed.json holds the project data
  src/components/       Header, Footer, ProjectCard, DemoNotice
  src/pages/            one panel per route: Home, Projects, ProjectDetail, About, Contact, NotFound
  src/styles.css        the Machine (dark) and Samaritan (light) colour tokens
server/                 Express + PostgreSQL API (still the class template; replaced in week 2)
docs/assets/            screenshots
.github/workflows/      builds the client and deploys it to GitHub Pages on every push
```

## Screenshots

| Home | Project detail | Contact |
| --- | --- | --- |
| ![Home panel](docs/assets/home.png) | ![Project detail panel](docs/assets/detail.png) | ![Contact panel](docs/assets/contact.png) |

## Known issues and next steps

- **The API and database don't exist yet.** `server/` is still the template's sightings API. Next: a `projects` and `messages` schema, `GET /api/projects`, `GET /api/projects/:id` and `POST /api/messages` with parameterised SQL, and then deployment.
- **The About panel is a placeholder**, and there is no resume download yet.
- **The *Person of Interest* look is only started.** The colour tokens are in, but the 3D "void" with camera travel between panels, the theme and sound toggles, and the Futura PT and Magda Clean Mono fonts are not built yet.
- **Project cards have no images yet** (`image_url` is empty for every project).
- Before the API goes public, the contact endpoint needs an access gate, because it writes to the database.

## AI use

![Built with AI assistance](https://img.shields.io/badge/built%20with-AI%20assistance-0b5fff)

Built with help from Claude (Anthropic). It was used for the React routing and page scaffolding and for drafting documentation. The project data and design decisions are my own, and the backend routes and SQL will be too. The full record, with commit links, is in [AI-USAGE.md](AI-USAGE.md).

## Author

[JCDC0](https://github.com/JCDC0)

## Licence

MIT, see [LICENSE](LICENSE).
