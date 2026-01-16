import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongo";
import bcrypt from "bcrypt";

function gerarCodigoInstituicao() {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numeros = "0123456789";
  let codigo = "";
  for (let i = 0; i < 3; i++) {
    codigo += letras.charAt(Math.floor(Math.random() * letras.length));
  }
  for (let i = 0; i < 3; i++) {
    codigo += numeros.charAt(Math.floor(Math.random() * numeros.length));
  }
  return codigo;
}

export async function POST(req: Request) {
  const {
    nome,
    email,
    senha,
    tipo,
    tipoEspaco,
    cnpj,
    cpf,
    codigoInstitucional,
    telefone,
    cep,
    imagem,
    endereco,
  } = await req.json();

  const client = await clientPromise;
  const db = client.db("roomly");

  const existingUser = await db.collection("usuarios").findOne({ email });
  if (existingUser) {
    return NextResponse.json(
      { error: "Usuário já cadastrado." },
      { status: 400 },
    );
  }

  const hashedSenha = await bcrypt.hash(senha, 10);

  //geração do código institucional (apenas se for admin)
  let codigoGerado = codigoInstitucional;
  if (tipo === "admin") {
    let existe = true;
    while (existe) {
      codigoGerado = gerarCodigoInstituicao();
      const existeCodigo = await db
        .collection("usuarios")
        .findOne({ codigoInstitucional: codigoGerado });
      if (!existeCodigo) existe = false;
    }
  }

  const novoUsuario = {
    nome,
    email,
    senha: hashedSenha,
    tipo,
    tipoEspaco: tipoEspaco || null,
    cnpj: cnpj || null,
    cpf: cpf || null,
    codigoInstitucional: [codigoGerado],
    telefone: telefone || null,
    cep: cep || null,
    endereco: endereco || null,
    createdAt: new Date(),
  };

  const userInsertResult = await db
    .collection("usuarios")
    .insertOne(novoUsuario);

  //se for admin, cria a instituição vinculada
  if (tipo === "admin") {
    await db.collection("instituicoes").insertOne({
      nome,
      cnpj,
      email,
      telefone,
      endereco,
      cep,
      imagem,
      codigoInstitucional: codigoGerado,
      adminId: userInsertResult.insertedId,
      createdAt: new Date(),
    });
  }

  return NextResponse.json({ success: true });
}
