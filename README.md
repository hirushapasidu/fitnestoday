# 💪 Fitness Today — Website

> Home Workouts & Nutrition | Professional Fitness Calculators
> 
> **Live site:** [fitnesstodayonline.blogspot.com](http://fitnesstodayonline.blogspot.com)  
> **Pinterest:** [@fitnesstodayonline](https://www.pinterest.com/fitnesstodayonline/)

---

## 🔬 Features

### Core Pages
- `index.html` — Beautiful homepage with hero, tool previews, categories & Pinterest feed
- `tools.html` — All 6 professional fitness calculators

### Fitness Calculators
| Tool | Formula |
|------|---------|
| 🔥 TDEE Calculator | Mifflin-St Jeor + Activity Multiplier |
| 🥗 Macro Calculator | Goal-based protein/carb/fat ratios |
| ⚖️ BMI & Body Fat | Navy Tape Measure Method |
| ❤️ Heart Rate Zones | Karvonen Formula (5 zones) |
| 💧 Hydration Calculator | Weight + climate + intensity |
| 🌙 Sleep & Recovery Score | 8-question science-backed quiz |

---

## 🚀 Deploy to GitHub Pages (Free Hosting)

### Step 1 — Create a GitHub Repository

1. Go to [github.com](https://github.com) and sign in
2. Click **"New"** → Name it `fitnestoday` (or `fitnesstodayonline.github.io`)
3. Set to **Public**
4. Click **Create repository**

### Step 2 — Upload Your Files

**Option A: Drag & Drop (easiest)**
1. In your new repo, click **"uploading an existing file"**
2. Drag the entire project folder contents:
   - `index.html`
   - `tools.html`
   - `css/style.css`
   - `css/tools.css`
   - `js/main.js`
   - `js/calculators.js`
   - `README.md`
3. Click **Commit changes**

**Option B: Git CLI**
```bash
git init
git add .
git commit -m "🚀 Initial launch — Fitness Today website"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/fitnestoday.git
git push -u origin main
```

### Step 3 — Enable GitHub Pages

1. Go to your repo → **Settings** → **Pages**
2. Under **Source**, select `main` branch, root `/`
3. Click **Save**
4. Your site will be live at: `https://YOUR_USERNAME.github.io/fitnestoday`

> ⏱️ Takes 1–3 minutes for GitHub to build it.

---

## 🔗 Custom Domain (Optional)

To use a custom domain like `www.fitnesstoday.com`:

1. Buy a domain (Namecheap, GoDaddy, etc.)
2. In your repo, create a file called `CNAME` containing just your domain:
   ```
   www.fitnesstoday.com
   ```
3. In your domain registrar, add a CNAME record:
   - **Host:** `www`
   - **Points to:** `YOUR_USERNAME.github.io`
4. In GitHub Pages settings → add your custom domain

---

## 📁 Project Structure

```
fitnestoday/
├── index.html          ← Homepage
├── tools.html          ← All 6 calculators
├── css/
│   ├── style.css       ← Main styles (dark organic theme)
│   └── tools.css       ← Calculator-specific styles
├── js/
│   ├── main.js         ← Nav, animations, scroll behavior
│   └── calculators.js  ← All 6 calculator logics
└── README.md           ← This file
```

---

## ✏️ Customization

### Update Blog Links
In both HTML files, find and replace:
```
http://fitnesstodayonline.blogspot.com
```
With your blog URL.

### Update Pinterest Link
Find and replace:
```
https://www.pinterest.com/fitnesstodayonline/
```

### Change Colors
All colors are CSS variables in `css/style.css`:
```css
:root {
  --accent:  #D4714E;   /* Terracotta — main CTA color */
  --accent2: #7FAF7B;   /* Sage green — secondary */
  --accent3: #C9A96E;   /* Warm gold — tertiary */
  --bg:      #141414;   /* Page background */
  --text:    #F0EAE0;   /* Main text */
}
```

---

## ⚡ Performance

- **Zero frameworks** — Pure HTML/CSS/JS
- **Lazy-loaded images** — Pinterest grid uses `loading="lazy"`
- **Google Fonts preconnect** — Minimizes font load time
- **CSS animations** — Hardware-accelerated with `transform`
- **Intersection Observer** — Scroll animations without JS scroll events
- **No jQuery** — Faster parse and execution

---

## 📄 License

Free to use for your personal brand. Built for **Fitness Today Online**.

---

*Made with ♥ for real women living real lives.*
