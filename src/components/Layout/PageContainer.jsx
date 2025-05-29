import { PageHeader } from "./PageHeader";
 
export const PageContainer = ({ children }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <PageHeader />
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        
        {children}
      </div>
    </div>
  )
}