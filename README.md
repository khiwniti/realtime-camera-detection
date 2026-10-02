# Realtime Object Detection

Browser-native real-time object detection — **no GPU, no server, no API keys**. Deployed on Vercel.

## What it does

Detects 80 COCO object classes (person, car, bicycle, …) in real time from:
- Live webcam
- Traffic intersection footage
- Pedestrian walkway footage
- City street footage
- Any custom MP4 / WebM URL you paste in

All inference runs inside the visitor's browser via TensorFlow.js WebGL backend. Zero bytes of video leave the device.

## Architecture

```
Browser tab
├── TensorFlow.js 4 (WebGL → WASM → CPU fallback)
│   └── COCO-SSD lite_mobilenet_v2 (~2 MB weights, 80 classes)
├── HTMLVideoElement  ← webcam (getUserMedia) or remote MP4
├── Canvas overlay    ← bounding boxes, labels, corner accents
└── HUD              ← FPS, inference ms, class counts
```

Key decisions:
- Model loaded on first user gesture (deferred dynamic import) — keeps initial paint fast
- `requestAnimationFrame` + 100 ms timeout gate prevents backpressure when inference lags
- Canvas scaled to *display* size, not intrinsic video resolution
- No data leaves the browser — privacy by design
- Static Next.js export — Vercel serves from CDN edge, zero cold-start

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS 3, Lucide icons |
| ML | TensorFlow.js 4, COCO-SSD (lite_mobilenet_v2) |
| Language | TypeScript (strict) |
| Deployment | Vercel (static export) |

## Local development

```bash
bun install
bun run dev      # http://localhost:3000
```

## Deploy to Vercel

```bash
npx vercel --prod
```

Or connect the repo in the Vercel dashboard — zero config needed.

## Project structure

```
src/
├── app/
│   ├── layout.tsx          # metadata, fonts
│   ├── page.tsx            # single-page root
│   └── globals.css
├── components/
│   ├── ArchSidebar.tsx     # slide-over architecture panel
│   ├── HudOverlay.tsx      # live FPS / count / class HUD
│   ├── ModelStatusBadge.tsx
│   └── SourceSelector.tsx  # preset + custom URL picker
├── hooks/
│   └── useDetector.ts      # model lifecycle, detection loop, canvas binding
├── lib/
│   ├── constants.ts        # video sources, class colors, thresholds
│   └── renderer.ts         # canvas drawing, stats computation
└── types/
    └── detection.ts        # Detection, DetectionStats, VideoSource, ModelStatus
```

---

© 2026 Khiw Nitithadachot
