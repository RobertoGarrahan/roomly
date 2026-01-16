"use client";
import { useRouter } from "next/navigation";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import React, { useState, useEffect } from "react";
import { FaPlus, FaImage } from "react-icons/fa";
import Image from "next/image";

export default function HomeAdm() {
  useProtectedRoute("admin");
  const router = useRouter();
  const [nome, setNome] = useState("");
  const [bio, setBio] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState("");
  const [espacos, setEspacos] = useState<Espaco[]>([]);
  interface Espaco {
    _id: string;
    nome: string;
    imagem?: string;
    espacoImg?: string;
  }

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (user?.id) {
      fetchPerfil(user.id);
    }
  }, []);
  console.log(espacos);
  const fetchPerfil = async (id: string) => {
    const res = await fetch("/api/perfil_adm", {
      method: "GET",
      headers: { "user-id": id },
    });

    const data = await res.json();
    setNome(data.nome || "");
    setBio(data.bio || "");
    setFotoPerfil(data.imagem || "");
  };

  useEffect(() => {
    const fetchEspacos = async () => {
      const user = JSON.parse(localStorage.getItem("user") || "{}");
      const res = await fetch(
        `/api/espaco_adm/listar?codigo=${user.codigoInstitucional}`,
      );
      const data = await res.json();
      setEspacos(data.espacos);
    };

    fetchEspacos();
  }, []);

  return (
    <DefaultLayout>
      <div className="h-full max-h-[80vh] min-h-[80vh] w-full overflow-scroll rounded-3xl bg-white p-6 px-8 shadow-lg lg:px-18 lg:py-12">
        {/* Seção Principal */}
        <div className="flex flex-col gap-6 pt-4 lg:flex-row">
          {/* Imagem Principal */}
          <div className="flex h-[30vh] w-full items-center justify-center rounded-3xl bg-gray-200 lg:w-1/2">
            {fotoPerfil ? (
              <img
                src={fotoPerfil}
                alt="Foto da instituição"
                className="h-full w-full rounded-3xl object-cover"
              />
            ) : (
              <span className="text-gray-500">
                Edite seu perfil e adicione uma imagem
              </span>
            )}
          </div>

          {/* Texto e Descrição */}
          <div className="w-full px-4 lg:w-1/2">
            <h2 className="font-[Comfortaa] text-2xl font-semibold">
              {nome || "Nome da instituição"}
            </h2>
            <p className="mt-2 font-[Poppins] text-gray-600">
              {bio || "Edite seu perfil e adicione uma descrição."}
            </p>
          </div>
        </div>

        {/* Grid de Itens */}
        <div className="grid-cols mt-36 grid gap-6 md:grid-cols-4">
          {espacos.map((espaco) => (
            <div
              key={espaco._id}
              className="relative flex h-[25vh] flex-col justify-center overflow-hidden rounded-3xl shadow-md"
              style={{
                backgroundImage: `url(${espaco.espacoImg})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Overlay escuro */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20"></div>

              {/* Conteúdo sobreposto */}
              <div className="relative z-10 flex h-full flex-col items-center justify-center">
                <p className="text-center font-[Poppins] text-sm font-semibold text-white/90">
                  {espaco.nome}
                </p>
              </div>
            </div>
          ))}

          {/* Botão Novo Espaço */}
          <div
            onClick={() => router.push("/espaco_adm")}
            className="flex h-[25vh] cursor-pointer flex-col items-center justify-center rounded-3xl bg-gray-200 transition hover:bg-gray-300"
          >
            <FaPlus className="text-2xl text-gray-700" />
            <p className="mt-2 font-[Poppins] text-gray-700">Novo Espaço</p>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
