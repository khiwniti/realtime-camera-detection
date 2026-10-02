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
    id: "udon-23",
    label: "CCTV: Intersection 23",
    description: "Live municipal traffic CCTV from Udon City, Thailand (Axis IP 23)",
    type: "url",
    url: "https://streaming.udoncity.go.th:1935/live/Axis_IP23.stream/playlist.m3u8",
    icon: "traffic",
  },
  {
    id: "udon-87",
    label: "CCTV: Junction 87",
    description: "Live municipal traffic CCTV from Udon City, Thailand (Axis IP 87)",
    type: "url",
    url: "https://streaming.udoncity.go.th:1935/live/Axis_IP87.stream/playlist.m3u8",
    icon: "city",
  },
  {
    id: "udon-91",
    label: "CCTV: Roadway 91",
    description: "Live municipal traffic CCTV from Udon City, Thailand (Axis IP 91)",
    type: "url",
    url: "https://streaming.udoncity.go.th:1935/live/Axis_IP91.stream/playlist.m3u8",
    icon: "pedestrian",
  },
  {
    id: "mux-test",
    label: "HLS Test Stream",
    description: "Mux reference multi-bitrate HLS live stream",
    type: "url",
    url: "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8",
    icon: "office",
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
