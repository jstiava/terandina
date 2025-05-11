import { SvgIcon, SxProps, useTheme } from '@mui/material';

// CustomIcon component
function NativeBag(props: {
    sx?: SxProps,
    [key: string]: any
}) {

    const theme = useTheme();
    return (
        <SvgIcon {...props}>
            <svg width="17" height="20" viewBox="0 0 17 20" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M9 17.5L11 15L13 17.5H9Z" stroke="#550E00" stroke-opacity="0.35"/>
<path d="M5 17.5L7 15L9 17.5H5Z" stroke="#550E00" stroke-opacity="0.25"/>
<path d="M2 13.5L4 11L6 13.5H2Z" stroke="#550E00" stroke-opacity="0.25"/>
<path d="M6 7L4 9.5L2 7H6Z" stroke="#550E00" stroke-opacity="0.5"/>
<path d="M15 9L13 11.5L11 9H15Z" stroke="#550E00" stroke-opacity="0.25"/>
<path d="M6 4L9 8L12 4" stroke="#550E00" stroke-opacity="0.25"/>
<path d="M11.9999 8.02234C11.9999 8.02234 12.0371 5.03195 11.9999 4.02234L9 1L5.99994 4.02234C5.95832 5.09825 5.99994 8.02234 5.99994 8.02234M16 5.02211H2V18.0221H16V5.02211Z" stroke="#550E00" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
<path d="M7.5 12L9 10L10.5 12L9 14L7.5 12Z" stroke="#550E00" stroke-opacity="0.45"/>
</svg>

        </SvgIcon>
    );
}

export default NativeBag;
