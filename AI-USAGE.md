# AI usage

This project was built with a lot of AI assistance, and this file is the honest record of it. The assistant was **Claude Code** (Anthropic), working inside my project folder.

**How I worked.** I cannot write JavaScript or SQL syntax from memory yet, so from week 2 onward the AI wrote most of the code. My part was:

- **Directing:** I chose the features, the rules and limits, the database, the hosting and the design.
- **Writing the content and data:** every project description, the seed rows after the first example row, and the three SQL queries.
- **Testing:** I ran every step myself and checked the result in the terminal and the browser.

The AI never committed anything: every commit in this repository was reviewed and made by me.

## 1. How I used AI

### 2026-09-23 - Replacing the template demo with my portfolio routes

- **Tool:** Claude Code
- **What I asked for:** Turn the class template's "sightings" demo into my portfolio, with the five routes from my wireframes (`/`, `/projects`, `/projects/:id`, `/about`, `/contact`).
- **What it gave back:**
    - React Router set up with a Header, a Footer, a ProjectCard, one page per route and a 404 page.
    - The API layer (`mockApi.js`, `httpApi.js`, `index.js`) rewritten from sightings to `listProjects`, `getProject` and `sendMessage`.
    - My Machine colour palette in `styles.css`.
- **What I kept, what I changed, and why:** I kept the code, because it matched my wireframes and kept the template's loading, empty and error states. I wrote all the project content myself (see section 3). I clicked through every route in the browser before committing.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/b2e9bb9

### 2026-09-23 - Facts about my own projects

- **Tool:** Claude Code
- **What I asked for:** Skim my five project repositories and list the facts I could use to describe each one (what it does, what it is built with).
- **What it gave back:** A fact sheet per project, with draft problem, summary and tech lines.
- **What I kept, what I changed, and why:**
    - I rewrote the descriptions in my own words in `seed.json`, because they are my projects and I know what they were for.
    - I first listed Three.js for ulolTris. When we checked the repository it is not used there, so I removed it. Only tools each project really uses are listed.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/b2e9bb9

### 2026-09-23 - Hiding my identity in the commit history

- **Tool:** Claude Code
- **What I asked for:** Help checking the repository before making it public.
- **What it gave back:**
    - It found that GitHub's first commit was authored with my full name and school email, and that my git settings used my personal email.
    - It explained how a commit carries an email, and gave me the GitHub noreply address and the steps to rewrite the commit.
- **What I kept, what I changed, and why:** I turned on GitHub's email privacy and its "block pushes that expose my email" setting myself. Then I rewrote that one commit while the repository was still private. The professor's security notice says no name or email in the public repository.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/056c966

### 2026-09-23 - README and screenshots for week 1

- **Tool:** Claude Code
- **What I asked for:** A README that follows the course's documentation guide, plus screenshots of the running site.
- **What it gave back:** The README sections (overview, setup, run, routes, structure, known issues) and four screenshots.
- **What I kept, what I changed, and why:** I kept the structure and edited the wording. I changed the commands to one per line, because they did not work in my terminal (see section 2, case 2).
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/befce27

### 2026-09-27 - Comparing databases instead of taking the first answer

- **Tool:** Claude Code
- **What I asked for:** After Docker Desktop crashed, I asked for a comparison of hosted PostgreSQL options instead of letting it pick one for me.
- **What it gave back:** A comparison of Neon, Supabase, Render, Heroku and Azure: cost, whether a card is needed, whether the free database expires or pauses, and whether it can block outside connections.
- **What I kept, what I changed, and why:**
    - **I chose Neon**: it is free, needs no card, and does not expire. Supabase pauses after a week of no use, Render's free database is deleted after 30 days, and Heroku needs a card.
    - For the access gate I chose Cloudflare Zero Trust, which the professor recommends.
    - The Neon setup steps are in the README.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/fd63dda

### 2026-09-27 - Pinning the GitHub Actions workflow

- **Tool:** Claude Code
- **What I asked for:** The professor's security notice says to pin third-party actions to a commit SHA instead of a tag like `@v4`. I asked for the SHAs of the four actions in the Pages workflow.
- **What it gave back:** The four full commit SHAs, with the version each one matches in a comment.
- **What I kept, what I changed, and why:** I kept them. A tag can be moved to different code later, but a SHA can't, so the workflow always runs the code that was checked.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/0466709

