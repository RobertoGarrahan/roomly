"use client";
import useProtectedRoute from "@/hooks/useProtectedRoute";
import TableUsers from "@/components/Tables/TableUsers";
import DefaultLayout from "@/components/Layouts/DefaultLayout";

const TablesPage = () => {
  useProtectedRoute("admin");
  return (
    <DefaultLayout>
      <div className="h-full  min-h-[80vh] w-[90vw] overflow-x-auto overflow-y-auto rounded-3xl bg-white px-4 py-16 shadow-lg lg:w-full lg:px-18">
        <h2 className="mb-12 text-xl font-semibold text-gray-800">Usuários</h2>
        <div className="flex flex-col gap-10">
          <TableUsers />
        </div>
      </div>
    </DefaultLayout>
  );
};

export default TablesPage;
