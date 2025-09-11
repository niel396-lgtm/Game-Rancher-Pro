import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const DashboardIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round"