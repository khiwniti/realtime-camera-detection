import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Realtime Object Detection | Browser-Native AI",
  description:
    "Real-time object detection running entirely in the browser via TensorFlow.js COCO-SSD. No GPU, no server — deployed on Vercel.",
  openGraph: {
    title: "Realtime Object Detection",
    description: "Browser-native AI object detection — no GPU, no backend, Vercel-deployed.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
