import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { fonts } from '../../styles/index';

export default function AppHeader(props) {
  return (
    <View style={[styles.container, { height: props.altura }]}>
      <View style={styles.header_container}>
        {props.backButton === true &&
          <View style={{ width: '10%' }}>
            <TouchableOpacity onPress={() => props.navigation.goBack()} style={{ marginRight: 0 }}>
              <Icon name="arrow-left" size={24} color="#FFF" />
            </TouchableOpacity>
          </View>
        }
        <View style={{ width: '90%' }}>
          <Text numberOfLines={1} style={styles.header_title}>{props.label}</Text>
        </View>
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
    flex: 1,
  },
});
