
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const DashboardIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </IconWrapper>
);

export const AnimalIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H4.5A2.25 2.25 0 002.25 15v6.75a2.25 2.25 0 002.25 2.25z" />
    </IconWrapper>
);

export const HabitatIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 15.75l-2.52-2.52a4.5 4.5 0 00-6.36 0l-2.52 2.52M21 12l-2.25-2.25a4.5 4.5 0 00-6.36 0l-2.25 2.25m5.51 5.51l-2.52-2.52a4.5 4.5 0 00-6.36 0l-2.52 2.52m16.5-6.36l-2.25-2.25a4.5 4.5 0 00-6.36 0l-2.25 2.25m16.5 0l-2.25-2.25a4.5 4.5 0 00-6.36 0l-2.25 2.25" />
    </IconWrapper>
);

export const InventoryIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12c0-1.232-.046-2.453-.138-3.662a4.006 4.006 0 00-3.7-3.7 48.678 48.678 0 00-7.324 0 4.006 4.006 0 00-3.7 3.7c-.092 1.21-.138 2.43-.138 3.662v4.159c0 1.232.046 2.453.138 3.662a4.006 4.006 0 003.7 3.7 48.656 48.656 0 007.324 0 4.006 4.006 0 003.7-3.7c.092-1.21.138-2.43.138-3.662v-4.159z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.382a48.62 48.62 0 016.5 0M12 17.618a48.62 48.62 0 016.5 0M12 6.382a48.62 48.62 0 00-6.5 0M12 17.618a48.62 48.62 0 00-6.5 0" />
    </IconWrapper>
);

export const FinanceIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconWrapper>
);

export const AIIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M12 4.5v-1.5m0 18v-1.5m3.75-15H21m-18 0h1.5m15 15h1.5m-18 0h1.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8.25a3.75 3.75 0 100 7.5 3.75 3.75 0 000-7.5z" />
    </IconWrapper>
);

export const MapIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-.553-.894L15 2m-6 5l6-3m0 0l6 3m-6-3v10" />
    </IconWrapper>
);

export const WaterIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v10.5M12 21a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 15.75l3-3 3 3" />
    </IconWrapper>
);

export const WaterTroughIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75V12A2.25 2.25 0 014.5 9.75h15A2.25 2.25 0 0121.75 12v.75m-8.69-6.44l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z" />
    </IconWrapper>
);

export const PumpIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75v10.5M12 21a8.25 8.25 0 100-16.5 8.25 8.25 0 000 16.5z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75h6" />
    </IconWrapper>
);

export const GateIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 8.25h13.5M5.25 15.75h13.5M8.25 5.25v13.5" />
    </IconWrapper>
);

export const HuntingHideIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
    </IconWrapper>
);

export const ForageIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </IconWrapper>
);

export const VeldIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M15.362 5.214A8.252 8.252 0 0112 21 8.25 8.25 0 016.038 7.048 8.287 8.287 0 009 9.6a8.983 8.983 0 013.361-6.867 8.21 8.21 0 003 2.48z" />
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 18a3.75 3.75 0 00.495-7.467 5.99 5.99 0 00-1.925 3.546 5.974 5.974 0 01-2.133-1.001A3.75 3.75 0 0012 18z" />
    </IconWrapper>
);


export const IssueIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </IconWrapper>
);

export const PlusIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </IconWrapper>
);

export const TrashIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </IconWrapper>
);

export const CloseIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </IconWrapper>
);

export const StarIcon: React.FC<{className?: string; filled?: boolean}> = ({className='w-5 h-5', filled = true}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill={filled ? "currentColor" : "none"} stroke="currentColor" className={className}>
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
);

export const RainfallIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
    </IconWrapper>
);
