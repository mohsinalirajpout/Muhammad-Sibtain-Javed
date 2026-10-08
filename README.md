# Muhammad Sibtain Javed — Portfolio Website

Portfolio for **Muhammad Sibtain Javed** (@sjrajpout14), a Shia Islamic content creator from Lahore, Pakistan.

Built with **HTML5, CSS3 and vanilla JavaScript (ES6+)** only. There are no frameworks, no build step, no npm packages and no CDN links. Fonts, images and icons are all stored in the project, so the site works offline and on any static host.

## Project structure

```text
converted-website/
├── index.html              Page structure, SEO and social-sharing tags, SVG icon sprite
├── 404.html                "Page not found" page (used by GitHub Pages)
├── site.webmanifest        App name, colours and icon for phone home screens
├── robots.txt              Lets search engines index the site
├── .nojekyll               Tells GitHub Pages to serve files as they are
├── css/
│   └── style.css           Fonts, design tokens, components, animations, breakpoints
├── js/
│   ├── data.js             ALL CONTENT: bio, stats, videos, journey, FAQ, links  ← edit this
│   └── script.js           Renders data.js and runs every interaction
├── assets/
│   ├── images/
│   │   ├── profile.jpg     Profile photo (from his YouTube channel)
│   │   └── thumbs/         36 video thumbnails, named <platform>_<id>.jpg
│   ├── icons/
│   │   └── favicon.svg
│   └── fonts/
│       ├── inter-latin-var.woff2           Inter (body text), weights 400–600
│       └── space-grotesk-latin-var.woff2   Space Grotesk (headings), weights 500–700
└── README.md
```

`js/data.js` is loaded before `js/script.js`. Keeping the content in its own file means you can update videos, stats and text without touching any code.

## Run it locally (VS Code)

1. Open the `converted-website` folder in VS Code.
2. Install the **Live Server** extension (by Ritwick Dey) if you don't have it.
3. Right-click `index.html` → **Open with Live Server**. The site opens at `http://127.0.0.1:5500/`.

You can also double-click `index.html` to open it straight from your files, or serve it with Python:

```bash
python3 -m http.server 8000     # then open http://localhost:8000
```

## Deploy to GitHub Pages

1. Create a new repository on GitHub (for example `sibtain-portfolio`).
2. Upload the **contents** of `converted-website/`, so `index.html` sits at the top level of the repository. Include the hidden `.nojekyll` file.
3. Go to **Settings → Pages**. Under *Source*, choose **Deploy from a branch**, then `main` and `/ (root)`, and click **Save**.
4. After a minute or two the site is live at `https://<your-username>.github.io/<repository-name>/`.

With Git from the VS Code terminal:

```bash
cd converted-website
git init
git add .
git commit -m "Portfolio website"
git branch -M main
git remote add origin https://github.com/<your-username>/<repository-name>.git
git push -u origin main
```

**Link previews:** WhatsApp, Facebook and LinkedIn need full image URLs. Once the site is live, change the `og:image` tag in `index.html` to the full address, e.g. `https://<your-username>.github.io/<repository-name>/assets/images/profile.jpg`.

## Features

| Feature | Where | How it works |
|---|---|---|
| Sticky header | Top | Turns blurred and solid after you scroll 10px |
| Mobile menu | Below 1024px | Hamburger opens a full-screen menu; closes on link tap, Escape, or resizing to desktop |
| Active nav link | Header | Highlights the section in view (IntersectionObserver) |
| Smooth scrolling | All `#` links | CSS `scroll-behavior`, offset for the fixed header |
| Typewriter | Hero | Cycles through four roles from `hero.roles` |
| Spinning ring and floating tags | Hero photo | CSS keyframe animations |
| Latest uploads strip | Hero | Endless scroll of 12 vertical clips; pauses on hover; each opens the video window |
| Count-up stats | Hero | Numbers animate the first time they scroll into view |
| Video filters | Featured Videos | All / YouTube / Shorts / TikTok / Facebook / Instagram, with counts; "Show all" reveals every video |
| Video window | Featured Videos, strip | Plays the clip with the platform's official player; closes on ×, Escape or clicking outside |
| Tabs | Channel Overview | Channels / Platforms / Voices; arrow keys, Home and End work |
| FAQ accordion | FAQ | One answer open at a time |
| Contact form | Contact | Checks every field, then opens the visitor's email app with the message filled in |
| Back to top | Bottom right | Appears after 600px of scrolling |
| Scroll reveal | Most sections | Fades content in as it appears; shows everything after 2.5s regardless |
| Reduced motion | Everywhere | Animations stop if the visitor's device asks for less motion |

## Updating content

Everything is in `js/data.js`.

- **Add a video:** add a line to `videos`. `platform` is `youtube`, `short`, `tiktok`, `facebook` or `instagram`; `id` is the part of the link after `v=`, `/shorts/`, `/video/` or `/reel/`.
- **Thumbnail for a new video:** save it in `assets/images/thumbs/` as `<prefix>_<id>.jpg`, where the prefix is `yt`, `short`, `tiktok`, `facebook` or `instagram` (e.g. `yt_-5BuAJwTFSI.jpg`). Landscape thumbnails are 560×315; vertical ones are 315×560. A video without a thumbnail shows a designed placeholder.
- **Order:** the first 9 videos show under *All*; the rest appear after *Show all*. Change `videosInitial` to show more, and `stripCount` for the hero strip.
- **Stats:** update `stats` and `checkedOn` when you refresh the numbers.
- **Photo:** replace `assets/images/profile.jpg` with a square image of the same name. If it can't load, an "SJ" monogram shows instead.
- **Colours:** change the tokens at the top of `css/style.css` (`--red`, `--red-2`, `--bg` and so on).

## Things that depend on outside services

- **In-page video playback** uses the official YouTube, TikTok, Facebook and Instagram players, so it needs an internet connection. When those players can't be reached, the video window shows the thumbnail with a play button that opens the clip on the platform instead. Every thumbnail is stored locally, so cards never show broken images.
- **The contact form has no server.** *Send Message* opens the visitor's own email app with the message ready to send to muhammadsibtainjaved@gmail.com. It never says a message was sent. To receive messages directly in your inbox, connect a form service such as Formspree in `initForm()` in `js/script.js`.

## Credits

- Fonts: Inter and Space Grotesk, both under the SIL Open Font License, latin subset from Google Fonts.
- Icons: hand-drawn SVG sprite in `index.html`.
- Content, thumbnails and profile photo: from Muhammad Sibtain Javed's public YouTube, TikTok, Facebook, Instagram and WhatsApp pages, checked 8 October 2026.
