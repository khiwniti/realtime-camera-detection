# LinkedIn Post

---

🚀 **Built a real-time object detection web app that runs entirely in your browser — no GPU, no server, no API keys.**

Just deployed it on Vercel for free.

Here's what makes it interesting from an engineering standpoint:

---

**The problem with most "AI detection" demos:**
They either require a GPU-backed API, a paid inference service, or a Python backend running locally. None of that is necessary for detection at this scale.

**The approach:**
→ TensorFlow.js runs the full COCO-SSD model using **WebGL shaders** on the visitor's own GPU (or WASM on CPU as fallback)
→ The model (~2 MB, MobileNetV2 + SSD head) detects **80 object classes** at 15–30 FPS on a typical laptop
→ Zero bytes of video data leave the browser — inference is local by design
→ Deployed as a **static Next.js export** on Vercel Edge CDN — no cold starts, no compute costs

**What you can detect:**
- Live webcam (people, objects, etc.)
- Traffic intersection footage (vehicles, cyclists)
- Pedestrian crossings (crowd counting)
- Urban street scenes (mixed classes)
- Custom MP4/WebM URL — paste any CORS-enabled stream

**Stack:**
Next.js 15 · React 19 · TypeScript · TensorFlow.js 4 · COCO-SSD (lite_mobilenet_v2) · Tailwind CSS · Vercel

**Architecture highlights (see sidebar in the app):**
1. Model loaded on first user gesture — keeps initial paint instant
2. rAF-gated detection loop prevents backpressure when inference lags
3. Canvas overlay scales to display size, not intrinsic video resolution
4. Deterministic class → color mapping for consistent UI across frames
5. No data retention — MediaStream tracks stopped on unmount

The whole thing fits in one page. The architecture panel in the app explains every layer if you want to dig in.

---

🔗 Live demo: [your-vercel-url.vercel.app]
💻 Code: [github.com/khiwniti/realtime-camera-detection]

---

What would you detect? Drop a use case in the comments 👇

#AI #MachineLearning #WebDevelopment #TensorFlowJS #ComputerVision #NextJS #Vercel #BrowserAI #ObjectDetection #EdgeComputing #OpenSource
