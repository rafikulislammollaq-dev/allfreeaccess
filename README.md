# Aurora — Free AI Studio

A free in-browser AI studio. No signup, no credit card, no payment.

**Live:** https://rafikulislammollaq-dev.github.io/allfreeaccess/

## Features

- 🤖 AI chat, image generation, and voice tools
- 🧰 30+ utilities: PDF, image, video, dev, calculator, and converter tools
- 🧪 In-app HTML/CSS/JS playground
- 🆓 100% free — no payment, no accounts
- 📱 Responsive, dark/light, PWA-ready

## Monetization (Ads)

Ad slots are placed throughout. To enable Google AdSense:
1. Set `VITE_AD_CLIENT=ca-pub-...` in `.env` or via Settings.
2. Rebuild & redeploy.

## Tech

- React 19 + Vite + TypeScript + Tailwind CSS v4
- AI via free public providers
- Hosting via GitHub Pages (free)

## Develop

```bash
npm install
npm run dev
npm run build
```

## Deploy

Push to `master` triggers GitHub Actions → GitHub Pages.

## License

MIT
