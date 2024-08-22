import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Servers from './components/Servers';
import { useState } from 'react';
import Login from './components/Login';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {

  const [API_KEY, setAPI_KEY] = useState<string>('');
  const [IP, setIP] = useState<string>('');

  const [authenticated, setAuthenticated] = useState<boolean>(false);

  const setAuth = (authStatus: boolean) => {
    setAuthenticated(authStatus);
    console.log("Auth status: ", authStatus);
  };

  const logOut = async () => {
    await AsyncStorage.removeItem('API_KEY');
    await AsyncStorage.removeItem('IP');
    setAuthenticated(false);
  }

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      {authenticated ? (
        <>
          <Servers />
          <TouchableOpacity style={styles.button} onPress={() => logOut()}>
          <Text style={{color: 'white'}}>Logout</Text>
          </TouchableOpacity>
        </>
      ) : (
          <Login setAuth={setAuth} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#383839',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    position: "absolute",
    top: 70,
    right: 25,
    backgroundColor: '#1B1B1B',
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  }
});
