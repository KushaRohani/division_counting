import React, { useState, useEffect } from 'react';

const TABLET_BREAKPOINT_PX = 1024;

interface UseComputerPromptProps {
  children: React.ReactNode;
}

/**
 * Renders children only on desktop (viewport >= TABLET_BREAKPOINT_PX).
 * On mobile/tablet, shows a message asking the user to take the study on a computer.
 */
const UseComputerPrompt: React.FC<UseComputerPromptProps> = ({ children }) => {
  const [isNarrowViewport, setIsNarrowViewport] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth < TABLET_BREAKPOINT_PX : false
  );

  useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${TABLET_BREAKPOINT_PX - 1}px)`);
    const handler = () => setIsNarrowViewport(mql.matches);
    mql.addEventListener('change', handler);
    handler();
    return () => mql.removeEventListener('change', handler);
  }, []);

  if (isNarrowViewport) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 px-6 py-10 text-center">
        <div className="max-w-md space-y-4">
          <p className="text-5xl">💻</p>
          <h2 className="text-2xl font-bold text-white">
            Please use a computer
          </h2>
          <p className="text-gray-300">
            This study is designed for a computer. Please open it on a desktop or laptop for the best experience.
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default UseComputerPrompt;
