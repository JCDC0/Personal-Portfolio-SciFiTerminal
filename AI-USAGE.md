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

### 2026-10-06 to 2026-10-09 - Deploying the real app behind a login

- **Tools:** Claude Code, and GitHub Copilot in VS Code
- **What I asked for:** A way to put the real app (site, API and database) online for grading, with the access gate my instructor requires because the contact form writes to the database.
- **What it gave back:**
    - Express now also serves the built React site, and any page address falls back to `index.html`, so one Render service runs everything from one address.
    - A comparison of the two gates the instructor accepts. It checked Cloudflare's own setup page and found that the free Zero Trust plan still asks for payment details, so it recommended HTTP Basic Auth instead.
    - Step-by-step Render settings, which I entered myself in Render's dashboard.
- **What I kept, what I changed, and why:**
    - I chose Basic Auth over Cloudflare. I tried writing the middleware from the AI's step list, but GitHub Copilot autocompleted almost all of it. That draft was never switched on with `app.use`, used different variable names, and broke on passwords containing a colon, so Claude Code rewrote it. **The gate is AI-written, not mine.**
    - I reset my Neon password after pasting the connection string into a chat by mistake, and used the new one only in Render and my `.env`.
    - I changed my own query to return only `id` and `created_at` (see section 3).
- **Commits:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/6cefcc8 (serving the site), https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/4b57565 (my query change) and https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/fbe9a40 (the gate)

### 2026-10-09 to 2026-10-11 - The site as one 3D virtual machine

- **Tool:** Claude Code
- **What I asked for:** The whole portfolio as one 3D "virtual machine", like the Machine's view in *Person of Interest*. I wanted an AI core in the middle of a deep, empty space, every page a workspace somewhere in it, and camera flights between pages so the site feels like one seamless screen. I drew a sketch of a line running from the AI, through a "Loading Contact Form..." tag, to the page. I added ideas as I saw each version:
    - a `[ CONNECTING... ]` boot screen;
    - database names (`DB-004`) instead of cameras;
    - an obfuscated "middleman" object with a scrambling `Owner J832=...` label;
    - garbled noise when things move;
    - a floating guide tag that follows me and plugs my line into the page;
    - project cards that stack, with buttons that move with them;
    - a 3D grid with coordinates;
    - web lines that pulses travel along.
- **What it gave back:**
    - `client/src/void/`: a Three.js scene with:
        - the AI core and the file clusters;
        - pop-up terminals that type and sort to-do lists;
        - neural strands, hidden square clusters and coloured traces;
        - a field of about 1,500 faint thumbnails and folder icons, some joined by faint straight lines, like my concept image of the Machine's feeds;
        - the 3D grid.
    - My pages are the real React panels, placed in 3D with Three.js's CSS3DRenderer, so the forms and links still work.
    - The guide tag, the camera flights (a curved path that speeds up and slows down), the record cards and the boot sequence.
    - Fallbacks: phones get the plain pages, and "reduce motion" skips the boot and the flights.
    - A clean curved line on the header and footer.
- **What I kept, what I changed, and why:** I kept the structure and kept steering the look:
    - I asked for the guide tag to follow me instead of staying beside each page.
    - I asked for separate cards instead of table rows, and for the buttons to move with the cards instead of staying fixed on the screen.
    - Three times I caught something that looked wrong and had it fixed (section 2, cases 8 to 10).
    - The old camera wall was deleted once the new world replaced it.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/7a1dcc4

### 2026-10-11 - Screenshot galleries for my mobile apps, and music

- **Tools:** Claude Code, and Google Flow Music
- **What I asked for:** More screenshots for my two mobile apps, HandsFree and AIRP, because one tall phone screenshot was cropped and zoomed inside a wide thumbnail. I also made a background track with Google Flow Music and asked how to add it.
- **What it gave back:**
    - A `screenshots` text-array column in `schema.sql`, the screenshot lists for both apps, and the extra screenshots resized for the web.
    - Cards that show three phone screens side by side.
    - A reel on the project page with all the phone screens, which scrolls slowly and pauses on hover.
    - Code that loops my track quietly when Sound is on, and advice to export it as an MP3.
