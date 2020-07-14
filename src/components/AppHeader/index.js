import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import { icons, fonts } from '../../styles/index';

export default function AppHeader(props) {
  function handleNavigateToSettings() {
    props.navigation.navigate('Settings');
  }

  function handleNavigateToSearch() {
    props.navigation.navigate('Search');
  }

  return (
    <View style={[styles.container, { height: props.altura }]}>
      <Text style={styles.header_title}>{props.label}</Text>

      {props.iconFor === 'settings'
        ?
        <TouchableOpacity onPress={handleNavigateToSettings}>
          <Icon style={styles.settings_icon} name="settings-outline" size={icons.tiny} color="#FFF" />
        </TouchableOpacity>
        :
        <TouchableOpacity onPress={handleNavigateToSearch}>
          <Icon style={styles.settings_icon} name="search" size={icons.tiny} color="#FFF" />
        </TouchableOpacity>
      }
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

  settings_icon: {
    marginTop: 20,
    marginRight: 20,
  },
});
