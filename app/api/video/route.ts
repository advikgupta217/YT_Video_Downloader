
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const url = body.url;

    if (!url || typeof url !== "string") {
      return NextResponse.json(
        { error: "Video URL is required." },
        { status: 400 }
      );
    }

    const parsedUrl = new URL(url);

    const hostname = parsedUrl.hostname.replace(/^www\./, "");

    let videoId = "";

    if (hostname === "youtube.com" || hostname === "m.youtube.com") {
      videoId = parsedUrl.searchParams.get("v") || "";
    } else if (hostname === "youtu.be") {
      videoId = parsedUrl.pathname.slice(1);
    }

    if (!/^[a-zA-Z0-9_-]{11}$/.test(videoId)) {
      return NextResponse.json(
        { error: "Invalid YouTube video URL." },
        { status: 400 }
      );
    }

    const videoUrl = `https://www.youtube.com/watch?v=${videoId}`;

    const response = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(videoUrl)}&format=json`,
      { cache: "no-store" }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: "Unable to retrieve video information." },
        { status: 404 }
      );
    }

    const data = await response.json();

    return NextResponse.json({
      videoId,
      title: data.title,
      author: data.author_name,
      thumbnail: data.thumbnail_url,
      provider: data.provider_name,
    });

  } catch {
    return NextResponse.json(
      { error: "Something went wrong. Check your video URL." },
      { status: 500 }
    );
  }
}