- **What I kept, what I changed, and why:** The screenshots are my own phone captures. The music is AI-generated: I made it with Google Flow Music, not by hand, so it is credited here and in the README's Credits section.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/7a1dcc4

### 2026-10-11 - Last design pass: a living core, Samaritan-style labels and technical frames

- **Tools:** Claude Code, and Google Flow Music for the track the core reacts to
- **What I asked for:**
    - The pop-up labels (INDEX MATCH, PROBABILITY, NON-RELEVANT) in a Samaritan-style font.
    - The AI core pulsing with the music instead of only rotating.
    - Packets that travel to far nodes, not just around the core.
    - The guide tag and its line moving with the camera, like the AI dragging me to the destination, instead of chasing me.
    - A yellow line from the guide tag to the four record buttons.
    - Technical lines on the red panel borders.
    - The guide text typing like a terminal.
    - Auto-scan going 1 to 6 and back, because jumping from 6 to 1 flew the camera across the whole stack and made me feel sick.
- **What it gave back:**
    - Labels drawn in Jost, uppercase with wide letter spacing.
    - A sound analyser on the music: the core grows, glows and sends out ripple rings on the beat, with a slow heartbeat when the sound is off.
    - Packets that hop outward up to ten times, with bigger glows the farther out they are.
    - The guide locked to the camera during a flight.
    - The new line from the guide to the buttons.
    - Corner brackets, tick marks, a section code and a sync meter around each red panel.
    - A typing animation with a blinking cursor.
    - A scan that reverses at the ends.
- **What I kept, what I changed, and why:** The real Samaritan interface font is not free to use, so the labels use Jost, the free Futura look-alike the site already uses. I kept the rest after checking it in my browser.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/1bfc1c3

### 2026-10-12 - The guide tows the camera, and Auto-scroll

- **Tool:** Claude Code
- **What I asked for:**
    - During a flight, a yellow line on the guide tag's bottom border, so it looks like the tag is pulling me to the page.
    - The tag should keep moving around while it pulls me, instead of looking frozen on the screen.
    - The Auto-scan button renamed to Auto-scroll, so visitors know the page moves by itself.
- **What it gave back:**
    - A yellow bar along the tag's bottom border that fills from 0 to 100% as the flight progresses.
    - The tag now leads slightly ahead in the direction of travel and sways gently.
    - The new button label.
- **What I kept, what I changed, and why:** I kept all three after checking the flights in my browser.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/8a4b25e

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

### Case 7 - Render settings that broke the build

- **What it gave me:** Render settings with `NODE_ENV=production` and the build command `npm --prefix client ci && npm --prefix client run build && npm --prefix server ci`.
- **What was wrong with it:** With `NODE_ENV=production`, `npm ci` skips development packages, and Vite, the tool that builds the site, is one of them. My first deploy failed after 9 seconds with `vite: not found`, after installing only 11 packages.
- **What I did instead:** I sent the failing log, and it added `--include=dev` to the client install. I changed the build command in Render and redeployed, and the site went live. `NODE_ENV` stays `production` for the running server.
- **Commit:** none, because the fix was a setting in Render's dashboard, not code. The deploy it fixed is https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/fbe9a40

### Case 8 - A curved header that cut the text

- **What it gave me:** A "fisheye" curve on the header and footer, made with an SVG displacement filter that shifts the pixels of the whole bar. Its first version also curved the opposite way to the reference image I sent.
- **What was wrong with it:** The filter moves pixels in whole steps, so the edge rose in jagged one- or two-pixel jumps, and letters looked cut off where a jump passed through them. The AI's own screenshot check did not catch it.
- **What I did instead:** I asked for one clean curved line. The filter was removed. The curve is now drawn as a vector line in an SVG (`CurveEdge.jsx`) behind the text, so no letters move.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/7a1dcc4

### Case 9 - Strands of hair and painfully bright shapes

