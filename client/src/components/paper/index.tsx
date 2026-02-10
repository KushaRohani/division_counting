import { FC, ReactNode } from 'react';

interface CenteredPaperProps {
  children: ReactNode;
}

const CenteredPaper: FC<CenteredPaperProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 flex flex-col bg-gray-800">
      {/* Persistent Warning Header */}
      <div className="w-full bg-yellow-600/90 border-b-2 border-yellow-500 shadow-lg z-10 flex-shrink-0">
        <div className="w-[50vw] mx-auto py-3 px-4">
          <p className="text-white text-center font-semibold text-sm md:text-base flex items-center justify-center gap-2">
            <span className="text-lg">⚠️</span>
            <span>Please do not use calculators or scratch paper during this experiment</span>
          </p>
        </div>
      </div>
      
      {/* Main Content Container */}
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        <div className="w-[50vw] h-full overflow-y-auto bg-gray-900 shadow-2xl rounded-lg p-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default CenteredPaper;
