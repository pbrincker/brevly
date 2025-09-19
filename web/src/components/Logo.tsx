import React from 'react';

interface LogoProps {
  className?: string;
  width?: number;
  height?: number;
}

/**
 * Componente Logo do projeto
 */
export function Logo({ className = '', width = 97, height = 24 }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`} style={{ width, height }}>
      {/* Ícone de cadeia azul */}
      <svg 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="mr-2"
      >
        <path 
          d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" 
          stroke="#2C46B1" 
          strokeWidth="2" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        />
      </svg>
      
      {/* Texto "brev.ly" */}
      <span className="text-2xl font-bold text-blue-600">brev.ly</span>
    </div>
  );
}
