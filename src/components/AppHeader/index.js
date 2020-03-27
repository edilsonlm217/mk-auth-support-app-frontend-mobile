import React from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default function AppHeader(props) {
  return (
    <View style={styles.container}>
      <Text style={styles.header_title}>Chamados</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#337AB7',
    height: '15%',
  },
  header_title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 15,
    marginLeft: 20,
    color: '#FFF',
  },
});
