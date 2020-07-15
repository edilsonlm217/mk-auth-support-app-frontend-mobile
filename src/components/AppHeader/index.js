import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { fonts } from '../../styles/index';

export default function AppHeader(props) {
  return (
    <View style={[styles.container, { height: props.altura }]}>
      <Text style={styles.header_title}>{props.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#337AB7',
    flexDirection: 'row',
    justifyContent: "space-between",
  },
  header_title: {
    fontSize: fonts.huge,
    fontWeight: 'bold',
    marginTop: 15,
    marginLeft: 20,
    color: '#FFF',
  },
});
