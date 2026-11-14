import React from "react";
import { Video, ExternalLink, AlertCircle } from "lucide-react";

export default function VideoPlayer({ url, title }) {
  if (!url || !url.trim()) {
    return (
      <div className="aspect-video w-full rounded-2xl bg-slate-900 text-slate-400 flex flex-col items-center justify-center p-8 text-center space-y-3 shadow-inner">
        <Video className="w-12 h-12 text-slate-500" />
        <p className="text-sm font-medium">No video URL provided for this lesson.</p>
        <p className="text-xs text-slate-500">The instructor will upload the lecture stream shortly.</p>
      </div>
    );
  }

  const cleanUrl = url.trim();

  // Helper to extract YouTube embed URL
  const getYouTubeEmbedUrl = (rawUrl) => {
    try {
      if (rawUrl.includes("youtube.com/embed/")) {
        return rawUrl;
      }
      if (rawUrl.includes("youtube.com/watch")) {
        const urlObj = new URL(rawUrl);
        const videoId = urlObj.searchParams.get("v");
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
      if (rawUrl.includes("youtu.be/")) {
        const parts = rawUrl.split("youtu.be/")[1];
        const videoId = parts ? parts.split("?")[0] : null;
        if (videoId) return `https://www.youtube.com/embed/${videoId}`;
      }
    } catch (e) {
      return null;
    }
    return null;
  };

  const youtubeEmbed = getYouTubeEmbedUrl(cleanUrl);

  // If YouTube embeddable
  if (youtubeEmbed) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-card">
        <iframe
          src={youtubeEmbed}
          title={title || "Lesson Video"}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  // If Vimeo
  if (cleanUrl.includes("vimeo.com")) {
    const vimeoId = cleanUrl.split("/").pop();
    const vimeoEmbed = `https://player.vimeo.com/video/${vimeoId}`;
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-card">
        <iframe
          src={vimeoEmbed}
          title={title || "Lesson Video"}
          allow="autoplay; fullscreen; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full border-0"
        />
      </div>
    );
  }

  // Standard HTML5 Video or Direct Video URL (mp4, webm, ogg)
  const isDirectVideo =
    cleanUrl.match(/\.(mp4|webm|ogg|m4v)(\?.*)?$/i) ||
    cleanUrl.startsWith("blob:") ||
    cleanUrl.startsWith("data:");

  if (isDirectVideo) {
    return (
      <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-card">
        <video
          controls
          controlsList="nodownload"
          className="w-full h-full object-contain"
          src={cleanUrl}
        >
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  // Generic Web Video or External Educational Stream
  return (
    <div className="aspect-video w-full rounded-2xl overflow-hidden bg-slate-900 text-white flex flex-col items-center justify-center p-8 text-center space-y-4 shadow-card">
      <Video className="w-12 h-12 text-brand-400" />
      <div className="space-y-1 max-w-md">
        <h3 className="text-base font-bold">External Video Stream</h3>
        <p className="text-xs text-slate-300">
          This lecture is hosted at an external video source.
        </p>
      </div>
      <a
        href={cleanUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors shadow-md"
      >
        <span>Open Video Lecture</span>
        <ExternalLink className="w-4 h-4" />
      </a>
    </div>
  );
}
