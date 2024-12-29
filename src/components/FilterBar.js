import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import { API_KEY, BASE_URL } from '../config';

export default function FilterBar({ onGenreChange }) {
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState('');

  useEffect(() => {
    const fetchGenres = async () => {
      try {
        const response = await axios.get(`${BASE_URL}/genre/movie/list`, {
          params: { api_key: API_KEY, language: 'pt-BR' },
        });
        setGenres(response.data.genres);
      } catch (error) {
        console.error('Erro ao buscar gêneros:', error);
      }
    };
    fetchGenres();
  }, []);

  const handleValueChange = (value) => {
    setSelectedGenre(value);
    onGenreChange(value);
  };

  return (
    <View style={styles.container}>
      <Picker
        selectedValue={selectedGenre}
        onValueChange={handleValueChange}
        style={styles.picker}
      >
        <Picker.Item label="Todos os Gêneros" value="" />
        {genres.map((g) => (
          <Picker.Item key={g.id} label={g.name} value={String(g.id)} /> 
        ))}
      </Picker>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  picker: {
    color: '#fff',
  },
});