# know_me: Anuj Karoddeo's portfolio

Astro + TypeScript + Tailwind v4. Static output, deploys to Vercel.

## Run
npm install
npm run dev      # http://localhost:4321
npm run build    # outputs dist/
npm run preview

## Where to edit
| File | Controls |
|---|---|
| src/data/profile.json | Name, tagline, about text, highlights, links, credlyUser, mediumUser (set it to show the Writing section) |
| src/data/experience.json | Work timeline |
| src/data/projects.json | Project cards and filters |
| src/data/skills.json | Toolkit chips |
| src/data/education.json | Education and IEEE publication |
| src/data/extra-badges.json | Certifications not hosted on Credly |
| src/data/credly-cache.json | Auto-written Credly fallback. Never edit by hand |
| src/data/gaming.json | COD stats, loadout, chess username |

Add non-Credly certifications to extra-badges.json, never to credly-cache.json.