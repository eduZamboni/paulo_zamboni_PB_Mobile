import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useThemeContext } from '../contexts/ThemeContext';

export default function Profile() {
  const navigation = useNavigation();
  const { user, loading } = useAuth();
  const { colorScheme } = useThemeContext();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const backgroundColor = colorScheme === 'dark' ? '#141414' : '#ffffff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';
  const inputBackground = colorScheme === 'dark' ? '#333' : '#ddd';
  const inputTextColor = colorScheme === 'dark' ? '#fff' : '#000';

  useEffect(() => {
    if (!user) return;
    // Buscar do AsyncStorage a lista de users
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem('users');
        let users = stored ? JSON.parse(stored) : [];
        const found = users.find((u) => u.email === user.email);
        if (found) {
          setEmail(found.email);
          setPassword(found.password);
        }
      } catch (error) {
        console.log('Erro ao carregar dados do usuário:', error);
      }
    };
    loadUserData();
  }, [user]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={[styles.text, { color: textColor }]}>Carregando...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.text, { color: textColor }]}>Você precisa estar logado.</Text>
      </View>
    );
  }

  const handleSaveProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('users');
      let users = stored ? JSON.parse(stored) : [];

      const idx = users.findIndex((u) => u.email === user.email);
      if (idx === -1) {
        Alert.alert('Erro', 'Usuário não encontrado');
        return;
      }

      const newEmail = email.trim();
      const newPassword = password.trim();

      if (newEmail !== user.email) {
        const exists = users.find((u) => u.email === newEmail);
        if (exists) {
          Alert.alert('Erro', 'Este e-mail já está em uso por outro usuário.');
          return;
        }
      }

      users[idx].email = newEmail;
      users[idx].password = newPassword;

      await AsyncStorage.setItem('users', JSON.stringify(users));

      await AsyncStorage.setItem('token', newEmail);

      Alert.alert('Sucesso', 'Dados atualizados com sucesso!');
    } catch (error) {
      console.log('Erro ao salvar perfil:', error);
      Alert.alert('Erro', 'Não foi possível salvar os dados do usuário.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>Alterar E-mail e Senha</Text>

      <TextInput
        style={[styles.input, { backgroundColor: inputBackground, color: inputTextColor }]}
        placeholder="E-mail"
        placeholderTextColor="#999"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={[styles.input, { backgroundColor: inputBackground, color: inputTextColor }]}
        placeholder="Senha"
        placeholderTextColor="#999"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleSaveProfile}>
        <Text style={styles.buttonText}>Salvar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#666' }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>Voltar para Home</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  text: {
    fontSize: 16,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  input: {
    marginBottom: 15,
    borderRadius: 5,
    padding: 10,
  },
  button: {
    backgroundColor: '#E50914',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
  },
});