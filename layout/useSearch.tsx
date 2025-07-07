import { useState } from "react";


export default function useSearch() {

    const [query, setQuery] = useState(null);
    const [isActive, setIsActive] = useState(false);
    const [theFuse, setTheFuse] = useState(null);

    return { query, isActive }
}