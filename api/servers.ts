import AsyncStorage from "@react-native-async-storage/async-storage";

export const getServers = async () => {
    const API_KEY = await AsyncStorage.getItem('API_KEY');
    const IP = await AsyncStorage.getItem('IP');
    if (!API_KEY) throw new Error('API key is missing');
    if (!IP) throw new Error('IP is missing');

    console.log('Fetching servers');
    try {
        const res = await fetch(`${IP}/api/v2/servers`, {
            headers: {
                "apiKey": API_KEY,
            },
        });
        
        console.log(res.status);

        if (!res.ok) {
            throw new Error('Failed to fetch servers');
        };

        const json = await res.json();
        const servers: Servers = json as Servers;

        return servers;

    } catch (error) {
        console.log("Failed to fetch servers", error);
    }
};

export const startServer = async (serverId: string, cb: (success: boolean) => void) => {
    const API_KEY = await AsyncStorage.getItem('API_KEY');
    const IP = await AsyncStorage.getItem('IP');
    if (!API_KEY) throw new Error('API key is missing');
    if (!IP) throw new Error('IP is missing');

    console.log('Starting server');
    try {
        const res = await fetch(`${IP}/api/v2/servers/${serverId}/execute/action`, {
            method: 'POST',
            headers: {
                "apiKey": API_KEY,
            },
            body: JSON.stringify({"action": 2}),
        });

        console.log(res);
        if (res.ok) {
            await cb(true);
        }
    } catch (error) {
        console.error("Failed to start server", error);
    }
};

export const stopServer = async (serverId: string, cb: (success: boolean) => void) => {
    const API_KEY = await AsyncStorage.getItem('API_KEY');
    const IP = await AsyncStorage.getItem('IP');
    if (!API_KEY) throw new Error('API key is missing');
    if (!IP) throw new Error('IP is missing');
    
    console.log('Stopping server');
    try {
        const res = await fetch(`${IP}/api/v2/servers/${serverId}/execute/action`, {
            method: 'POST',
            headers: {
                "apiKey": API_KEY,
            },
            body: JSON.stringify({"action": 1}),
        });

        console.log(res);
        if (res.ok) {
            await cb(true);
        }
    } catch (error) {
        console.error("Failed to start server", error);
    }
};

export const getServerIcon = async (serverId: string) => {
    try {
        const API_KEY = await AsyncStorage.getItem('API_KEY');
        const IP = await AsyncStorage.getItem('IP');
        
        if (!API_KEY || !IP) {
            throw new Error('API key or IP is missing');
        }
        
        console.log('Getting server icon from:', `${IP}/api/v2/servers/${serverId}/icon`);

        const res = await fetch(`${IP}/api/v2/servers/${serverId}/icon`, {
            headers: {
                "apiKey": API_KEY,
            },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch server icon: ${res.statusText}`);
        }

        const blob = await res.blob();
        
        const base64Data = await blobToBase64(blob);
        
        return `data:image/png;base64,${base64Data}`;

    } catch (error) {
        console.error("Error fetching server icon:", error);
    }
};

const blobToBase64 = (blob: Blob): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64String = reader.result as string;
            resolve(base64String.split(',')[1]); 
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
    });
};