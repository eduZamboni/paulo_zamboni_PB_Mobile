import React, { useEffect, useState } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../config';
import MovieCard from './MovieCard.js';

export default function Ranking({ decade, genre, query }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      const startYear = decade;
      const endYear = decade + 9;
      try {
        let url = `${BASE_URL}/discover/movie`;
        const params = {
          api_key: API_KEY,
          language: 'pt-BR',
          sort_by: 'vote_average.desc',
          'vote_count.gte': 1000,
          'primary_release_date.gte': `${startYear}-01-01`,
          'primary_release_date.lte': `${endYear}-12-31`,
          page: 1,
        };

        if (genre) {
          params.with_genres = genre;
        }

        if (query) {
          url = `${BASE_URL}/search/movie`;
          params.query = query;
        }

        const response = await axios.get(url, { params });
        setMovies(response.data.results.slice(0, 10));
      } catch (error) {
        console.error('Erro ao buscar filmes:', error);
      }
    };

    fetchMovies();
  }, [decade, genre, query]);

  return (
    <View style={styles.container}>
      <FlatList
        data={movies}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        renderItem={({ item }) => <MovieCard movie={item} />}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
});