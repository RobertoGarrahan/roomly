import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";

export async function GET(req: NextRequest) {
  const codigo = req.nextUrl.searchParams.get("codigo");
  if (!codigo) {
    return NextResponse.json(
      { error: "Código institucional ausente" },
      { status: 400 },
    );
  }

  const client = await clientPromise;
  const db = client.db("roomly");

  const espacos = await db
    .collection("espacos")
    .find({ codigoInstitucional: codigo })
    .toArray();

  return NextResponse.json({ espacos });
}
