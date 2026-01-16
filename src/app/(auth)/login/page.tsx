"use client";
import React, { useState, useRef } from "react";
import { Toast } from "primereact/toast";

export default function Login() {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const toggleDropdown = (type: string) => {
    setActiveDropdown((prev) => (prev === type ? null : type));
  };

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const toast = useRef<Toast>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    let data;
    try {
      data = await res.json();
    } catch (error) {
      console.error("Erro ao converter JSON:", error);
      toast.current?.show({
        severity: "error",
        summary: "Erro",
        detail: "Erro ao processar resposta do servidor.",
        life: 3000,
      });
      return;
    }

    console.log("RESPOSTA DA API:", data);

    if (res.ok && data.success) {
      localStorage.setItem("token", data.token);

      const userData = {
        id: data.user.id,
        nome: data.user.nome,
        email: data.user.email,
        tipo: data.user.tipo,
        codigoInstitucional: data.user.codigoInstitucional || "",
      };

      localStorage.setItem("user", JSON.stringify(userData));
      localStorage.setItem("tipo", userData.tipo);

      if (data.user.tipo === "admin") {
        window.location.href = "/home_adm";
      } else {
        window.location.href = "/home_user";
      }
    } else {
      toast.current?.show({
        severity: "error",
        summary: "Falha no login",
        detail: data.error || "Credenciais inválidas.",
        life: 3000,
      });
    }
  };

  return (
    <div className="flex h-screen flex-col bg-blue-900 lg:flex-row">
      <Toast ref={toast} />
      {/* Lado esquerdo */}
      <div className="hidden h-full flex-col items-center justify-center  bg-blue-900 text-white lg:flex  lg:w-1/2">
        <h1 className="mb-4 text-left text-4xl font-bold">
          Bem Vindo de Volta!
        </h1>
        <p className="mb-6 text-center">
          Entre e desfrute da praticidade e organização com o Roomly.
        </p>
      </div>

      {/* Lado direito */}
      <div className="flex h-full w-full flex-col items-center justify-center rounded-l-2xl bg-white px-5 lg:w-1/2">
        <h2 className="mb-4 text-2xl font-semibold text-black">
          Entre na plataforma
        </h2>

        {/* Forms de Login */}
        <div className="mb-4 rounded-xl bg-gray-200 p-5 lg:w-2/3">
          <form className="mt-1" onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="Email"
              className="mb-3 w-full rounded-xl border p-2 text-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type="password"
              placeholder="Senha"
              className="mb-3 w-full rounded-xl border p-2 text-black"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
            />
            <button
              type="submit"
              className="w-full rounded-xl bg-blue-900 py-2 text-white hover:bg-blue-800"
            >
              Entrar
            </button>
            <p className="mt-4 text-center text-black">
              Não tem conta ainda?{" "}
              <a href="/cadastro" className="font-bold text-blue-700 underline">
                Cadastre-se
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
