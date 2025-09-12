import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
}

export const Card: React.FC<CardProps> = ({ title, children, className = '', titleClassName = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-sm border border-gray-200/75 p-4 ${className}`}>
      {title && <h3 className={`text-lg font-semibold text-brand-dark mb-3 ${titleClassName}`}>{title}</h3>}
      {children}
    </div>
  );
};
