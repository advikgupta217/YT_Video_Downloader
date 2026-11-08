
"use client";

import { useState } from "react";

type Video = {
  videoId: string;
  title: string;
  author: string;
  thumbnail: string;
  provider: string;
};

export default function Home() {
  const [url, setUrl] = useState("");
  const [video, setVideo] = useState<Video | null>(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function analyzeVideo() {
    setVideo(null);
    setMessage("");

    if (!url.trim()) {
      setMessage("Please enter a YouTube URL.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setVideo(data);
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "Unable to retrieve video information."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#0f172a] text-white">

      <nav className="flex items-center justify-between px-8 py-5 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-red-500">
          ▶ VideoDownloader
        </h1>
        <span className="text-gray-400 text-sm">
          Simple. Fast. Easy.
        </span>
      </nav>

      <section className="max-w-3xl mx-auto px-6 py-24 text-center">

        <h2 className="text-4xl md:text-5xl font-bold mb-5">
          Video Downloader
        </h2>

        <p className="text-gray-400 mb-10">
          Find video information and available authorized download options.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 bg-[#1e293b] p-3 rounded-xl">

          <input
            type="text"
            placeholder="Paste YouTube URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1 bg-transparent px-4 py-3 outline-none"
          />

          <button
            onClick={analyzeVideo}
            disabled={loading}
            className="bg-red-600 hover:bg-red-700 disabled:opacity-50 px-7 py-3 rounded-lg font-semibold"
          >
            {loading ? "Analyzing..." : "Analyze Video"}
          </button>

        </div>

        {message && (
          <p className="mt-5 text-red-400">{message}</p>
        )}

        {video ? (
          <div className="mt-12 bg-[#1e293b] rounded-xl p-5 border border-gray-700 text-left">

            <img
              src={video.thumbnail}
              alt={video.title}
              className="w-full rounded-lg mb-5"
            />

            <h3 className="text-xl font-bold mb-2">
              {video.title}
            </h3>

            <p className="text-gray-400 mb-4">
              Channel: {video.author}
            </p>

            <p className="text-green-400 text-sm mb-5">
              Video information retrieved successfully!
            </p>

            <a
              href={`https://www.youtube.com/watch?v=${video.videoId}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block bg-red-600 px-5 py-3 rounded-lg font-semibold"
            >
              Watch on YouTube
            </a>

          </div>
        ) : (
          !message && (
            <div className="mt-12 bg-[#1e293b] rounded-xl p-8 border border-gray-700">
              <div className="text-5xl mb-4">▶️</div>
              <h3 className="text-xl font-semibold mb-2">
                Video Preview
              </h3>
              <p className="text-gray-400 text-sm">
                Enter a video URL to get started.
              </p>
            </div>
          )
        )}

      </section>

      <footer className="text-center py-8 border-t border-gray-700 text-gray-500 text-sm">
        Built with Next.js and Tailwind CSS
      </footer>

    </main>
  );
}
