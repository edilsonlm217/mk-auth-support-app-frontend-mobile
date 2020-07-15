import React, { useState, useEffect, useContext, useReducer } from 'react';
import { View, TextInput, Alert, Text, StyleSheet, TouchableOpacity, FlatList, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';

import { store } from '../../store/store';
import { icons, fonts } from '../../styles/index';

import SearchIcon from 'react-native-vector-icons/Ionicons';

export default function ClientsScreen() {
  const globalState = useContext(store);

  const [state, dispatch] = useReducer(reducer, {
    clients: null,
    loading: false,
    search_term: '',
  });

  function reducer(state, action) {
    switch (action.type) {
      case 'setSearchResult':
        return {
          ...state,
          loading: false,
          clients: action.payload.clients
        }

      case 'setSearchTerm':
        return {
          ...state,
          search_term: action.payload.search_term,
        }

      case 'loadingInit':
        return {
          ...state,
          loading: true,
        }

      default:
        break;
    }
  }

  function onChangeHandler(text) {
    search(text);

    dispatch({
      type: 'setSearchTerm',
      payload: {
        search_term: text,
      },
    });
  }

  async function search(term) {
    dispatch({
      type: 'loadingInit',
    });

    const response = await axios.get(
      `http://${globalState.state.server_ip}:${globalState.state.server_port}/search?term=${term}`
    );

    let clients = [];
    response.data.map(client => {
      clients.push(client.nome)
    });

    dispatch({
      type: 'setSearchResult',
      payload: {
        clients,
      },
    });

  }

  return (
    <View style={styles.container}>
      <View style={styles.search_area} >
        <View style={{ paddingLeft: 10, paddingRight: 10 }}>
          <SearchIcon name='search' size={18} color='#b0b0b0' />
        </View>
        <View style={{ width: '100%' }}>
          <TextInput onChangeText={text => onChangeHandler(text)} style={styles.input_style} placeholder="Ex: João Carlos" />
        </View>
      </View>
      {state.clients &&
        state.clients.map(name => (
          <Text>{name}</Text>
        ))

      }
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