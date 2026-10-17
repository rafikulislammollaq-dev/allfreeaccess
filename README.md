# Aurora — Free AI Studio

A 100% free, all-in-one creative studio in the browser. Chat with AI, generate images,
use voice, and run developer utilities — no account, no payment, no API keys.

**Live:** https://myrajibgit.github.io/allfreeaccess/

## Features

- 💬 AI Chat with multiple models (streaming)
- 🖼️ Text-to-image generation
- 🎙️ Speech-to-text & text-to-speech
- 🧰 14+ developer tools (JSON, Base64, JWT, Regex, Hash, Color, Markdown, Password, QR, Units, Base conv, Diff, Text stats, URL)
- ✨ AI utilities (summarize, translate, rewrite, code explain/fix, email, brainstorm, titles)
- 🧪 Live HTML/CSS/JS playground
- 📚 Free resources directory (curated $0 services)
- 📝 Prompt template library
- 📜 History & data export
- ⚙️ Settings (theme, models, ads)
- 📱 PWA-ready, responsive, dark/light

## Monetization (Ads)

Ad slots are placed throughout the app. To enable Google AdSense:

1. Get approved at https://www.google.com/adsense
2. Set your publisher ID in one of:
   - `.env` file: `VITE_AD_CLIENT=ca-pub-xxxxxxxxxxxxxxxx`
   - Or in-app Settings → Ads
3. Rebuild & redeploy.

Slots are placeholder divs until a client ID is provided, so the site works fine with zero ads.

## Tech

- React 19 + Vite + TypeScript + Tailwind CSS v4
- AI via [Pollinations](https://pollinations.ai) (free, no key)
- Hosting via GitHub Pages (free)
- No backend, no database — everything in localStorage

## Develop

```bash
npm install
npm run dev
npm run build
```

## Deploy

Push to `master`/`main` triggers the GitHub Actions workflow which builds and
deploys to GitHub Pages.

## License

MIT
