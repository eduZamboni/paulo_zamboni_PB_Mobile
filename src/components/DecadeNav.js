import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function DecadeNav({ onDecadeChange, selectedDecade }) {
  const decades = [1950, 1960, 1970, 1980, 1990, 2000, 2010, 2020];

  return (
    <View style={styles.container}>
      {decades.map((decade) => (
        <TouchableOpacity
          key={decade}
          style={[
            styles.button,
            selectedDecade === decade && styles.activeButton
          ]}
          onPress={() => onDecadeChange(decade)}
        >
          <Text style={styles.buttonText}>{decade}s</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    marginBottom: 10,
    flexWrap: 'wrap',
  },
  button: {
    padding: 10,
    marginRight: 10,
    marginBottom: 10,
    backgroundColor: '#333',
    borderRadius: 5,
  },
  buttonText: {
    color: '#fff',
  },
  activeButton: {
    backgroundColor: '#E50914',
  },
});