- **What it gave me:** Neural strands made from randomly wandering paths. The wireframe shapes, the file clusters and the middleman were all drawn at different brightness levels.
- **What was wrong with it:** The strands curled like hairs instead of looking like lines between points, and some shapes were much brighter than others, which was harsh to look at next to the subtle ones.
- **What I did instead:** I described what I saw, and it made these changes:
    - The strands are now straight lines between vertex points.
    - The coloured traces only turn at 45-degree angles.
    - The hidden squares sit on a grid.
    - Every shape was dimmed to the same subtle level.
    - The middleman, a knotted torus with a solid black core, was still the harshest shape, so it became a faint dodecahedron.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/7a1dcc4

### Case 10 - One phone screenshot in a desktop-sized frame

- **What it gave me:** A project gallery that showed one screenshot at a time, in the same wide frame used for desktop screenshots.
- **What was wrong with it:** A tall phone screenshot in a wide frame is small and leaves most of the frame empty. That looked bad, and it was the reason I asked for more screenshots in the first place.
- **What I did instead:** I asked for the phone screenshots to be shown together and to scroll slowly. The page now shows every phone screen side by side in a reel that moves on its own.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/7a1dcc4

### Case 11 - The music code broke the Sound button

- **What it gave me:** Code to loop my background track under the Sound toggle.
- **What was wrong with it:** The Sound button looked stuck: clicking it saved the setting but did not change the label or the sound until the page was reloaded. The AI had used two variables (`music` and `fade`) without declaring them. One of its own edits had silently failed, so every click ended in a `music is not defined` error before the button could update.
- **What I did instead:** I reported that the button seemed always on or always off. It traced the clicks in a test browser, found the error, and added the two missing lines. It then checked on, off, clicking elsewhere, and reloading with Sound saved as on.
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/7a1dcc4

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
    - On 11 October I added two `UPDATE` lines at the end of the file. They fill the new `screenshots` column for HandsFree and AIRP. Those two lines are deprecated; my rows above them did not change.

### Written by me: the three SQL queries (`server/projectsRepo.js`, `server/messagesRepo.js`)

- **Files:** `server/projectsRepo.js`, `server/messagesRepo.js`
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/80d5fd6
- **What they do and why they are built this way:** The function shells were given to me; I wrote the query and the values array inside each one.
    - `SELECT * FROM projects ORDER BY id`: gets every project. Without `ORDER BY`, PostgreSQL does not promise any order, so the cards could appear shuffled.
    - `SELECT * FROM projects WHERE id = $1` with `[id]`: gets one project. The `$1` is a placeholder. The id is sent to the database separately from the SQL text, so it can never be read as part of the command. If I glued the id into the string instead, someone could send SQL in the address bar and change the query (SQL injection).
    - `INSERT INTO messages (name, email, message) VALUES ($1, $2, $3) RETURNING *` with `[name, email, message]`: saves a contact message.
        - The three placeholders matter even more here, because these values are typed by visitors. A name with an apostrophe, like O'Brien, would break a string-joined query, and the same hole would let someone inject SQL.
        - `RETURNING *` sent back the whole saved row with its new `id` and `created_at`, so the API can reply 201 without a second query.
        - On 6 Oct I changed it to `RETURNING id, created_at` ([`4b57565`](https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/4b57565)). The page only needs to know the message was saved. Returning less also means a future database user for the app needs to read only those two columns, not everyone's messages.

### Written by me: the project content (`client/src/api/seed.json`)

- **File:** `client/src/api/seed.json`
- **Commit:** https://github.com/JCDC0/Personal-Portfolio-SciFiTerminal/commit/b2e9bb9
- **What it does and why it is built this way:** This is the demo-mode data used by the GitHub Pages site. Each project has the same eight fields as my `projects` table (`id`, `title`, `problem`, `summary`, `tech`, `image_url`, `live_url`, `repo_url`), so the database in week 2 could hold exactly the same data. On 11 October the AI added a ninth field, `screenshots`, to HandsFree and AIRP. The problem/summary split is from my proposal: a recruiter should see what problem I solved before what I built.

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
