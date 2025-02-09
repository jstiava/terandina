

const apiBase = process.env.DEV_API_BASE;

async function fetchAppServer(url : string, options = {}) {

    const fullUrl = `${apiBase}${url}`;

    const res = await fetch(fullUrl, options);

    return res;
}

export default fetchAppServer;