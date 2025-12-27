import { type NextRequest, NextResponse } from "next/server";
import ogs from "open-graph-scraper";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const url = searchParams.get("url");

  if (!url) {
    return NextResponse.json({ error: "URL is required" }, { status: 400 });
  }

  try {
    const { result } = await ogs({
      url,
      timeout: 5000,
    });

    return NextResponse.json({
      url,
      title: result.ogTitle || result.twitterTitle || url,
      description: result.ogDescription || result.twitterDescription || "",
      image: result.ogImage?.[0]?.url || result.twitterImage?.[0]?.url || "/images/default-link-card.png",
    });
  } catch (error) {
    console.error("OGP fetch error:", error);
    return NextResponse.json(
      {
        url,
        title: url,
        description: "",
        image: "/images/default-link-card.png",
      },
      { status: 200 },
    );
  }
}
