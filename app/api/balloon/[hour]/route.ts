export async function GET(
  _: Request,
  { params }: { params: { hour: string } },
) {
  const hour = params.hour.padStart(2, "0");
  const url = `https://a.windbornesystems.com/treasure/${hour}.json`;

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
  } catch (err) {
    return new Response(JSON.stringify({ error: "Proxy fetch failed" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
