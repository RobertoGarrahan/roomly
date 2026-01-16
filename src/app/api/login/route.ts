import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: Request) {
  const { email, senha } = await req.json();

  const client = await clientPromise;
  const db = client.db("roomly");

  const user = await db.collection("usuarios").findOne({ email });

  if (!user) {
    return NextResponse.json(
      { error: "Usuário não encontrado" },
      { status: 401 },
    );
  }

  const senhaCorreta = await bcrypt.compare(senha, user.senha);
  if (!senhaCorreta) {
    return NextResponse.json({ error: "Senha incorreta" }, { status: 401 });
  }

  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      tipo: user.tipo,
    },
    JWT_SECRET,
    { expiresIn: "1d" },
  );

  console.log("TOKEN GERADO:", token);

  return NextResponse.json({
    success: true,
    token,
    user: {
      id: user._id.toString(),
      nome: user.nome,
      email: user.email,
      tipo: user.tipo,
      codigoInstitucional: user.codigoInstitucional,
    },
  });
}