### 2026-09-27 - The Express API, the schema and validation

- **Tool:** Claude Code
- **What I asked for:** The API for my two tables:
    - `GET /api/projects`, `GET /api/projects/:id` and `POST /api/messages`;
    - error responses that never show stack traces;
    - the length limits I decided on: name 120, email 254, message 2000 characters.
- **What it gave back:**
    - `server.js` with the three routes, id checking, message validation and an error handler.
    - `schema.sql` with the two tables, where the database also enforces my limits with `CHECK`.
    - Function shells in `projectsRepo.js` and `messagesRepo.js`, with the query lines left blank for me.
- **What I kept, what I changed, and why:** I kept the code and wrote the blank queries myself (section 3). I tested every route with the API checker until all 15 checks passed against my Neon database.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/fd63dda

### 2026-09-27 - Reviewing my seed data and queries

- **Tool:** Claude Code
- **What I asked for:** A check of the seed rows and the three queries I wrote, before running them.
- **What it gave back:** A list of my mistakes:
    - I repeated `INSERT INTO projects ... VALUES` before every row;
    - I wrote the tech lists the JSON way, `ARRAY ["React","Vite"]`;
    - I left `sightings` from my m5a3 code in `getById`;
    - my message insert went `INTO projects` instead of `INTO messages`.
- **What I kept, what I changed, and why:** I fixed all four myself, by copying the pattern of my first correct row and checking the table names against `schema.sql`. These were my mistakes, not the AI's, so they are not in section 2.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/80d5fd6

### 2026-10-03 - Drafting this file

- **Tool:** Claude Code
- **What I asked for:** I was short on time before the deadline, so I asked it to draft this file from the notes we had kept since week 1 and from the commit history.
- **What it gave back:** A first draft of all three sections, with a commit link for each entry.
- **What I kept, what I changed, and why:** Before committing, I opened each commit link to check that the entry matches what really happened, and changed the parts I remember differently. Section 3 is the one I care most about getting right, because it has to be my own explanation of my own code.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commits/main/AI-USAGE.md

### 2026-10-03 - The Person of Interest camera wall

- **Tool:** Claude Code
- **What I asked for:** A recreation of the scene in *Person of Interest* where the Machine moves from one CCTV feed to another, but with my project cards as the feeds. From the options it listed, I chose a wall on the Projects page, and a camera that scans from feed to feed on its own and stops when I click.
- **What it gave back:**
    - `SurveillanceWall.jsx`: a large plane built with CSS 3D transforms (no 3D library), with my projects as feeds among small decorative camera tiles. The camera moves by shifting the plane over 600 ms.
    - An overlay with the camera ID, a REC clock, a lock-on box and a SUBJECT / STATUS label.
    - Click once to lock on, click again to zoom in and open the project. Arrow keys work too, phones get a plain list, and reduced-motion settings get instant cuts.
- **What I kept, what I changed, and why:** I kept the design, because it matches the scene and my concept images. I ran it and clicked through it myself, and that is how I found it sat in a small window instead of filling the screen (section 2, case 5).
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/7a66f19

### 2026-10-04 - Full-screen layout and free fonts

- **Tool:** Claude Code
- **What I asked for:** After running the wall, I told it the site should cover the whole screen with a small header and footer peeking out, like my wireframe. I also gave it the Futura PT and Magda Clean Mono fonts I had downloaded, and asked it to use them if they were free.
- **What it gave back:**
    - A fixed slim header and footer, a dark full-screen background, and the wall filling the screen behind them.
    - It read the licence inside the font files: Futura PT is under ParaType's "all rights reserved" licence, and Magda Clean Mono is a commercial FontFont. Neither is free to put in a public repository.
- **What I kept, what I changed, and why:** I chose Jost and Space Mono instead, which are both free under the SIL Open Font License. They are installed as npm packages, so the site does not depend on Google's servers. I took the project screenshots myself and picked one for each project; the AI only shrank them to web size.
    - Later I noticed some text was not in either font. It checked every piece of text and found that only three symbols (a music note and two arrows) were missing from both fonts, so the browser used my computer's default font for them. It replaced them with characters both fonts have.
