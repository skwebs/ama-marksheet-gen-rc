# Marksheet Generator — Anshu Memorial Academy

React + Vite 8 version of the marksheet generator.

## Requirements

- **Node.js** 20.19+ or 22.12+ (required by Vite 8)
- **npm** 9+

## Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Assets

Place the following files in the `public/assets/` folder before running:

| File | Description |
|---|---|
| `ama300.webp` | School logo |
| `bbbp300.webp` | Beti Bachao Beti Padhao logo |
| `ama-128x128-0.15.webp` | Watermark background |

## CSV Column Reference

### Required
`name`, `mother`, `father`, `class`, `roll`

### Optional
`section`, `dob`, `address`, `attendance`, `position`, `remarks`

### Marks (per subject)
Columns are derived from subject names. For example, subject **"S.Science"** → key `sscience`:
- `sscience_written` — written marks
- `sscience_oral` — oral marks
- `sscience_full` *(optional)* — full marks (defaults to 100 if absent)

Click **"Download sample CSV"** in the UI to get a pre-built template based on your configured subjects.

## Tech Stack

| Package | Version | Purpose |
|---|---|---|
| `vite` | ^8.0.3 | Build tool (Rolldown-powered) |
| `@vitejs/plugin-react` | ^4.4.0 | React Fast Refresh |
| `tailwindcss` + `@tailwindcss/vite` | ^4.1.0 | Utility CSS |
| `react` + `react-dom` | ^19.1.0 | UI framework |
| `xlsx` | ^0.18.5 | Excel / CSV parsing |
| `qrcode` | ^1.5.4 | QR code generation (toDataURL API) |

## Project Structure

```
src/
├── App.jsx                  # Root state + orchestration
├── main.jsx                 # React entry point
├── index.css                # Tailwind v4 + print + sheet styles
├── components/
│   ├── GeneratorUI.jsx      # Non-printable 4-step control panel
│   ├── MarksheetPage.jsx    # One A4 marksheet (per student)
│   └── QRBox.jsx            # QR code component
└── utils/
    ├── grading.js           # Grade calc, date helpers
    ├── parseFile.js         # Excel/CSV parsing + column detection
    └── sampleCsv.js         # Sample CSV download
```
