
import React from 'react';

const IconWrapper: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        {children}
    </svg>
);

export const DashboardIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM4 14a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM14 14a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </IconWrapper>
);

export const AnimalIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </IconWrapper>
);

export const HabitatIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 15.75l-2.25-2.25a.75.75 0 00-1.06 0l-2.25 2.25a.75.75 0 001.06 1.06l2.25-2.25 2.25 2.25a.75.75 0 001.06-1.06zM3.75 6.75h16.5M3.75 9.75h16.5M3.75 12.75h16.5M3.75 15.75h16.5M5.25 4.5l.325.325a.75.75 0 010 1.06l-.325.325m-1.5-.525L3 6l.525.525m15 0l.525-.525L18 6l.525.525M18.75 18v.75a.75.75 0 01-1.5 0v-.75m-3 0v.75a.75.75 0 01-1.5 0v-.75m-3 0v.75a.75.75 0 01-1.5 0v-.75m-3 0v.75a.75.75 0 01-1.5 0v-.75M5.25 18v.75a.75.75 0 01-1.5 0v-.75" />
    </IconWrapper>
);

export const InventoryIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </IconWrapper>
);

export const FinanceIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v.01M12 18v-2m0-10V5M4.75 7.75h14.5M4.75 16.25h14.5" />
    </IconWrapper>
);

export const AIIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.5 1.591L5.25 14.25M9.75 3.104a2.25 2.25 0 00-2.25 2.25v4.505a2.25 2.25 0 00.5 1.591L9.75 14.25M9.75 3.104a2.25 2.25 0 012.25 2.25v4.505a2.25 2.25 0 01-.5 1.591L9.75 14.25m-7.5 6.375h15M3 20.25a2.25 2.25 0 002.25-2.25V6.104a2.25 2.25 0 00-2.25-2.25H3M16.5 20.25a2.25 2.25 0 012.25-2.25V6.104a2.25 2.25 0 01-2.25-2.25H16.5" />
    </IconWrapper>
);

export const MapIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l5.447 2.724A1 1 0 0021 16.382V5.618a1 1 0 00-1.447-.894L15 7m-6 10v-5.5m0 0l6-3m-6 3l-6-3" />
    </IconWrapper>
);

export const ClientIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z" />
    </IconWrapper>
);

export const PermitIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M12 10.5h.01M12 14.25h.01M12 18h.01M15.75 5.25H8.25A2.25 2.25 0 006 7.5v9A2.25 2.25 0 008.25 18.75h7.5A2.25 2.25 0 0018 16.5v-9A2.25 2.25 0 0015.75 5.25z" />
    </IconWrapper>
);

export const StudBookIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
         <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 6h9.75M10.5 6a1.5 1.5 0 11-3 0m3 0a1.5 1.5 0 10-3 0M3.75 6H7.5m3 12h9.75m-9.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-3.75 0H7.5m9-6h3.75m-3.75 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m-9.75 0h9.75" />
    </IconWrapper>
);

export const HarvestPlanningIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.042 21.672L13.684 16.6m0 0l-2.51 2.225.569-9.47 5.227 7.917-3.286-.672zm-7.518-.267A8.25 8.25 0 1120.25 10.5M8.288 14.212A5.25 5.25 0 1117.25 10.5" />
    </IconWrapper>
);

export const PopulationIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.53-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.618.42.973.998 1.213 1.62M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.53-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-4.67c.618.42.973.998 1.213 1.62" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 6.75a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
    </IconWrapper>
);

export const ReportIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </IconWrapper>
);

export const PHIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.286zm0 13.036h.008v.008h-.008v-.008z" />
    </IconWrapper>
);

export const HuntIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </IconWrapper>
);


export const PlusIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </IconWrapper>
);

export const TrashIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" />
    </IconWrapper>
);

export const CloseIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </IconWrapper>
);

export const IssueIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </IconWrapper>
);

export const StarIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

export const ExportIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </IconWrapper>
);

export const TrophyIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z" />
    </IconWrapper>
);

