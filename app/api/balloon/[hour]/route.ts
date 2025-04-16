import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ hour: string }> },
) {
  const { hour } = await context.params;
  const paddedHour = hour.padStart(2, "0");

  const url = `https://a.windbornesystems.com/treasure/${paddedHour}.json`;

  try {
    const res = await fetch(url);
    const text = await res.text();

    return new Response(text, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Failed to fetch data." }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
