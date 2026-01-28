import React from 'react';
import { twMerge } from 'tailwind-merge';

const Card = ({ children, className, ...props }) => {
  return (
    <div 
      className={twMerge("bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden", className)}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className }) => (
  <div className={twMerge("px-6 py-4 border-b border-gray-100", className)}>
    {children}
  </div>
);

export const CardTitle = ({ children, className }) => (
  <h3 className={twMerge("text-lg font-semibold text-gray-900", className)}>
    {children}
  </h3>
);

export const CardContent = ({ children, className }) => (
  <div className={twMerge("p-6", className)}>
    {children}
  </div>
);

export default Card;
