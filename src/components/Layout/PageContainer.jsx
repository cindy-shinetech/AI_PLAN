import { PageHeader } from "./PageHeader";

export const PageContainer = ({ children }) => {
  return (
    <div className="w-full h-full bg-gray-50">
      <PageHeader />
      <div className="w-full py-2 px-4 sm:px-6 lg:px-2 "> {/* 删除 px-4 sm:px-6 lg:px-8 */}
        {children}
      </div>
    </div>
  );
};
