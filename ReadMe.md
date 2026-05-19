# Marvelle Cakes — Web Prototype

A responsive prototype website for **Marvelle Cakes**, a Nairobi-based artisanal cake brand. Built for the Application Programming to Internet unit.

## Features
- Six fully linked pages: **Home, About, Services, Gallery, Contact, Register**
- Logo positioned top-left on every page (rubric requirement)
- Three Products/Services categories: Wedding Cakes, Celebration Cakes, Corporate Desserts
- Gallery with **18 images** (6 per category)
- Customer Registration form (Name / Phone / Email) with client-side validation
- Contact form with subject dropdown
- **localStorage-backed CRM** — registered customers and contact messages persist across page refreshes
- Fully responsive with mobile hamburger menu
- Brand palette derived from the Marvelle poster (electric pink, maroon, strawberry red, cream)

## Tech Stack
- HTML5
- CSS3 (custom design tokens, no framework)
- Vanilla JavaScript (no dependencies)
- localStorage for client-side data persistence

## File Structure
```
Marvelcakes/
├── index.html        Home
├── about.html        About Us
├── services.html     Products/Services (3 categories)
├── gallery.html      Gallery (18 images)
├── contact.html      Contact + message form
├── register.html     Customer registration + customer list
├── style.css         Global stylesheet
├── script.js         Form handling, localStorage, mobile nav
├── ReadMe.md
└── images/
    ├── logo.png             Cupcake logo (transparent PNG)
    └── CreativeCakePoster.jpg   Hero/marketing image
```

## How to Run Locally
Just open `index.html` in your browser — no build step, no server required.

For a more reliable preview (recommended when opening from `file://`), you can serve the folder with any static file server, e.g.:
```
python -m http.server 8000
```
Then visit `http://localhost:8000`.

## Deployment
This site is fully static and is deployed on **Netlify**. To deploy your own copy:
1. Push this repository to GitHub
2. Sign in to [Netlify](https://app.netlify.com) → **Add new site → Import from Git**
3. Select the repository and click **Deploy**
4. No build command, no publish directory override required

## Customer Data
Customer registrations and contact messages are stored in the visitor's browser using `localStorage` (keys: `marvelle_customers`, `marvelle_messages`). This means:
- Data persists across page reloads and tabs on the same browser
- Data is not shared between devices or visitors
- Suitable for a prototype demonstration; a production deployment would connect to a real backend database
