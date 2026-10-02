import type { VideoSource } from "@/types";

/**
 * Curated list of real-world video sources for object detection demos.
 * All URL sources are publicly hosted sample videos — no API keys needed.
 * These are direct MP4 links that work cross-origin for canvas readback.
 */
export const VIDEO_SOURCES: VideoSource[] = [
  {
    id: "webcam",
    label: "Live Webcam",
    description: "Your device camera — real-time local inference",
    type: "webcam",
    icon: "camera",
  },
  {
    id: "traffic",
    label: "Traffic Intersection",
    description: "Vehicle & pedestrian detection at a busy road",
    type: "url",
    url: "https://storage.googleapis.com/tf-coco-ssd-demo/traffic.mp4",
    icon: "traffic",
  },
  {
    id: "pedestrian",
    label: "Pedestrian Walkway",
    description: "People counting on a pedestrian crossing",
    type: "url",
    url: "https://storage.googleapis.com/tf-coco-ssd-demo/pedestrian.mp4",
    icon: "pedestrian",
  },
  {
    id: "city",
    label: "City Street",
    description: "Mixed urban scene — cars, bikes, people",
    type: "url",
    url: "https://storage.googleapis.com/tf-coco-ssd-demo/city.mp4",
    icon: "city",
  },
];

/**
 * COCO-SSD class → color mapping for consistent bounding-box rendering.
 * Deterministic hash fallback for unlisted classes.
 */
const CLASS_COLORS: Record<string, string> = {
  person: "#22c55e",
  car: "#3b82f6",
  truck: "#8b5cf6",
  bus: "#f59e0b",
  motorcycle: "#ef4444",
  bicycle: "#06b6d4",
  dog: "#ec4899",
  cat: "#f97316",
  bird: "#14b8a6",
  chair: "#a855f7",
  "potted plant": "#84cc16",
  "cell phone": "#6366f1",
  laptop: "#0ea5e9",
  tv: "#d946ef",
  bottle: "#f43f5e",
};

/** Returns a stable color for a COCO class name. */
export function classColor(className: string): string {
  if (CLASS_COLORS[className]) return CLASS_COLORS[className];
  // Deterministic hash → hue for unlisted classes
  let hash = 0;
  for (let i = 0; i < className.length; i++) {
    hash = className.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash) % 360;
  return `hsl(${hue}, 70%, 55%)`;
}

/** Confidence threshold below which detections are discarded. */
export const MIN_CONFIDENCE = 0.5;

/** Target detection loop interval (ms). Actual FPS depends on model speed. */
export const DETECTION_INTERVAL_MS = 100;
