"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableReservas from "@/components/Tables/TableReservasAdm";

export default function Home() {
  useProtectedRoute("admin");
  return (
    <DefaultLayout>
      <div className="h-full  min-h-[80vh] w-[90vw] overflow-x-auto overflow-y-auto rounded-3xl bg-white px-4 py-16 shadow-lg lg:w-full lg:px-18">
        <h2 className="mb-12 text-xl font-semibold text-gray-800">Reservas</h2>
        <div className="flex flex-col gap-10">
          <TableReservas />
        </div>
      </div>
    </DefaultLayout>
  );
}
