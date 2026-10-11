# Proposal

The submitted proposal is my Canvas answer for M6A1. This copy keeps the plan next to the code and records what changed since, last updated 11 October 2026.

## How the idea was chosen

The M6A0 feedback lists Idea 1, "AIRP. Chat Conversation WebApp", as the approved title. In a face-to-face session the instructor advised building the personal portfolio (Idea 3) instead, because AIRP alone was too simple. M6A1 and everything in this repository build the portfolio.

## The idea

A personal web portfolio themed after the surveillance interfaces in *Person of Interest*: a virtual machine in a pitch-black void that shows my projects in clean, labelled boxes, with smooth transitions instead of hard page jumps. The theme is only the look. No logos, images or audio from the show are used.

**In one sentence:** a portfolio that lets recruiters hiring junior software engineers judge my problem-solving from real, working projects, and message me directly.

**Who it is for:** recruiters and hiring engineers screening junior applicants. They arrive from my resume, a job application, or my GitHub profile, and want to see quickly what I built, what problem each project solved, and how to reach me.

## Core features: planned and built

| Planned in M6A1 | Status |
| --- | --- |
| `/` home screen with my handle, a one-line pitch, and links to the projects and my resume | Built, with a skippable boot screen |
| `/projects` with every project's problem and tech | Built as a stack of record cards in the 3D world, with a plain card list on phones |
| `/projects/:id` with screenshots, the problem, the solution, the tech and links | Built; the mobile apps get a scrolling reel of phone screenshots |
| `/about` with my bio, skills and resume | Built; the resume is a Google Drive link, because it holds personal details that must not be in a public repository |
| `/contact` form that saves to my database | Built (Express API and PostgreSQL) |
| Smooth transitions between pages | Built as camera flights through one 3D space (Three.js) |
| Labelled boxes and bracket outlines like the Machine's view | Built (the HUD corners, record labels and the guide tag) |
| Sound toggle | Built: generated interface sounds and a background track, off by default |
| Animations off for "reduce motion" | Built: no boot, and cuts instead of flights |

## Cut or moved to stretch goals

- **The Machine / Samaritan theme toggle.** The light colours exist in `styles.css`, but there is no switch. The time went into the 3D world instead.
- **Tech filter tags on `/projects`.** With six projects, the card stack is short enough to scan without a filter.
- **A Resume button in the header.** The resume is one click away from Home and About instead. The header keeps only the navigation and the Sound toggle.
- **Email in the footer.** Left out on purpose: the contact form replaces a public email address.
- **Project list changes:** AIRPv2 was replaced by AIRP, and LowBeam was added.
- **Fonts:** Futura PT and Magda Clean Mono are commercial, so the site uses the free Jost and Space Mono (SIL Open Font Licence).

## Where each piece is hosted

| Piece | Host | The free tier's catch |
| --- | --- | --- |
| Demo copy of the site | GitHub Pages | Static only: demo mode, with no database behind it |
| Real site and API | Render free web service (since 9 October), one Express server for both | Sleeps after 15 minutes idle, so the first load can take up to a minute |
| Database | Neon free PostgreSQL (since 27 September) | No IP allow-list; protected by the password and TLS |
| Access gate | HTTP Basic Auth in Express | One shared login. Cloudflare Zero Trust was planned first, but its free plan asks for payment details |

## Demo mode

The GitHub Pages copy stays in demo mode on purpose, so anyone can open it without a login. The real app on Render has run against the real API and database since 9 October 2026.

## Risks

- **Readability with the effects on** (the M6A1 risk). This shrank. Panels sit on solid dark backgrounds above the 3D scene, the scenery was dimmed after review, phones get plain pages, and "reduce motion" turns the animations off.
- **Performance on weak computers.** This one is new. The 3D world needs WebGL; it caps the pixel ratio, but an old laptop may run it slowly.
- **A sleeping free server.** This one is also new. The first request after 15 minutes idle is slow, so the projects page shows a "the server may be waking up" message.
- **Cloudflare needing a card.** This turned out to block the first gate plan, and Basic Auth replaced it.
