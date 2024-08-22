import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getServerIcon, getServers, startServer, stopServer } from '../api/servers';
import { useEffect, useState } from 'react';
import ServerButton from './ServerButton';

export default function Servers() {

  const [allServers, setAllServers] = useState<Servers>([]);
  const [serverIcons, setServerIcons] = useState<{ [key: string]: string}>({});
  
  const fetchServers = async () => {
      const servers = await getServers();
      if (servers) {
        setAllServers(servers);
        servers.forEach(server => fetchServerIcon(server.serverId));
      }
  };

  const fetchServerIcon = async (serverId: string) => {
    const iconUri = await getServerIcon(serverId);
    if (iconUri) {
      setServerIcons(prevIcons => ({
        ...prevIcons,
        [serverId]: iconUri
      }));
    }
  };

  const pollServerStatus = async (serverId: string) => {
    const interval = setInterval(async () => {
        const servers = await getServers();

        if (servers) {
            setAllServers(servers);

            const server = servers.find(s => s.serverId === serverId);

            if (server && server.status === 1) { 
                clearInterval(interval); 
                clearTimeout(timeout);
                console.log("Server is online, stopped polling");
            }
        }
    }, 1000);

    const timeout = setTimeout(() => {
        clearInterval(interval);
        console.log("Server timed out after 5 minutes");
    }, 300000);
  };

  const handleStartServer = async (serverId: string) => {
    console.log("Starting server...");
    await startServer(serverId, fetchServers);
    pollServerStatus(serverId); 
  };

  const handleStopServer = async (serverId: string) => {
    console.log("Stopping server...");
    await stopServer(serverId, fetchServers);
  };

  const handleButtonPress = () => {
    console.log("Button pressed");
  };

  useEffect(() => {
    fetchServers();
  }, []);


  return (
      <View style={styles.allServersCon}>
      <TouchableOpacity style={styles.refreshButton} onPress={() => fetchServers()}>
          <Text style={styles.buttonText}>Refresh</Text>
      </TouchableOpacity>

        {allServers.map((server) => {
          const serverStatus = server.status === 1 ? "Online" : server.status === 3 ? "Starting" : "Offline";
          return ( 
            <View key={server.serverId} style={styles.serverCon}>
              {serverIcons[server.serverId] ? (
                <Image source={{ uri: serverIcons[server.serverId] }}
                       style={{ width: 50, height: 50 }}
                />
              ) : (
                <Text>Loading Icon...</Text>
              )}
              <Text style={styles.allServersText} >{server.name}</Text>
              <Text style={styles.allServersText} >{serverStatus}</Text>
              <TouchableOpacity style={styles.serverButton} onPress={server.status === 1 ? () => handleStopServer(server.serverId) : server.status === 3 ? () => console.log("Please wait...") : () => handleStartServer(server.serverId) }>
                <Text style={styles.buttonText}>{`${server.status === 1 ? "Stop" : server.status === 3 ?"Starting" : "Start"}`} </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </View>
  );
}

const styles = StyleSheet.create({
  allServersCon: {
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'center',
    width: "50%",
    gap: 10,
  },
  serverCon: {
    backgroundColor: '#1B1B1B',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    width: "50%",
    padding: 10,
    paddingTop: 20,
  },
  allServersText: {
    color: '#fff',
  },
  serverButton: {
    backgroundColor: '#393737',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 5,
  },
  refreshButton: {
    backgroundColor: '#1B1B1B',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  }
});
