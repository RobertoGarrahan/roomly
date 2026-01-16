"use client";
import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";

export default function Cadastro() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toggleDropdown = (type: string) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  //criar user ADM
  const [instNome, setInstNome] = useState("");
  const [instEmail, setInstEmail] = useState("");
  const [instSenha, setInstSenha] = useState("");
  const [instCnpj, setInstCnpj] = useState("");
  const [instTipoEspaco, setInstTipoEspaco] = useState("");
  const [instTelefone, setInstTelefone] = useState("");
  const [instCep, setInstCep] = useState("");
  const [instEndereco, setInstEndereco] = useState("");

  const buscarEndereco = async () => {
    const cepLimpo = instCep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const enderecoFormatado = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        setInstEndereco(enderecoFormatado);
      }
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
    }
  };

  const toast = useRef<Toast>(null);

  const handleInstituicaoSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        nome: instNome,
        email: instEmail,
        senha: instSenha,
        tipo: "admin",
        cnpj: instCnpj,
        tipoEspaco: instTipoEspaco,
        telefone: instTelefone,
        cep: instCep,
        endereco: instEndereco,
      }),
    });

    const data = await res.json();
    if (data.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Instituição cadastrada com sucesso!",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: data.error || "Erro ao cadastrar.",
        life: 4000,
      });
    }
  };

  //criar user Usuario
  const [userNome, setUserNome] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [userSenha, setUserSenha] = useState("");
  const [userCpf, setUserCpf] = useState("");
  const [userCodigoInst, setUserCodigoInst] = useState("");

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: userNome,
        email: userEmail,
        senha: userSenha,
        cpf: userCpf,
        codigoInstitucional: userCodigoInst,
        tipo: "user",
      }),
    });

    const data = await res.json();

    if (data.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Usuário cadastrado com sucesso!",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: data.error || "Erro ao cadastrar usuário.",
        life: 4000,
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-blue-900 lg:flex-row">
      <Toast ref={toast} />
      {/* Lado esquerdo */}
      <div className="hidden h-full flex-col items-center justify-center  bg-blue-900 text-white lg:flex  lg:w-1/2">
        <h1 className="mb-4 text-4xl font-bold">Bem Vindo!</h1>
        <p className="mb-6 text-center">
          Cadastre-se e comece a viver a praticidade.
        </p>
      </div>

      {/* Lado direito */}
      <div className="flex h-full w-full flex-col items-center justify-center rounded-l-2xl bg-white px-5 lg:w-1/2">
        <h2 className="mb-4 text-2xl font-semibold text-black">Cadastre-se</h2>
        <p className="mb-6 text-gray-600">
          Escolha seu modelo de cadastro para continuar.
        </p>

        {/* Sou uma Instituição */}
        <div className="rounded-xl p-5 lg:w-2/3">
          <label>
            <input
              className="peer/institution absolute scale-0"
              type="radio"
              name="expansible"
            />
            <div className="block max-h-14 overflow-hidden rounded-lg bg-gray-200 px-4 py-0 text-black shadow-lg transition-all duration-300 peer-checked/institution:max-h-[450px]">
              <h3 className="flex h-14 cursor-pointer items-center font-bold">
                Sou uma Instituição
              </h3>

              <form className="" onSubmit={handleInstituicaoSubmit}>
                {/* Nome */}
                <input
                  type="text"
                  placeholder="Nome da Instituição"
                  value={instNome}
                  onChange={(e) => setInstNome(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2 text-gray-500"
                />

                {/* Telefone e Email - mesma linha */}
                <div className="mb-3 flex gap-4">
                  <input
                    type="tel"
                    placeholder="Telefone"
                    value={instTelefone}
                    onChange={(e) => setInstTelefone(e.target.value)}
                    className="w-1/2 rounded-xl border p-2 text-gray-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={instEmail}
                    onChange={(e) => setInstEmail(e.target.value)}
                    className="w-1/2 rounded-xl border p-2 text-gray-500"
                  />
                </div>

                {/* CNPJ */}
                <input
                  type="text"
                  placeholder="CNPJ (00.000.000/0000-00)"
                  value={instCnpj}
                  onChange={(e) => setInstCnpj(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2 text-gray-500"
                />

                {/* Senha */}
                <input
                  type="password"
                  placeholder="Senha"
                  value={instSenha}
                  onChange={(e) => setInstSenha(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2 text-gray-500"
                />

                {/* CEP e Endereço - mesma linha */}
                <div className="mb-3 flex gap-4">
                  <input
                    type="text"
                    placeholder="CEP"
                    value={instCep}
                    onChange={(e) => setInstCep(e.target.value)}
                    onBlur={buscarEndereco}
                    className="w-1/2 rounded-xl border p-2 text-gray-500"
                  />
                  <input
                    type="text"
                    placeholder="Endereço"
                    value={instEndereco}
                    onChange={(e) => setInstEndereco(e.target.value)}
                    className="w-1/2 rounded-xl border p-2 text-gray-500"
                  />
                </div>

                {/* Tipo de espaço */}
                <select
                  value={instTipoEspaco}
                  onChange={(e) => setInstTipoEspaco(e.target.value)}
                  className="mb-3 w-full rounded-xl border bg-white p-2 text-gray-500"
                >
                  <option value="">Selecione o tipo de espaço</option>
                  <option value="hospital">Hospital</option>
                  <option value="faculdade">Faculdade</option>
                  <option value="condominio">Condomínio</option>
                  <option value="escola">Escola</option>
                  <option value="evento">Evento</option>
                  <option value="palestra">Palestra</option>
                  <option value="clube">Clube</option>
                  <option value="restaurante">Restaurante</option>
                  <option value="show">Show</option>
                  <option value="outros">Outros</option>
                </select>

                {/* Botão de cadastro */}
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-900 py-2 text-white hover:bg-blue-800"
                >
                  Cadastrar
                </button>
              </form>
            </div>
          </label>
        </div>

        {/* Sou Usuário */}
        <div className="mb-4 rounded-xl p-5 lg:w-2/3">
          <label>
            <input
              className="peer/user absolute scale-0"
              type="radio"
              name="expansible"
            />
            <span className="block max-h-14 overflow-hidden rounded-lg bg-gray-200 px-4 py-0 text-black shadow-lg transition-all duration-300 peer-checked/user:max-h-96">
              <h3 className="flex h-14 cursor-pointer items-center font-bold">
                Sou um Usuário
              </h3>

              <form className="" onSubmit={handleUserSubmit}>
                <input
                  type="text"
                  placeholder="Nome do Usuário"
                  value={userNome}
                  onChange={(e) => setUserNome(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2"
                />
                <input
                  type="email"
                  placeholder="Email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2"
                />
                <input
                  type="text"
                  placeholder="CPF (000.000.000-00)"
                  value={userCpf}
                  onChange={(e) => setUserCpf(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2"
                />
                <input
                  type="password"
                  placeholder="Senha"
                  value={userSenha}
                  onChange={(e) => setUserSenha(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2"
                />
                <input
                  type="text"
                  placeholder="Código Institucional (Caso já possua)"
                  value={userCodigoInst}
                  onChange={(e) => setUserCodigoInst(e.target.value)}
                  className="mb-3 w-full rounded-xl border p-2"
                />
                <button
                  type="submit"
                  className="w-full rounded-xl bg-blue-900 py-2 text-white hover:bg-blue-800"
                >
                  Cadastrar
                </button>
              </form>
            </span>
          </label>
        </div>

        <p className="mt-4 text-center text-black">
          Já tem conta?{" "}
          <a href="/login" className="font-bold text-blue-700 underline">
            Entre aqui!
          </a>
        </p>
      </div>
    </div>
  );
}
