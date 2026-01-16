"use client";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  useProtectedRoute("user");
  const router = useRouter();
  const [codigo, setCodigo] = useState("");
  const [instituicoes, setInstituicoes] = useState([]);
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const buscarInstituicoes = async () => {
    const res = await fetch(`/api/user_instituicoes/listar?userId=${user.id}`);
    const data = await res.json();
    setInstituicoes(data.instituicoes || []);
  };

  const vincularInstituicao = async () => {
    if (!codigo) return alert("Digite o código");
    const res = await fetch("/api/user_instituicoes/vincular", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user.id, novoCodigo: codigo }),
    });
    const data = await res.json();
    if (data.success) {
      setCodigo("");
      buscarInstituicoes();
    } else {
      alert(data.error || "Erro ao vincular");
    }
  };

  useEffect(() => {
    buscarInstituicoes();
  }, []);

  return (
    <DefaultLayout>
      <div className="flex h-[80vh] w-full flex-col justify-between overflow-y-auto rounded-3xl bg-white px-8 py-16 shadow-lg">
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xl text-center">
            <label className="mb-4 block text-lg font-semibold text-gray-700">
              Digite aqui o código de alguma instituição
            </label>
            <div className="flex gap-4">
              <input
                type="text"
                value={codigo}
                onChange={(e) => setCodigo(e.target.value)}
                placeholder="Ex: ABC123"
                className="w-full rounded-lg border border-gray-300 p-4 text-lg focus:outline-none focus:ring-2 focus:ring-blue-900"
              />
              <button
                onClick={vincularInstituicao}
                className="rounded-lg bg-blue-900 px-4 text-white"
              >
                Adicionar
              </button>
            </div>
          </div>
        </div>

        <div className="pb-6 pt-12">
          <h3 className="mb-6 text-center text-xl font-semibold text-gray-800">
            Instituições já adicionadas
          </h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {instituicoes.map((inst: any, index: number) => (
              <div
                key={index}
                onClick={() =>
                  router.push(`/espaco_user/${inst.codigoInstitucional}`)
                }
                className="cursor-pointer rounded-lg border border-gray-200 bg-gray-50 p-4 shadow-sm transition hover:bg-gray-100 hover:shadow-md"
              >
                <h4 className="text-lg font-medium text-gray-800">
                  {inst.nome}
                </h4>
                <p className="mt-1 text-sm text-gray-500">
                  Código: {inst.codigoInstitucional}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
