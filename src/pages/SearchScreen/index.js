import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fonts } from '../../styles/index';

export default function SearchScreen() {
  return (
    <>
      <View style={[styles.container, { height: '21%' }]}>
        <View style={styles.header_container}>
          <Text numberOfLines={1} style={styles.header_title}>
            Buscar clientes
          </Text>
        </View>
        <Text>Search Screen</Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#337AB7',
  },

  header_title: {
    fontSize: fonts.huge,
    fontWeight: 'bold',
    color: '#FFF',
  },

  header_container: {
    marginTop: 15,
    marginLeft: 15,
    justifyContent: "center",
    height: '30%',
  },
});