export const RainfallIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.375v1.5m-3.353-2.846l1.06 1.06m6.586 0l-1.06-1.06M21 12.75H2.25m16.5 0v.375c0 .621-.504 1.125-1.125 1.125H6.875A1.125 1.125 0 015.75 13.125v-.375m13.125 0c0-3.49-2.86-6.375-6.375-6.375S5.625 9.26 5.625 12.75m13.125 0c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-.375m-9 0c0 .621.504 1.125 1.125 1.125h1.5A1.125 1.125 0 009.75 13.125v-.375" />
    </IconWrapper>
);

export const WaterIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.375v1.5m-3.353-2.846l1.06 1.06m6.586 0l-1.06-1.06M21 12.75H2.25m16.5 0v.375c0 .621-.504 1.125-1.125 1.125H6.875A1.125 1.125 0 015.75 13.125v-.375m13.125 0c0-3.49-2.86-6.375-6.375-6.375S5.625 9.26 5.625 12.75m13.125 0c0 .621-.504 1.125-1.125 1.125h-1.5a1.125 1.125 0 01-1.125-1.125v-.375m-9 0c0 .621.504 1.125 1.125 1.125h1.5A1.125 1.125 0 009.75 13.125v-.375" />
    </IconWrapper>
);

export const ForageIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l1.25-1.25a.75.75 0 011.06 0l1.25 1.25-1.25 1.25a.75.75 0 01-1.06 0l-1.25-1.25zM12.75 2.25l1.25 1.25a.75.75 0 010 1.06l-1.25 1.25-1.25-1.25a.75.75 0 010-1.06l1.25-1.25zM2.25 21.75l1.25-1.25a.75.75 0 011.06 0l1.25 1.25-1.25 1.25a.75.75 0 01-1.06 0l-1.25-1.25zM21.75 2.25l-1.25 1.25a.75.75 0 01-1.06 0l-1.25-1.25 1.25-1.25a.75.75 0 011.06 0l1.25 1.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 17.25h7.5M6.75 8.25v7.5M17.25 8.25v7.5" />
    </IconWrapper>
);

export const VeldIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.75l1.25-1.25a.75.75 0 011.06 0l1.25 1.25-1.25 1.25a.75.75 0 01-1.06 0l-1.25-1.25zM12.75 2.25l1.25 1.25a.75.75 0 010 1.06l-1.25 1.25-1.25-1.25a.75.75 0 010-1.06l1.25-1.25zM2.25 21.75l1.25-1.25a.75.75 0 011.06 0l1.25 1.25-1.25 1.25a.75.75 0 01-1.06 0l-1.25-1.25zM21.75 2.25l-1.25 1.25a.75.75 0 01-1.06 0l-1.25-1.25 1.25-1.25a.75.75 0 011.06 0l1.25 1.25z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h7.5M8.25 17.25h7.5M6.75 8.25v7.5M17.25 8.25v7.5" />
    </IconWrapper>
);

export const HistoryIcon: React.FC<{className?: string}> = ({className='w-6 h-6'}) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0011.664 0l3.181-3.183m-4.991-2.691v4.992h-4.992" />
    </IconWrapper>
);

export const VeterinaryIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0 1.2-1.79 3-6 3s-6-1.8-6-3c0-1.2 1.79-3 6-3s6 1.8 6 3z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 11.25c0 1.2-1.79 3-6 3s-6-1.8-6-3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 8.25V18a2.25 2.25 0 002.25 2.25h13.5A2.25 2.25 0 0021 18V8.25" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15V3m0 12l-2.25-1.5M12 15l2.25-1.5" />
    </IconWrapper>
);

export const DocumentIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </IconWrapper>
);

export const GameMeatIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 4.5l7.5 7.5-7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 4.5l7.5 7.5-7.5 7.5" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.704 3.235a.75.75 0 011.092 0l7.265 6.357a.75.75 0 010 1.092l-7.265 6.357a.75.75 0 01-1.092 0L2.44 11.775a.75.75 0 010-1.092L9.704 3.235z" />
    </IconWrapper>
);

export const BioeconomicsIcon: React.FC<{ className?: string }> = ({ className = 'w-6 h-6' }) => (
    <IconWrapper className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.517l2.74-1.22m0 0l-3.182-3.182m3.182 3.182v4.995m-16.5-2.131V8.25m0 0h4.995M2.25 8.25l3.182 3.182" />
    </IconWrapper>
);
