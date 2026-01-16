"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useEffect, useState } from "react";

interface Instituicao {
  _id: string;
  nome: string;
  imagem?: string;
  bio?: string;
  codigoInstitucional: string;
}

export default function InstituicoesPage() {
  const router = useRouter();
  const [instituicoes, setInstituicoes] = useState<Instituicao[]>([]);

  useProtectedRoute("user");

  useEffect(() => {
    const fetchInstituicoes = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(
        `/api/user_instituicoes/listar?userId=${user.id}`,
      );
      const data = await res.json();
      console.log(data);
      setInstituicoes(data.instituicoes);
    };

    fetchInstituicoes();
  }, []);

  const handleClick = (codigo: string) => {
    router.push(`/espaco_user/${codigo}`);
  };

  return (
    <DefaultLayout>
      <div className="h-full max-h-[80vh] min-h-[80vh] w-full overflow-scroll rounded-3xl bg-white px-8 py-6 shadow-lg lg:px-18 lg:py-12">
        <h2 className="mb-8 text-2xl font-bold text-gray-800">
          Instituições disponíveis
        </h2>
        <div className="mt-10 flex flex-col">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {instituicoes.map((inst) => (
              <div
                key={inst._id}
                className="cursor-pointer rounded-xl bg-white p-4 shadow transition hover:shadow-lg"
                onClick={() => handleClick(inst.codigoInstitucional)}
              >
                <div
                  className="mb-4 flex h-40 w-full items-center justify-center rounded-lg bg-gray-200"
                  style={{
                    backgroundImage: `url(${inst.imagem})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                >
                  {inst.imagem ? <span></span> : <span>Imagem do Espaço</span>}
                </div>
                <h3 className="text-lg font-semibold text-blue-900">
                  {inst.nome}
                </h3>
                <p className="text-lg font-semibold text-blue-900">
                  {inst.bio
                    ? inst.bio.slice(0, 150) + "..."
                    : "Sem descrição disponivel"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
