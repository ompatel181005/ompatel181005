# Portfolio Site Frameworks — Options & Build Instructions

The current site is **plain HTML/CSS/JS** (no build step). That's the simplest thing
that works on GitHub Pages, but every new project means hand-copying a ~25-line HTML card.
If that gets tedious, these frameworks let you write each project as a short Markdown/YAML
entry and generate the page for you. All of them deploy free to GitHub Pages.

| Framework | Write content in | Install | Best for | Effort to migrate |
|---|---|---|---|---|
| **Plain HTML** (current) | HTML | nothing | Full control, zero tooling | — |
| **Quarto** | Markdown / Jupyter | 1 installer | Data/ML folks who want notebooks & write-ups on the site | Low |
| **Astro** | Markdown + components | Node.js | Fast, modern, lots of portfolio themes | Medium |
| **Hugo** | Markdown | 1 binary | Fastest builds, huge theme catalog | Low–Medium |
| **Jekyll** | Markdown | Ruby (or none — GitHub builds it) | Native to GitHub Pages | Low |
| **MkDocs Material** | Markdown | Python (`pip`) | Docs-style site / project write-ups | Low |

**Recommendation:** **Quarto** if you want to publish ML notebooks and project write-ups
alongside the portfolio (fits your AI/ML + quant work), or **Astro** if you want the
most polished, design-forward portfolio.

---

## Instructions for Building This Site (current — plain HTML)

1. Clone the repository:

```
git clone https://github.com/ompatel181005/ompatel181005
cd ompatel181005
```

2. Preview locally (any static server works):

```
python3 -m http.server 8000
```

Then open <http://localhost:8000>.

3. Add a project: copy an existing `<article class="project-card">` block in `index.html`,
   edit it, and set `data-category` to one of `ai-ml`, `quant`, `data-eng`, `swe`.
   Filter counts update automatically.

4. Deploy: push to `main`. GitHub Pages serves the repo root (custom domain in `CNAME`).

---

## Option 1 — Quarto

1. [Install Quarto](https://quarto.org/docs/download/)

2. Create a website project:

```
quarto create project website my-portfolio
cd my-portfolio
```

3. (Optional) Python environment for executable notebooks
   (see [uv](https://docs.astral.sh/uv/) for details on `uv`):

```
uv venv --python=3.13
source .venv/bin/activate
uv pip install jupyter ipykernel matplotlib pandas
python3 -m ipykernel install --sys-prefix
```

4. Install the icon extension:

```
quarto add mcanouil/quarto-iconify
```

5. Add a project listing page — create `projects.qmd`:

```
---
title: "Projects"
listing:
  contents: projects/*.qmd
  type: grid
  categories: true
---
```

   Then each project is one file, e.g. `projects/recall.qmd`:

```
---
title: "Recall"
description: "Local-first lecture app with a RAG tutor that cites timestamps"
categories: [AI/ML, Python]
---
```

6. Build / preview the site:

```
quarto preview
```

7. Deploy to GitHub Pages:

```
quarto publish gh-pages
```

---

## Option 2 — Astro

1. [Install Node.js](https://nodejs.org/) (LTS)

2. Create the project from the portfolio starter:

```
npm create astro@latest my-portfolio -- --template portfolio
cd my-portfolio
```

   (Browse more free themes at <https://astro.build/themes/?categories[]=portfolio>.)

3. Add projects as Markdown files in `src/content/work/` (one file per project, with
   title / description / tags in the front matter).

4. Build the site:

```
npm run dev       # live preview at http://localhost:4321
npm run build     # outputs static site to dist/
```

5. Deploy: follow <https://docs.astro.build/en/guides/deploy/github/> — it adds a
   ready-made GitHub Actions workflow.

---

## Option 3 — Hugo

1. [Install Hugo](https://gohugo.io/installation/) (extended edition)

2. Create a site and add a theme (example: [Blowfish](https://blowfish.page/) or
   [PaperMod](https://github.com/adityatelange/hugo-PaperMod)):

```
hugo new site my-portfolio
cd my-portfolio
git init
git submodule add https://github.com/adityatelange/hugo-PaperMod themes/PaperMod
echo "theme = 'PaperMod'" >> hugo.toml
```

3. Add a project:

```
hugo new content projects/recall.md
```

4. Build the site:

```
hugo server       # live preview at http://localhost:1313
hugo              # outputs static site to public/
```

5. Deploy: <https://gohugo.io/hosting-and-deployment/hosting-on-github/>

---

## Option 4 — Jekyll (GitHub Pages native)

1. Easiest path — no local install: fork a theme such as
   [al-folio](https://github.com/alshedivat/al-folio) (academic portfolio) or
   [minimal-mistakes](https://github.com/mmistakes/minimal-mistakes), then edit
   `_config.yml` and the Markdown files in `_projects/`.

2. To preview locally, [install Ruby](https://jekyllrb.com/docs/installation/), then:

```
bundle install
bundle exec jekyll serve      # http://localhost:4000
```

3. Deploy: push to `main` — GitHub Pages builds Jekyll automatically.

---

## Option 5 — MkDocs Material

1. Create a virtual environment and install:

```
uv venv --python=3.13
source .venv/bin/activate
uv pip install mkdocs-material
```

2. Create the site:

```
mkdocs new my-portfolio
cd my-portfolio
```

   Set `theme: name: material` in `mkdocs.yml` and add one Markdown page per project in `docs/`.

3. Build the site:

```
mkdocs serve       # http://127.0.0.1:8000
```

4. Deploy to GitHub Pages:

```
mkdocs gh-deploy
```
