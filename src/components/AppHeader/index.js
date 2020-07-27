import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fonts } from '../../styles/index';

export default function AppHeader(props) {
  return (
    <View style={[styles.container, { height: props.altura }]}>
      <View style={styles.header_container}>
        {props.backButton === true &&
          <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 10 }}>
            <Icon name="arrow-left" size={24} color="#FFF" />
          </TouchableOpacity>
        }
        <Text style={styles.header_title}>{props.label}</Text>
      </View>
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
    color: '#FFF',
  },

  header_container: {
    flexDirection: "row",
    marginTop: 15,
    marginLeft: 15,
    alignItems: "center",
    height: '30%',
    width: '100%',
  },
});
