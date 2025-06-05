import { FiHome } from 'react-icons/fi'

export const PageHeader = () => {
  return (
    <header className="sticky top-0 z-10 bg-white shadow-sm w-full">
      <div className="w-full flex items-center justify-between h-16 px-4">
        <div className="flex items-center">
          <FiHome className="h-6 w-6 text-blue-500" />
          <h1 className="ml-2 text-xl font-bold text-gray-900">This Is A Title</h1>
        </div>
      </div>
      <div className="border-b border-gray-200 w-full"></div>
    </header>
  );
};