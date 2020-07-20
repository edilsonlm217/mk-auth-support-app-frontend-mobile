import React, { useRef, useContext, useReducer } from 'react';
import {
  View,
  TextInput,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  RefreshControl
} from 'react-native';

import { searchUtil } from '../../utils/search';
import { store } from '../../store/store';
import { fonts, icons } from '../../styles/index';

import SearchIcon from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function ClientsScreen({ navigation }) {
  const globalState = useContext(store);

  const refInput = useRef(null);

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

    const response = await searchUtil(
      `http://${globalState.state.server_ip}:${globalState.state.server_port}/search?term=${term}`,
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

  function navigateToClient(client_id) {
    navigation.navigate('ClientDetails', {
      client_id,
    });
  }

  function renderItem({ item }) {
    return (
      <TouchableOpacity onPress={() => navigateToClient(item.id)} style={styles.client_btn}>
        <Text style={styles.search_result_label}>{item.nome}</Text>
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

      <View style={styles.flatlist_container}>
        <FlatList
          keyboardShouldPersistTaps={true}
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
    padding: 5,
    margin: 5,
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
  },
});