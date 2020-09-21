import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
} from 'react-native';
import axios from 'axios';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';

import search_illustration from '../../assets/search.png'

export default function SearchScreen() {
  const globalStore = useContext(store);
  const { server_ip, server_port, userToken } = globalStore.state

  const [searchTerm, setSearchTerm] = useState('');

  const [filterMode, setFilterMode] = useState('enable');

  const [searchResult, setSearchResult] = useState([]);

  async function searchFor(term) {
    const response = await axios.get(
      `http://${server_ip}:${server_port}/search?term=${term}&searchmode=${filterMode}`,
      {
        timeout: 2500,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      }
    );

    if (response.data) {
      response.data.map(item => {
        item.nome = capitalize(item.nome);
      });

      console.log(response.data);
      setSearchResult(response.data);
    }
  }

  function capitalize(string) {
    return string.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
  }

  const data = [
    {
      id: 'bd7acbea-c1b1-46c2-aed5-3ad53abb28ba',
      name: 'Edilson Rocha Lima',
      status: 'online',
    },
    {
      id: '3ac68afc-c605-48d3-a4f8-fbd91aa97f63',
      name: 'Moany Rocha Lima',
      status: 'online',
    },
    {
      id: '58694a0f-3da1-471f-bd96-145571e29d72',
      name: 'Dona Joana da Silva',
      status: 'online',
    },
  ];

  const headerHeight = Dimensions.get('window').height * 23 / 100;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 12 }}>
        <Text numberOfLines={1} style={{ flex: 1 }}>{item.nome}</Text>
        <View style={styles.search_result_row}>
          <MaterialIcon name='checkbox-blank-circle' color="green" size={12} />
          <MaterialIcon name='chevron-right' color="#000000" size={20} />
        </View>
      </TouchableOpacity>
    );
  };

  const renderSeparator = () => {
    return (
      <View
        style={{ borderWidth: StyleSheet.hairlineWidth, borderColor: '#CBCBCB' }}
      />
    );
  };

  const SearchBtn = ({ btn_for, icon_color, bg_color, icon_name }) => {
    if (btn_for === 'search') {
      return (
        <TouchableOpacity
          onPress={() => searchFor(searchTerm)}
          style={[styles.search_btn, { backgroundColor: bg_color }]}
        >
          <Icon name={icon_name} color={icon_color} size={22} />
        </TouchableOpacity>
      );
    };

    if (btn_for === 'search_tunning') {
      return (
        <TouchableOpacity style={[styles.search_btn, { backgroundColor: bg_color }]}>
          <Icon name={icon_name} color={icon_color} size={22} />
        </TouchableOpacity>
      );
    }
  };

  return (
    <View style={{ backgroundColor: '#FFFFFF', flex: 1 }}>
      <View style={[styles.container, { height: headerHeight }]}>
        <View style={styles.header_container}>
          <Text numberOfLines={1} style={styles.header_title}>
            Buscar clientes
          </Text>
        </View>

        <View style={styles.search_container}>
          <View style={styles.search_bar}>
            <TextInput
              placeholder="O que deseja buscar?"
              onChangeText={text => setSearchTerm(text)}
              style={styles.search_input}
            />
            <TouchableOpacity>
              <SearchBtn
                btn_for="search"
                icon_color="#F9F9F9"
                bg_color='#004C8F'
                icon_name="search"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ marginLeft: 5, marginRight: 5 }}>
            <SearchBtn
              btn_for="search_tunning"
              icon_color="#004C8F"
              bg_color='#F7F7F7'
              icon_name="tune"
            />
          </TouchableOpacity>
        </View>
      </View>

      {searchResult.length !== 0 &&
        <View>
          <FlatList
            style={styles.scrollview_container}
            ItemSeparatorComponent={renderSeparator}
            data={searchResult}
            renderItem={renderItem}
            keyExtractor={item => item.id}
          />
        </View>
      }

      {searchResult.length === 0 &&
        <View style={styles.illustration_container}>
          <Image source={search_illustration} />
          <Text
            style={styles.illustration_subtitle}
          >Informe o nome ou CPF do cliente para começar</Text>
        </View>
      }

    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#337AB7',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
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

  search_btn: {
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 5,
    height: 40,
    width: 40
  },

  search_bar: {
    flex: 1,
    backgroundColor: '#F7F7F7',
    borderRadius: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  search_container: {
    flexDirection: 'row',
    marginLeft: 5,
    marginTop: 30
  },

  search_input: {
    flex: 1,
    padding: 0,
    paddingLeft: 10,
  },

  illustration_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  illustration_subtitle: {
    fontFamily: 'Roboto-Light',
    color: '#004C8F',
    textAlign: 'center',
  },

  scrollview_container: {
    marginTop: 50,
    backgroundColor: '#F7F7F7',
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#707070',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
    marginBottom: 190,
  },

  search_result_row: {
    flexDirection: 'row',
    width: '20%',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
});
