export const getApi = async (API_KEY: string, IP: string) => {
    try {
        const res = await fetch(`${IP}/api/v2/`, {
            headers: {
                "apiKey": API_KEY,
            },
        });
        
        console.log(res.status);

        if (!res.ok) {
            throw new Error('Failed to fetch servers');
        };

        if (res.status === 200) {
            console.log("Successfully fetched api");
            return true;
        }

    } catch (error) {
        console.log("Failed to fetch servers", error);
    }
};