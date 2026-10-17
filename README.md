# Ringside by Urawise: one-page site

Static HTML/CSS/JS with no build step, no database and no secrets. It deploys as-is on Vercel at https://ringside.urawise.eu/.

| File | What it is |
| --- | --- |
| `index.html` | Page and English copy |
| `i18n.js` | Spanish, Danish, Albanian and Finnish copy |
| `main.js` | Language menu (EN/ES/DA/SQ/FI, also `?lang=da` etc.; follows the browser language on a first visit), contact links, mailto form, GA4 after consent |
| `config.js` | **Your settings**: WhatsApp, email, review link, GA4 ID |
| `styles.css` | Crystal-blue theme with light and dark mode |
| `favicon.svg`, `favicon-32.png`, `apple-touch-icon.png`, `og-image.png` | Icons and social preview image |
| `robots.txt`, `sitemap.xml`, `vercel.json` | SEO and hosting |
| `_assets-src/` | Source files used to render the PNGs (not deployed) |

## Run locally

```bash
python3 -m http.server 4173 --directory ringside-site
```

Then open http://localhost:4173 (add `?lang=es`, `da`, `sq` or `fi` to see another language).

## Still to fill in

While a value in `config.js` is still in [brackets], the site treats it as not set and keeps working.

1. `config.js` → `whatsappNumber`, e.g. `34600111222` (digits only)
2. ~~`config.js` → `email`~~ set to besasonos@gmail.com; used by the "Send an email" button and the form
3. `config.js` → `reviewLink`: leave it as is to use WhatsApp, or set a booking or mailto link
4. `config.js` → `ga4Id`: create a **new web data stream** for `ringside.urawise.eu` in GA4 (not the renovation stream) and paste its `G-…` ID. The cookie banner only appears once this is set.
5. ~~Pricing~~ set to "Free review first, then a tailored quote"; to change it later, edit `pricing.text` in `index.html` and `i18n.js`
6. ~~Business details~~ same as Urawise for now (sole trader, Portuguese NIF 335038131, Sant Adrià de Besòs address); edit the footer in `index.html` and `footer.legal` in `i18n.js` if they change
7. `[PRIVACY POLICY LINK]`: in the `index.html` footer, and `footer.privacy` for each language in `i18n.js`
8. Results section: when you have real, permissioned numbers, use the commented block in `index.html` (`[RESULT]`, `[CLIENT TESTIMONIAL]`)
9. Have a native speaker check the Spanish, Danish, Albanian and Finnish copy in `i18n.js`

## Deploy

1. Put this folder in its own Git repo, e.g. `urawise/ringside-site` on GitHub. Alternatively, run `npx vercel` inside the folder.
2. In Vercel, go to **Add New → Project**, import the repo and set Framework Preset to **Other**. Leave the build command empty and the output directory as `.`, then deploy.
3. In the project, open **Settings → Domains** and add `ringside.urawise.eu`. Vercel will show the DNS record it expects, normally `CNAME ringside → cname.vercel-dns.com`. Use the exact value shown there.
4. In Squarespace, go to **Domains → urawise.eu → DNS → Custom records** and add:
   - Host: `ringside`
   - Type: `CNAME`
   - Data: the value Vercel showed (e.g. `cname.vercel-dns.com`)

   Leave the existing `reformas` and app records alone.
5. Wait for Vercel to show the domain as **Valid** (minutes, sometimes up to an hour). HTTPS is issued automatically.
6. Optional: add the property in Google Search Console and submit `https://ringside.urawise.eu/sitemap.xml`.
