# apps/web

The Vite/React frontend — the ASOSINT Base44 app source.

## Copying the Base44 app source here

The Base44 platform does not expose the full app source tree to a backend
function runtime, so the initial scaffolding was pushed without the app
source. To populate this folder:

1. Clone this repo locally:
   ```bash
   git clone https://github.com/<owner>/AOSINT.git
   cd AOSINT
   ```

2. From the Base44 dashboard, use the **GitHub 2-way sync** feature
   (Settings → GitHub Sync) to export the app source, OR download the
   source archive and extract it into `apps/web/`.

3. Commit and push:
   ```bash
   git add apps/web/
   git commit -m "chore(web): import Base44 ASOSINT app source"
   git push origin main
   ```

## Development

```bash
cd apps/web
npm install
npm run dev
```
