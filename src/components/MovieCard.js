import React from 'react';
import { View, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function MovieCard({ movie }) {
  const navigation = useNavigation();
  const { id, poster_path, title } = movie;

  const handlePress = () => {
    navigation.navigate('Details', { id });
  };

  return (
    <TouchableOpacity onPress={handlePress}>
      <View style={styles.card}>
        <Image
          source={{ uri: `https://image.tmdb.org/t/p/w200${poster_path}` }}
          style={styles.poster}
        />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 120,
    marginRight: 10,
  },
  poster: {
    width: 120,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 5,
  },
});