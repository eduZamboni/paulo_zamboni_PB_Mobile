import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Pressable } from 'react-native';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../config';
import DecadeNav from '../components/DecadeNav';
import Ranking from '../components/Ranking';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../contexts/ThemeContext';

export default function Home() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const navigation = useNavigation();
  const { colorScheme } = useThemeContext();

  const backgroundColor = colorScheme === 'dark' ? '#141414' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';

  const [selectedDecadeLeft, setSelectedDecadeLeft] = useState(2020);
  const [selectedDecadeRight, setSelectedDecadeRight] = useState(2010);

  const [selectedGenre, setSelectedGenre] = useState('');
  const [selectedGenreName, setSelectedGenreName] = useState(t('todosGeneros'));
  const [genres, setGenres] = useState([]);
  const [genreVisible, setGenreVisible] = useState(false);

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: {
            api_key: API_KEY,
            language: 'pt-BR'
          }
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleSelectGenre = (id, name) => {
    setGenreVisible(false);
    if (id === '') {
      setSelectedGenre('');
      setSelectedGenreName(t('todosGeneros'));
    } else {
      setSelectedGenre(id);
      setSelectedGenreName(name);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.title, { color: textColor }]}>{t('compareDecades')}</Text>

      {user ? (
        <>
          {/* Profile */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Profile')}
          >
            <Text style={styles.buttonText}>{t('profile')}</Text>
          </TouchableOpacity>

          {/* Configurações */}
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Settings')}
          >
            <Text style={styles.buttonText}>{t('settings')}</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SignIn')}
          >
            <Text style={styles.buttonText}>{t('logIn')}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('SignUp')}
          >
            <Text style={styles.buttonText}>{t('createAccount')}</Text>
          </TouchableOpacity>
        </>
      )}

      {/* Dropdown */}
      <View style={styles.row}>
        <Pressable
          onPress={() => setGenreVisible(!genreVisible)}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            {selectedGenreName} ▼
          </Text>
        </Pressable>
        {genreVisible && (
          <View style={styles.dropdown}>
            <Pressable
              onPress={() => handleSelectGenre('', t('todosGeneros'))}
              style={styles.dropdownItem}
            >
              <Text style={styles.dropdownItemText}>{t('todosGeneros')}</Text>
            </Pressable>
            {genres.map((g) => (
              <Pressable
                key={g.id}
                onPress={() => handleSelectGenre(g.id, g.name)}
                style={styles.dropdownItem}
              >
                <Text style={styles.dropdownItemText}>{g.name}</Text>
              </Pressable>
            ))}
          </View>
        )}
      </View>

      {/* Bloco 1 */}
      <View style={styles.block}>
        <DecadeNav
          onDecadeChange={setSelectedDecadeLeft}
          selectedDecade={selectedDecadeLeft}
        />
        <Text style={[styles.subtitle, { color: textColor }]}>
          Top 10 Filmes da Década de {selectedDecadeLeft}
        </Text>
        <Ranking
          decade={selectedDecadeLeft}
          genre={selectedGenre}
        />
      </View>

      {/* Bloco 2 */}
      <View style={styles.block}>
        <DecadeNav
          onDecadeChange={setSelectedDecadeRight}
          selectedDecade={selectedDecadeRight}
        />
        <Text style={[styles.subtitle, { color: textColor }]}>
          Top 10 Filmes da Década de {selectedDecadeRight}
        </Text>
        <Ranking
          decade={selectedDecadeRight}
          genre={selectedGenre}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 22,
    marginBottom: 20,
  },
  row: {
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#E50914',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  dropdown: {
    backgroundColor: '#333',
    marginTop: 5,
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
  },
  dropdownItemText: {
    color: '#fff',
  },
  block: {
    marginBottom: 30,
  },
  subtitle: {
    fontSize: 16,
    marginVertical: 10,
  },
});