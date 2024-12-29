import React, { useState, useEffect } from 'react';
import { View, Text, Switch, StyleSheet, TextInput, TouchableOpacity, Alert, Image } from 'react-native';
import { useGlobalContext } from '../contexts/GlobalContext';
import { useThemeContext } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';

export default function Settings() {
  const { t } = useTranslation();
  const { language, changeLanguage } = useGlobalContext();
  const { theme, setThemeMode, colorScheme } = useThemeContext();
  const { user, logout } = useAuth();
  const navigation = useNavigation();

  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [babyName, setBabyName] = useState('');
  const [babyWeight, setBabyWeight] = useState('');
  const [babyLength, setBabyLength] = useState('');
  const [avatarUri, setAvatarUri] = useState(null);

  useEffect(() => {
    (async () => {
      const notif = await AsyncStorage.getItem('notificationsEnabled');
      setNotificationsEnabled(notif === 'true');

      const name = await AsyncStorage.getItem('babyName');
      const weight = await AsyncStorage.getItem('babyWeight');
      const length = await AsyncStorage.getItem('babyLength');
      if (name) setBabyName(name);
      if (weight) setBabyWeight(weight);
      if (length) setBabyLength(length);

      const storedAvatar = await AsyncStorage.getItem('avatarUri');
      if (storedAvatar) {
        setAvatarUri(storedAvatar);
      }
    })();
  }, []);

  const handleNotificationsChange = async (value) => {
    setNotificationsEnabled(value);
    await AsyncStorage.setItem('notificationsEnabled', value.toString());
  };

  const handleSaveBabyInfo = async () => {
    await AsyncStorage.setItem('babyName', babyName);
    await AsyncStorage.setItem('babyWeight', babyWeight);
    await AsyncStorage.setItem('babyLength', babyLength);
    Alert.alert(t('success'), t('saved_success'));
  };

  const handleLogOff = async () => {
    logout();
    navigation.navigate('SignIn');
  };

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === 'dark' ? '#141414' : '#ffffff' }]}>
      <Text style={[styles.title, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>{t('settings')}</Text>

      {avatarUri ? (
        <Image source={{ uri: avatarUri }} style={styles.avatar} />
      ) : (
        <Text style={[styles.noAvatar, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>{t('noPhoto') || 'Sem Foto Capturada'}</Text>
      )}

      <View style={styles.row}>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>{t('notifications')}:</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={handleNotificationsChange}
        />
      </View>

      {/* Seletor de Idioma */}
      <View style={styles.rowLang}>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>{t('language')}:</Text>
        <TouchableOpacity onPress={() => changeLanguage('en')}>
          <Text style={[styles.langButton, language === 'en' && styles.selected]}>
            EN
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage('pt')}>
          <Text style={[styles.langButton, language === 'pt' && styles.selected]}>
            PT
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => changeLanguage('es')}>
          <Text style={[styles.langButton, language === 'es' && styles.selected]}>
            ES
          </Text>
        </TouchableOpacity>
      </View>

      {/* Seletor de Tema */}
      <View style={styles.rowLang}>
        <Text style={[styles.label, { color: colorScheme === 'dark' ? '#fff' : '#000' }]}>{t('theme')}:</Text>
        <TouchableOpacity onPress={() => setThemeMode('system')}>
          <Text style={[styles.langButton, theme === 'system' && styles.selected]}>Sistema</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setThemeMode('light')}>
          <Text style={[styles.langButton, theme === 'light' && styles.selected]}>Light</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setThemeMode('dark')}>
          <Text style={[styles.langButton, theme === 'dark' && styles.selected]}>Dark</Text>
        </TouchableOpacity>
      </View>

      {user && (
        <TouchableOpacity style={styles.button} onPress={handleLogOff}>
          <Text style={styles.buttonText}>{t('logout')}</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#333', marginTop: 10 }]}
        onPress={() => navigation.navigate('Home')}
      >
        <Text style={styles.buttonText}>{t('backHome') || 'Voltar para Home'}</Text>
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
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: 'center',
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 20,
  },
  noAvatar: {
    textAlign: 'center',
    marginBottom: 20,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rowLang: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  label: {
    marginRight: 10,
  },
  langButton: {
    color: '#999',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#999',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  selected: {
    color: '#E50914',
    borderColor: '#E50914',
  },
  input: {
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
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