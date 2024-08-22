import { StatusBar } from 'expo-status-bar';
import { Button, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Path, Svg, SvgUri } from 'react-native-svg';

interface ServerButtonProps {
    onPress(): void;
    image: any;
};

export default function ServerButton({onPress, image} : ServerButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={{color: 'white'}}>Logout</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
    position: "absolute",
    left: 25,
    top: 0,
    backgroundColor: 'red',
    alignItems: 'center',
    justifyContent: 'center',
  },

});
