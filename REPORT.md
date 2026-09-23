# Weekly Increment Report

## Week of: 20 to 23 September 2026 (Finals week 1)

Project repository: https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal
Live site: https://jcdc0.github.io/Personal-Portfolio-SciFiTerminal/

## What changed this week

- **Planning finished and committed** (20 Sep, workspace commit `358fe79`): the proposal, wireframes, design system and midterm journal are in `project/`.
- **Project repository created** from the class template (23 Sep). The React client runs locally in demo mode.
- **Commit identity fixed before anything went public.** GitHub's first commit carried my full name and school email, and my git config used my personal email. I turned on GitHub's email privacy, switched this repository to my noreply address, and rewrote that one commit (`056c966`).
- **The template's sightings demo replaced with my portfolio** (commit `b2e9bb9`):
    - React Router with the five routes from my wireframes (`/`, `/projects`, `/projects/:id`, `/about`, `/contact`), plus a 404 page.
    - A Header and Footer on every page, so no page is a dead end.
    - The API layer changed from sightings to `listProjects`, `getProject` and `sendMessage`, in both the demo backend and the real HTTP client, so moving to my Express API later is a one-variable change.
    - The Projects page keeps the template's loading, empty, error and slow-server states.
    - The Contact form validates its input and shows a sent or error message.
    - The Machine (dark) colour tokens from my design system replace the template's stylesheet.
- **My five projects written into `seed.json`:** ulolTris, Neon-Roguelike, HandsFree, AIRPv2 and Catnip Cafe, each with a problem, a summary, tech tags and links.
- **README rewritten** for the portfolio, with setup steps, routes, endpoints, structure, screenshots and known issues.
- Make the repository public, with Pages set to GitHub Actions and secret scanning and push protection turned on first, so the live link works.

## Why

My goal from the midterm journal was to have all five routes navigable and that now works in demo mode. I built the interface before the backend because the template's demo mode allows me to show real pages without a deployed server. It also meant the project data had to be shaped exactly like my planned `projects` table, so the database in week 2 can hold the same fields.

## What broke or what I got stuck on

- Week 1 started late. The four planning documents took until Sunday night, so the project repository only existed from Wednesday, and most of this week's commits landed on one day.
- My first commit exposed my school email, which the professor's security notice says must stay out of the public repository. I had to learn how GitHub picks the commit author, and how to rewrite a commit safely while the repository was still private.
- Commands from guides and with AI failed in my terminal: Windows PowerShell 5.1 does not accept `&&`, so each command had to run on its own line. I wish I used linux throughout the process since most codes and commands made by LLMs, especially with terminal runs are more linux-sided and made code editing harder sometimes.
- I first listed Three.js as a tech for ulolTris, but a check of that repository showed it isn't used, so I removed it. Only tools each project actually uses are listed now.
- React Router is still new to me. I understand `Routes`, `NavLink` and `useParams` from the July 12 lab, but not yet why GitHub Pages needs the `basename`.

## What is left

- Week 2: the Express API and PostgreSQL. That means the `projects` and `messages` tables, `GET /api/projects`, `GET /api/projects/:id` and `POST /api/messages` with parameterised queries, and error responses that don't leak details.
- An access gate in front of the API before it goes public (Cloudflare Zero Trust or Basic Auth), and a completed `SECURITY-CHECKLIST.md`.
- The About panel and resume download, project images, and the theme and sound toggles.
- The 3D void with camera travel between panels, which is the biggest risk, so it comes after the backend works.
- Keep `AI-USAGE.md` up to date each week.
