import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useThemeContext } from '../contexts/ThemeContext';

export default function SignUp() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signup } = useAuth();
  const navigation = useNavigation();

  const { colorScheme } = useThemeContext();
  const backgroundColor = colorScheme === 'dark' ? '#141414' : '#ffffff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const inputBackground = colorScheme === 'dark' ? '#333' : '#ddd';
  const inputTextColor = colorScheme === 'dark' ? '#fff' : '#000';

  const handleSignup = async () => {
    const success = await signup(email, password);
    if (success) {
      await requestCameraAndTakePhoto();
      navigation.navigate('Settings');
    } else {
      Alert.alert('Erro', 'Usuário já existe');
    }
  };

  const requestCameraAndTakePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Não foi possível acessar a câmera');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.7,
    });

    if (!result.canceled && result.assets?.[0].uri) {
      const photoUri = result.assets[0].uri;
      await AsyncStorage.setItem('avatarUri', photoUri);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.header, { color: textColor }]}>Criar Conta</Text>
      <TextInput
        style={[
          styles.input,
          { backgroundColor: inputBackground, color: inputTextColor }
        ]}
        placeholder="E-mail"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[
          styles.input,
          { backgroundColor: inputBackground, color: inputTextColor }
        ]}
        placeholder="Senha"
        placeholderTextColor="#999"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Cadastrar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#333' }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Retornar à Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 30,
    textAlign: 'center',
  },
  input: {
    padding: 10,
    marginBottom: 15,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#E50914',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center'
  },
  buttonText: {
    color: '#fff',
  },
});