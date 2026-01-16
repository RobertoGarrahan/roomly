"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React, { useState, useEffect, useRef } from "react";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { Toast } from "primereact/toast";

const PerfilUser = () => {
  const [userId, setUserId] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [telefone, setTelefone] = useState("");
  const [email, setEmail] = useState("");
  const [cep, setCep] = useState("");
  const [endereco, setEndereco] = useState("");
  const [perfilImg, setPerfilImg] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    if (user?.id) {
      setUserId(user.id);
      fetchPerfil(user.id);
    }
  }, []);

  const toast = useRef<Toast>(null);

  const fetchPerfil = async (id: string) => {
    const res = await fetch(`/api/perfil_user?id=${id}`);
    const data = await res.json();
    setNome(data.nome || "");
    setCpf(data.cpf || "");
    setTelefone(data.telefone || "");
    setEmail(data.email || "");
    setCep(data.cep || "");
    setEndereco(data.endereco || "");
    setPerfilImg(data.perfilImg || "");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/perfil_user", {
      method: "PUT",
      body: JSON.stringify({
        id: userId,
        nome,
        email,
        telefone,
        cep,
        endereco,
      }),
    });

    const result = await res.json();

    if (result.success) {
      toast.current?.show({
        severity: "success",
        summary: "Sucesso!",
        detail: "Alterações salvas com sucesso.",
        life: 3000,
      });
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao salvar alterações.",
        life: 4000,
      });
    }
  };

  const buscarEndereco = async () => {
    const cepLimpo = cep.replace(/\D/g, "");
    if (cepLimpo.length !== 8) return;

    try {
      const res = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        const enderecoFormatado = `${data.logradouro}, ${data.bairro}, ${data.localidade} - ${data.uf}`;
        setEndereco(enderecoFormatado);
      } else {
        setEndereco("CEP não encontrado.");
      }
    } catch (err) {
      console.error("Erro ao buscar endereço:", err);
      setEndereco("Erro ao buscar endereço.");
    }
  };

  useProtectedRoute("user");
  return (
    <DefaultLayout>
      <div className="flex h-full min-h-[80vh] w-full flex-col overflow-y-auto rounded-3xl bg-white px-8 py-16 shadow-lg lg:px-18">
        <Toast ref={toast} />
        <h2 className="mb-12 text-xl font-semibold text-gray-800">Perfil</h2>
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-6 md:grid-cols-2"
        >
          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nome
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              CPF
            </label>
            <input
              type="text"
              value={cpf}
              disabled
              className="w-full cursor-not-allowed rounded-lg border border-gray-300 bg-gray-100 p-3 text-gray-500"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Telefone
            </label>
            <input
              type="text"
              value={telefone}
              onChange={(e) => setTelefone(e.target.value)}
              placeholder="(00) 00000-0000"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <div className="md:col-span-2">
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="seu@email.com"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              CEP
            </label>
            <input
              type="text"
              value={cep}
              onChange={(e) => setCep(e.target.value)}
              onBlur={buscarEndereco}
              placeholder="00000-000"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Endereço
            </label>
            <input
              type="text"
              value={endereco}
              onChange={(e) => setEndereco(e.target.value)}
              placeholder="Rua, número, bairro, cidade"
              className="w-full rounded-lg border border-gray-300 p-3"
            />
          </div>

          <div className="pt-4 md:col-span-2">
            <button
              type="submit"
              className="w-full rounded-lg bg-blue-900 py-3 text-white transition hover:bg-blue-800"
            >
              Salvar alterações
            </button>
          </div>
        </form>
      </div>
    </DefaultLayout>
  );
};

export default PerfilUser;