- **Commits:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/8540048 (layout and fonts), https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/0faae15 (my project data and screenshots) and https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/5d76bae (the symbol fix)

### 2026-10-04 - Camera sounds, the About page and fixing the frozen wall

- **Tool:** Claude Code
- **What I asked for:** Sound when the camera moves between cards, which my wireframe's Sounds ON/OFF toggle was for, and an About page with my resume. When I ran both servers, the cards did not move at all.
- **What it gave back:**
    - `sound.js`: sounds generated in code with the Web Audio API (a whoosh when the camera moves, two beeps when it locks on, a sweep when a project opens), and a header toggle that is off by default.
    - An About page with my bio, skills and a Resume button.
    - A fix for the frozen wall (section 2, case 6).
- **What I kept, what I changed, and why:**
    - My resume has my full name, photo, phone number, personal email and home address, which must not be in a public repository. I chose to keep it on Google Drive and link to it, so only the link is in the code.
    - The About bio is taken from the "About Me" text on my own resume.
- **Commits:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/93814a0 (the sounds and the freeze fix) and https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/fc68b85 (the About page and resume link)

## 2. Where the AI got it wrong

### Case 1 - It planned before reading the template

- **What it gave me:** A week 1 plan that started with the backend, asking whether to set up PostgreSQL with Docker or Neon first.
- **What was wrong with it:** It had not read the class template yet. The template already had a working React client with a demo mode (fake data in the browser) and a server. Building the backend first would have left me with nothing to show for week 1.
- **What I did instead:** Once the template was read, week 1 became interface-first: the five routes in demo mode, with the data shaped like my planned `projects` table so the database could slot in during week 2.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/b2e9bb9

### Case 2 - Commands that do not work in my terminal

- **What it gave me:** Setup commands joined with `&&`, for example `npm install && copy .env.example .env && npm run dev`.
- **What was wrong with it:** My terminal is Windows PowerShell 5.1, and it rejects `&&` as a parse error, so the commands failed as given.
- **What I did instead:** I ran each command on its own line. The README now gives one command per line.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/befce27

### Case 3 - "Make the repository public right away"

- **What it gave me:** A week 1 plan that said to create the repository as public straight away, so GitHub Pages would work.
- **What was wrong with it:** GitHub's first commit carried my full name and school email. Going public right away would have published both, which the professor's security notice forbids. Git history keeps everything, so deleting it later would not have helped.
- **What I did instead:** I kept the repository private until the first commit was rewritten with my GitHub noreply address and email privacy was on. Only then did I make it public.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/056c966

### Case 4 - A README credit that was not true

- **What it gave me:** A README "AI use" line saying that I would write the backend routes and SQL myself.
- **What was wrong with it:** That was the week 1 plan, but it stopped being true in week 2, when I said I could not write the syntax and the AI wrote most of the server. Keeping it would have claimed work that was not mine.
- **What I did instead:** The credit was rewritten to say plainly that Claude Code wrote most of the code, and to name only the parts I wrote.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/fd63dda

### Case 5 - The first wall sat in a small window

- **What it gave me:** A camera wall inside a box in the middle of an ordinary web page, with the header and footer taking up their own rows.
- **What was wrong with it:** My wireframes show the site filling the whole screen, with a thin header and footer peeking out. In a box, the wall looked like a normal website with a gimmick, not like the Machine's screens.
- **What I did instead:** I told it the site is supposed to cover the entire screen. It rebuilt the layout so every page sits on a full-screen dark background, and the wall fills the screen behind a slim header and footer.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/8540048

### Case 6 - The AI froze its own camera wall

- **What it gave me:** An auto-scan that paused whenever the mouse was over the wall, so you could stop to read a card.
- **What was wrong with it:** After the wall went full-screen, the mouse was always over it. When I ran both servers the cards sat frozen. The AI's own tests had passed, because its test browser never had a mouse on the page. Its first fix (pause only over a card) still froze the wall whenever my mouse rested in the middle of the screen, where the focused card is, and it found that on its second test.
- **What I did instead:** I reported the frozen cards, and it removed pause-on-hover completely. The scan now stops only when I click a card, use the arrow keys, or press the Auto-scan button.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/93814a0

