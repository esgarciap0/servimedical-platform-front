import type { ReactElement } from 'react'
import SvgIcon, { type SvgIconProps } from '@mui/material/SvgIcon'

export type AppIconComponent = (props: SvgIconProps) => ReactElement

export function AddBoxIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z" /></SvgIcon>
}

export function ArrowForwardIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M12 4 10.6 5.4 16.2 11H4v2h12.2l-5.6 5.6L12 20l8-8-8-8Z" /></SvgIcon>
}

export function CloseIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="m18.3 5.7-1.4-1.4L12 9.2 7.1 4.3 5.7 5.7l4.9 4.9-4.9 4.9 1.4 1.4 4.9-4.9 4.9 4.9 1.4-1.4-4.9-4.9 4.9-4.9Z" /></SvgIcon>
}

export function EditIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M3 17.2V21h3.8L17.9 9.9l-3.8-3.8L3 17.2ZM20.7 7a1 1 0 0 0 0-1.4l-2.3-2.3a1 1 0 0 0-1.4 0l-1.8 1.8 3.8 3.8L20.7 7Z" /></SvgIcon>
}

export function PageviewIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 7V3.5L18.5 9H13Zm-1 2a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm3.7 4.3 2.4 2.4-1.4 1.4-2.4-2.4 1.4-1.4Z" /></SvgIcon>
}

export function PictureAsPdfIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Zm-1 7V3.5L18.5 9H13ZM7 13h2.2c1.2 0 2 .8 2 1.9s-.8 1.9-2 1.9H8.4V19H7v-6Zm1.4 2.6h.7c.5 0 .8-.3.8-.7s-.3-.7-.8-.7h-.7v1.4Zm3.5-2.6h2c1.8 0 2.8 1.1 2.8 3s-1 3-2.8 3h-2v-6Zm1.4 4.7h.5c1 0 1.5-.6 1.5-1.7s-.5-1.7-1.5-1.7h-.5v3.4Zm4-4.7H21v1.3h-2.3v1.1h2v1.2h-2V19h-1.4v-6Z" /></SvgIcon>
}

export function DashboardIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M3 13h8V3H3v10Zm0 8h8v-6H3v6Zm10 0h8V11h-8v10Zm0-18v6h8V3h-8Z" /></SvgIcon>
}

export function MenuIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z" /></SvgIcon>
}

export function NotificationsNoneIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M12 22a2.5 2.5 0 0 0 2.5-2.5h-5A2.5 2.5 0 0 0 12 22Zm6-6v-5a6 6 0 0 0-5-5.9V4a1 1 0 1 0-2 0v1.1A6 6 0 0 0 6 11v5l-2 2v1h16v-1l-2-2Zm-2 .5H8V11a4 4 0 0 1 8 0v5.5Z" /></SvgIcon>
}

export function ConstructionIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="m22.6 18.99-9.08-9.08c.93-2.34.45-5.1-1.44-6.99A6.01 6.01 0 0 0 5.67 1.5l3.85 3.85-2.83 2.83-3.98-3.72a6.02 6.02 0 0 0 1.5 6.22 6.1 6.1 0 0 0 6.99 1.44l9.08 9.08 2.32-2.21Z" /></SvgIcon>
}

export function ReceiptLongIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M19 3H5v18l2-1 2 1 2-1 2 1 2-1 2 1 2-1V3Zm-3 12H8v-2h8v2Zm0-4H8V9h8v2Zm0-4H8V5h8v2Z" /></SvgIcon>
}

export function MedicalServicesIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2ZM10 4h4v2h-4V4Zm6 11h-3v3h-2v-3H8v-2h3v-3h2v3h3v2Z" /></SvgIcon>
}

export function LocalHospitalIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M19 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-2 10h-4v4h-2v-4H7v-2h4V7h2v4h4v2Z" /></SvgIcon>
}

export function AccountBalanceIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M4 10h3v8H4v-8Zm6 0h3v8h-3v-8Zm6 0h3v8h-3v-8ZM2 20h20v2H2v-2Zm10-18 10 5v1H2V7l10-5Z" /></SvgIcon>
}

export function AssignmentTurnedInIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M19 3h-4.2A3 3 0 0 0 12 1a3 3 0 0 0-2.8 2H5a2 2 0 0 0-2 2v15a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2Zm-7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2Zm-1.2 14.4-4.2-4.2L8 11.8l2.8 2.8L16 9.4l1.4 1.4-6.6 6.6Z" /></SvgIcon>
}

export function AnalyticsIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M4 19h16v2H4v-2Zm2-8h3v6H6v-6Zm5-6h3v12h-3V5Zm5 3h3v9h-3V8Z" /></SvgIcon>
}

export function AdminPanelSettingsIcon(props: SvgIconProps) {
    return <SvgIcon {...props}><path d="M12 1 4 4v6c0 5 3.4 9.7 8 11 4.6-1.3 8-6 8-11V4l-8-3Zm3.7 8.7-4.2 4.2-2.2-2.2 1.4-1.4.8.8 2.8-2.8 1.4 1.4Z" /></SvgIcon>
}
