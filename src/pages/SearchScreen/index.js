import React, { useRef, useContext, useReducer, useEffect, useState } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';

import { searchUtil } from '../../utils/search';
import { store } from '../../store/store';
import { fonts, icons } from '../../styles/index';

import SearchIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ClientsScreen({ navigation }) {
  const globalState = useContext(store);

  const refInput = useRef(null);

  // Hook para verificar se a tela atual está focada
  const isFocused = useIsFocused(false);

  const [state, dispatch] = useReducer(reducer, {
    clients: [],
    loading: false,
    search_term: '',
  });

  function reducer(state, action) {
    switch (action.type) {
      case 'clearState':
        return {
          ...state,
          clients: [],
          search_term: '',
        }

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

  const [filterMode, setFilterMode] = useState('enable');

  useEffect(() => {
    if (isFocused) {
      refInput.current.focus();
    }
  }, [isFocused]);

  function onChangeHandler(text) {
    search(text);

    dispatch({
      type: 'setSearchTerm',
      payload: {
        search_term: text,
      },
    });
  }

  useEffect(() => {
    search(state.search_term);
  }, [filterMode]);

  async function search(term) {
    dispatch({
      type: 'loadingInit',
    });

    const response = await searchUtil(
      `http://${globalState.state.server_ip}:${globalState.state.server_port}/search?term=${term}&searchmode=${filterMode}`,
      {
        timeout: 2500,
        headers: {
          Authorization: `Bearer ${globalState.state.userToken}`,
        },
      }
    );

    if (response) {
      response.map(item => {
        item.nome = capitalize(item.nome);
      });

      dispatch({
        type: 'setSearchResult',
        payload: {
          clients: response,
        },
      });
    }
  }

  function capitalize(input) {
    return input.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
  }

  function navigateToClient(client_id, client_name) {
    navigation.navigate('ClientScreen', {
      client_id,
      client_name,
    });
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => navigateToClient(item.id, item.nome)} style={styles.client_btn}>
        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text numberOfLines={1} style={styles.search_result_label}>{item.nome}</Text>
        </View>
        <Icon name={'chevron-right'} size={icons.super_tiny} color={'#000'} />
      </TouchableOpacity>
    );
  }

  function FlatListItemSeparator() {
    return (
      <View
        style={styles.separator}
      />
    );
  }

  function handleClearInputText() {
    refInput.current.clear();

    dispatch({
      type: 'clearState'
    });
  }

  function switchFilter(filterValue) {
    setFilterMode(filterValue);
  }

  return (
    <View style={styles.container}>
      <View style={styles.search_area} >
        <View style={styles.icon_container}>
          <SearchIcon name='search' size={18} color='#b0b0b0' />
        </View>
        <View style={{ flex: 1 }}>
          <TextInput
            ref={refInput}
            onChangeText={text => onChangeHandler(text)}
            style={styles.input_style}
            placeholder="Ex: João Carlos"
          />
        </View>
        <TouchableOpacity
          style={styles.icon_container}
          onPress={() => handleClearInputText()}
        >
          <Icon name="close" size={18} color={'#b0b0b0'} />
        </TouchableOpacity>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          alignSelf: 'center',
          backgroundColor: '#FFF',
          borderRadius: 3,
          padding: 2,
        }}
      >
        <TouchableOpacity
          onPress={() => switchFilter('enable')}
          style={filterMode === 'enable' && {
            borderColor: 'blue',
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 3,
            color: '#b0b0b0',
            alignItems: 'center',
          }}
        >
          <Text
            style={filterMode === 'enable'
              ? {
                padding: 3,
                paddingLeft: 10,
                paddingRight: 10,
                color: '#000',
              }
              : {
                padding: 3,
                paddingLeft: 10,
                paddingRight: 10,
                color: '#b0b0b0',
              }
            }
          >
            Ativados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => switchFilter('disable')}
          style={filterMode === 'disable' && {
            borderColor: 'blue',
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 3,
            color: '#b0b0b0'
          }}
        >
          <Text
            style={filterMode === 'disable'
              ? {
                padding: 3,
                paddingLeft: 10,
                paddingRight: 10,
                color: '#000',
              }
              : {
                padding: 3,
                paddingLeft: 10,
                paddingRight: 10,
                color: '#b0b0b0',
              }
            }
          >
            Desativados
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => switchFilter('all')}
          style={filterMode === 'all' && {
            borderColor: 'blue',
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 3,
            color: '#b0b0b0'
          }}
        >
          <Text
            style={filterMode === 'all'
              ? {
                padding: 3,
                paddingLeft: 10,
                paddingRight: 10,
                color: '#000',
              }
              : {
                padding: 3,
                paddingLeft: 10,
                paddingRight: 10,
                color: '#b0b0b0',
              }
            }
          >
            Todos
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.flatlist_container}>
        <FlatList
          keyboardShouldPersistTaps="always"
          data={state.clients}
          renderItem={renderItem}
          keyExtractor={item => item.id.toString()}
          ItemSeparatorComponent={FlatListItemSeparator}
          refreshControl={
            <RefreshControl refreshing={state.loading} />
          }
        />
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
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
  },

  input_style: {
    fontSize: fonts.medium,
    paddingTop: 1,
    paddingBottom: 1,
    width: '100%',
  },

  icon_container: {
    paddingLeft: 10,
    paddingRight: 10
  },

  client_btn: {
    backgroundColor: '#FFF',
    padding: 9,
    margin: 1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  separator: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
    backgroundColor: "#000",
  },

  flatlist_container: {
    backgroundColor: '#FFF',
    margin: 20,
    borderRadius: 6
  },

  search_result_label: {
    fontSize: fonts.medium,
    width: '90%',
  },
});