## 3. Who wrote what

Most of the code in this project was written by the AI. The parts below are mine. I typed them myself, using my own m5a3 activity as a reference, and fixed them after review.

### Written by me: the seed data (`server/db/seed.sql`)

- **File:** `server/db/seed.sql`
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/80d5fd6
- **What it does and why it is built this way:**
    - This file fills the `projects` table with my projects when I run `npm run db:reset`.
    - It starts with `TRUNCATE TABLE projects RESTART IDENTITY CASCADE`. That empties the table and resets the id counter, so running it twice does not make duplicates, and ulolTris is always id 1.
    - Then one `INSERT INTO projects (...) VALUES` lists the columns once, followed by one row per project, separated by commas. The AI wrote the first row as the pattern to copy, and I typed the other rows myself (later I swapped one project and added another). My first try repeated the `INSERT` line for every row, which is not how a multi-row insert works.
    - The tech list is a PostgreSQL text array, written `ARRAY['React', 'Vite']`. SQL uses single quotes for text, not the double quotes JSON uses, and that was my other mistake.
    - The text itself is my own: the problem each project solves and what I built.

### Written by me: the three SQL queries (`server/projectsRepo.js`, `server/messagesRepo.js`)

- **Files:** `server/projectsRepo.js`, `server/messagesRepo.js`
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/80d5fd6
- **What they do and why they are built this way:** The function shells were given to me; I wrote the query and the values array inside each one.
    - `SELECT * FROM projects ORDER BY id`: gets every project. Without `ORDER BY`, PostgreSQL does not promise any order, so the cards could appear shuffled.
    - `SELECT * FROM projects WHERE id = $1` with `[id]`: gets one project. The `$1` is a placeholder. The id is sent to the database separately from the SQL text, so it can never be read as part of the command. If I glued the id into the string instead, someone could send SQL in the address bar and change the query (SQL injection).
    - `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *` with `[name, email, message]`: saves a contact message.
        - The three placeholders matter even more here, because these values are typed by visitors. A name with an apostrophe, like O'Brien, would break a string-joined query, and the same hole would let someone inject SQL.
        - `RETURNING *` sends back the saved row with its new `id` and `created_at`, so the API can reply 201 with it without a second query.

### Written by me: the project content (`client/src/api/seed.json`)

- **File:** `client/src/api/seed.json`
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/b2e9bb9
- **What it does and why it is built this way:** This is the demo-mode data used by the GitHub Pages site. Each project has the same eight fields as my `projects` table (`id`, `title`, `problem`, `summary`, `tech`, `image_url`, `live_url`, `repo_url`), so the database in week 2 could hold exactly the same data. The problem/summary split is from my proposal: a recruiter should see what problem I solved before what I built.

### The AI-written part I understand best: `server/server.js`

- **File:** `server/server.js`
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/fd63dda
- **What it does and why we kept it:**
    - **`parseId`:** an id from the address bar is always text. `parseId` turns it into a number and only accepts a whole number from 1 up to the largest value a PostgreSQL `integer` can hold. So `/api/projects/abc` or `/api/projects/-1` answers **404 Not found** straight away. Without it, the bad id would reach the database, PostgreSQL would throw an error, and the visitor would get a 500 for what is really just a wrong address.
    - **`validateMessage`:** it checks the contact form before anything touches the database.
        - It trims each field, so a name of only spaces counts as empty.
        - It checks each field against my limits (120, 254, 2000).
        - It checks the email has an `@`.
        - It collects all the problems and answers **400** with them joined, so the form can show everything that is wrong at once. A good message gets **201 Created**.
    - **The error handler at the end:**
        - Broken JSON gets a 400, and a body over 100 kb gets a 413.
        - Anything else is logged on the server, but the visitor only sees "Something went wrong on the server". A stack trace or connection error would show file paths and database details, which the security notice says must never be sent to the browser.
    - We kept it because it is the part that decides which status code each request gets, and that is what the final project grades as "API design and error handling".
