"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function useProtectedRoute(permitidoPara: "admin" | "user") {
  const router = useRouter();

  useEffect(() => {
    const tipo = localStorage.getItem("tipo");

    if (!tipo) {
      router.push("/login");
    } else if (tipo !== permitidoPara) {
      router.push(tipo === "admin" ? "/home_adm" : "/home_user");
    }
  }, []);
}
