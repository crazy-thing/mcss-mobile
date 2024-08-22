import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TextInput, View } from 'react-native';
import { getApi } from '../api/login';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LoginProps {
    setAuth(authStatus: boolean): void;
}

export default function Login({ setAuth }: LoginProps) {

  const [API_KEY, setAPI_KEY] = useState<string>('');
  const [IP, setIP] = useState<string>('');

  useEffect(() => {
    const loadAuth = async () => {
        try {
            const storedApiKey = await AsyncStorage.getItem('API_KEY');
            const storedIP = await AsyncStorage.getItem('IP');
            if (storedApiKey && storedIP) {
                setAPI_KEY(storedApiKey);
                setIP(storedIP);
                const auth = await getApi(storedApiKey, storedIP);
                if (auth) setAuth(true);
            }
        } catch (error) {
            console.log('Failed to load auth', error);
        }
        finally {
        }
    };

    loadAuth();

  }, []);

  const handleApiAuth = async () => {
    const auth = await getApi(API_KEY, IP);

    if (auth) {
        await AsyncStorage.setItem('API_KEY', API_KEY);
        await AsyncStorage.setItem('IP', IP);
        setAuth(true);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        placeholder="API Key"
        value={API_KEY}
        onChangeText={setAPI_KEY}  
        style={styles.input}
      />
      <TextInput
        placeholder="IP Address"
        value={IP}
        onChangeText={setIP} 
        style={styles.input}
      />

      <Button title="Login" onPress={handleApiAuth} />
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    color: "#fff"
  },
});
