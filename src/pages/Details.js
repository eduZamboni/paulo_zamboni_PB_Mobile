import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../config';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../contexts/ThemeContext';

export default function Details() {
  const { t } = useTranslation();
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params;
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  const { colorScheme } = useThemeContext();
  const backgroundColor = colorScheme === 'dark' ? '#141414' : '#fff';
  const textColor = colorScheme === 'dark' ? '#fff' : '#000';

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/movie/${id}`, {
          params: {
            api_key: API_KEY,
            language: 'pt-BR',
          },
        });
        setMovie(response.data);
      } catch (error) {
        console.error('Erro ao buscar detalhes do filme:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <View style={[styles.container, { backgroundColor, justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#E50914" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={[styles.container, { backgroundColor }]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          {t('noMovieLoaded') || 'Não foi possível carregar o filme.'}
        </Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Image
        source={{ uri: `https://image.tmdb.org/t/p/w300${movie.poster_path}` }}
        style={styles.poster}
      />
      <Text style={[styles.title, { color: textColor }]}>{movie.title}</Text>
      <Text style={[styles.overview, { color: textColor }]}>{movie.overview}</Text>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backButtonText}>{t('back') || 'Voltar'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  errorText: {
    flex: 1,
    textAlign: 'center',
    marginTop: 50,
  },
  poster: {
    width: 200,
    height: 300,
    marginBottom: 20,
    resizeMode: 'cover',
    borderRadius: 5,
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  overview: {
    textAlign: 'justify',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
    backgroundColor: '#E50914',
    borderRadius: 5,
  },
  backButtonText: {
    color: '#fff',
  },
});