import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import { ObjectId } from "mongodb";

export async function GET(req: NextRequest) {
  const userId = req.nextUrl.searchParams.get("userId");
  if (!userId)
    return NextResponse.json({ error: "ID ausente" }, { status: 400 });

  const client = await clientPromise;
  const db = client.db("roomly");

  const user = await db
    .collection("usuarios")
    .findOne({ _id: new ObjectId(userId) });
  if (!user)
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 404 },
    );

  const instituicoes = await db
    .collection("instituicoes")
    .find({
      codigoInstitucional: { $in: user.codigoInstitucional },
    })
    .toArray();

  const list = await db
    .collection("usuarios")
    .find({
      codigoInstitucional: { $in: user.codigoInstitucional },
      _id: { $ne: user._id }, // exclui o próprio usuário
    })
    .toArray();

  // console.log(instituicoes);

  return NextResponse.json({ instituicoes, list });
}
