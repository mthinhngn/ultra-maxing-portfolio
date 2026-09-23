# Thinh Nguyen — Portfolio

A terminal-inspired, multi-page portfolio built with Flask, Jinja, CSS, and small browser-native JavaScript modules. The site includes projects, experience, about, and contact pages, plus a looping video background and a desktop scroll indicator.

## Run locally

Requires Python 3.12 or newer.

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install -r requirements.txt
python -m flask --app app run --debug
```

Open `http://127.0.0.1:5000`.

## Deploy to Vercel

Vercel runs the Flask application exported from `app.py` and installs the dependency in `requirements.txt`. `.python-version` selects Python 3.12. In the Vercel project settings, use the Flask framework preset; an existing project set to `Other` may deploy only static files. Public files live under `public/`, where Vercel serves them from its CDN. The Flask static endpoint is also configured to read from `public/static`, keeping local `/static/...` URLs consistent.

To deploy a preview with the Vercel CLI:

```powershell
npm install --global vercel
vercel
```

After reviewing the preview, publish to production with:

```powershell
vercel --prod
```

Alternatively, import this GitHub repository from [vercel.com/new](https://vercel.com/new). Connecting the repository enables automatic preview deployments for branches and production deployments from the configured production branch.

The animated background video is hosted externally on CloudFront, so visitors need access to that host to see the video; the portfolio remains readable with a static background if playback is unavailable.
