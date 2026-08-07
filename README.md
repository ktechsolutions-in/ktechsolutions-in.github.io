# K Tech Solutions — Karan Desai

Portfolio site for **Karan Desai**, Full-Stack Web Developer (K Tech Solutions),
serving Ahmedabad, Rajkot, Sanchore and Raipur.

**Live:** https://karandesai8044-lang.github.io/

## Stack

Static single-page site — no build step, no dependencies to install. Open
`index.html` in a browser and it runs.

| File | Purpose |
|---|---|
| `index.html` | The whole page: markup plus its CSS in a `<style>` block |
| `main.js` | Behaviour — preloader, cursor, nav, typing effect, animation setup |
| `karan-dp.jpg` | Profile photo (600×600) |
| `og-cover.jpg` | Link-preview card (1200×630) for WhatsApp, LinkedIn, Facebook |
| `robots.txt`, `sitemap.xml` | Search-engine directives |

Animation libraries (three.js, Vanta, AOS, Vanilla-Tilt, Typed.js) load from
CDNs. They are `defer`red and so is `main.js`, which matters: `defer` keeps
execution order, and `main.js` calls into those libraries the moment it runs.
Moving `main.js` back inline would break the page, because an inline script
executes during parsing — before any deferred library has loaded.

## Deploying

Hosted on GitHub Pages from the `main` branch. Pushing to `main` publishes.

## Contact

- Email — ktechsolutions.in@gmail.com
- WhatsApp — [+91 98257 94375](https://wa.me/919825794375)
