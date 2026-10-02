/** Bounding-box prediction returned by COCO-SSD. */
export interface Detection {
  /** COCO label, e.g. "person", "car". */
  class: string;
  /** Confidence score 0..1. */
  score: number;
  /** [x, y, width, height] in pixel coordinates relative to the source. */
  bbox: [number, number, number, number];
}

/** Aggregated stats for the HUD overlay. */
export interface DetectionStats {
  fps: number;
  totalObjects: number;
  classCounts: Record<string, number>;
  inferenceMs: number;
}

/** A selectable video source for the detector. */
export interface VideoSource {
  id: string;
  label: string;
  description: string;
  type: "webcam" | "url";
  /** URL for type "url"; unused for "webcam". */
  url?: string;
  /** Thumbnail or icon hint. */
  icon: "camera" | "traffic" | "pedestrian" | "office" | "city" | "custom";
}

/** State of model loading lifecycle. */
export type ModelStatus = "idle" | "loading" | "ready" | "error";
