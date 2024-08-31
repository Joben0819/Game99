This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.

## Internationalization (i18n) Usage
Internationalization (i18n) is the process of designing a software application so that it can be adapted to various 
languages and regions without engineering changes.

DECLARATIONS
- In the root i18n.ts file, declare the file name to be used for the new translation file inside the `fileNames` const.
- For intellisense and type safety, declare also the return of this translation file inside the `Messages` type.
- Add the corresponding files in each respective folder inside `@/translation`:

    - `/translation/cn` for Chinese Simplified Language
    - `/translation/in` for Indian Language
    - `/translation/en` for English Language
  
- Just add each respective key-value pair in the JSON to add a translation.

  - ```bash
    /in/home.json
    {
      "recharge": "Isi ulang",
      "back": "Kembali",
      "personalCenter": "Pusat Pribadi",
      "download": "Unduh Aplikasi",
      "settings": "Settings"
    }

- USAGE:
  - `import { useTranslations } from 'next-intl`;
  - You can either leave the useTranslation arg empty or use a specific file as the arg to simplify translation calls.
  - `const t = useTranslations()` || `const t = useTranslations('home')`
  - And call in the render like:
  - `<span>{t('home.back')}</span>` || `<span>{t('back')}</span>`