import React, { useState, useEffect, useContext, useReducer } from 'react';
import { View, TextInput, Alert, RefreshControl, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { store } from '../../store/store';
import { icons, fonts } from '../../styles/index';
import SearchIcon from 'react-native-vector-icons/Ionicons';

export default function ClientsScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.search_area} >
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <SearchIcon name='search' size={18} color='#b0b0b0' />
        </View>
        <View style={{ width: '100%' }}>
          <TextInput style={styles.input_style} placeholder="Ex: João Carlos" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#337AB7',
  },

  search_area: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 20,
    height: 35,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input_style: {
    fontSize: fonts.medium,
    paddingTop: 2,
    paddingBottom: 1,
  },
});