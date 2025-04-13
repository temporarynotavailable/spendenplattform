# Spendenplattform

Ein minimalistisches Crowdfunding-System im Stil von Kickstarter.
Erstellt mit Next.js, Prisma, Stripe und SQLite.

## Features

- 🎨 Darkmode UI mit Hero-Bereich
- 📝 Projektformular mit Bild-Upload
- 💾 Datenbankanbindung via Prisma
- 💳 Stripe-Zahlungen (Testmodus)
- 🔁 Webhook für Spendenverarbeitung

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run dev
```
