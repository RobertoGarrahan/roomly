import { FaPlus } from "react-icons/fa";

export default function AddSpaceCard() {

  return (
    <div
      className="flex h-40 w-64 cursor-pointer flex-col items-center justify-center rounded-xl border border-gray-200 bg-white p-6 shadow-md transition hover:shadow-lg"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-gray-800 text-gray-800">
        <FaPlus size={16} />
      </div>
      <p className="mt-2 text-center text-sm font-medium text-gray-800">
        Clique aqui para adicionar um novo espaço
      </p>
    </div>
  );
}
