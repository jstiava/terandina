

export default function DiamondPattern({
    colors
} : {
    colors: string[]
}) {

    if (!colors || colors.length < 3) {
        return <></>
    }

    return (
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50.0001" cy="50" r="50" fill={colors[0]} />
            <rect x="21.0001" y="50.4454" width="41.6421" height="41.6421" transform="rotate(-45 21.0001 50.4454)" fill={colors[1]} />
            <rect x="26.3538" y="50.4454" width="34.0708" height="34.0708" transform="rotate(-45 26.3538 50.4454)" fill={colors[0]} />
            <rect x="31.7075" y="50.4454" width="26.4995" height="26.4995" transform="rotate(-45 31.7075 50.4454)" fill={colors[1]} />
            <rect x="37.0612" y="50.4454" width="18.9282" height="18.9282" transform="rotate(-45 37.0612 50.4454)" fill={colors[0]} />
            <rect x="45.6271" y="50.4454" width="6.81417" height="6.81417" transform="rotate(-45 45.6271 50.4454)" fill={colors[1]} />
        </svg>

    )
}