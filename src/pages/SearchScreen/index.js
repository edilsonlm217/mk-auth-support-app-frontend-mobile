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
  ScrollView,
} from 'react-native';
import axios from 'axios';
import Modal from 'react-native-modal';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';

import search_illustration from '../../assets/search.png'

export default function SearchScreen() {
  const globalStore = useContext(store);
  const { server_ip, server_port, userToken } = globalStore.state;

  const [searchTerm, setSearchTerm] = useState('');

  const [filterMode, setFilterMode] = useState('enable');

  const [filterOP] = useState([
    { id: 1, label: 'Clientes ativados' },
    { id: 2, label: 'Clientes desativados' },
  ]);

  const [filterBY] = useState([
    { id: 1, label: 'Nome ou CPF' },
    { id: 2, label: 'Caixa Hermética' },
    { id: 3, label: 'Endereço' },
    { id: 4, label: 'Vencimento' },
    { id: 5, label: 'SSID' },
  ]);


  const [searchResult, setSearchResult] = useState([]);

  const [isVisible, setIsVisible] = useState(false);

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
        <TouchableOpacity onPress={() => setIsVisible(true)} style={[styles.search_btn, { backgroundColor: bg_color }]}>
          <Icon name={icon_name} color={icon_color} size={22} />
        </TouchableOpacity>
      );
    }
  };

  function handleModalClosing() {
    setIsVisible(false);
  }

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

        <View style={styles.filter_container}>
          <ScrollView
            style={styles.flex_filter_container}
            horizontal={true}
            centerContent={true}
            contentContainerStyle={{ minWidth: '100%', justifyContent: 'center' }}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.filter_card}>
              <Text style={[styles.illustration_subtitle, { marginRight: 5 }]}>
                Apenas clientes desativados
              </Text>
              <Icon name="close" size={16} color="#004C8F" />
            </View>
            <View style={styles.filter_card}>
              <Text style={[styles.illustration_subtitle, { marginRight: 5 }]}>
                Caixa Hermética
              </Text>
              <Icon name="close" size={16} color="#004C8F" />
            </View>
          </ScrollView>
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

      <Modal
        onBackButtonPress={handleModalClosing}
        onBackdropPress={handleModalClosing}
        children={
          <View style={styles.modal_style}>
            <View style={{ alignItems: 'flex-end' }}>
              <Icon name="close" size={18} color="#000" />
            </View>

            <Text style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 16,
              marginBottom: 20,
            }}>Buscar em</Text>

            <FlatList
              style={{ marginBottom: 20 }}
              ItemSeparatorComponent={renderSeparator}
              data={filterOP}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 35 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#337AB7', width: 5, height: '100%' }} />
                    <Text style={{ fontFamily: 'Roboto-Light', marginLeft: 40 }}>{item.label}</Text>
                  </View>
                  <View style={{ alignSelf: 'flex-end' }}>
                    <Icon name="check" color="#337AB7" size={22} />
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
            />

            <Text style={{
              fontFamily: 'Roboto-Medium',
              fontSize: 16,
              marginBottom: 10,
            }}>Buscar por</Text>

            <FlatList
              ItemSeparatorComponent={renderSeparator}
              data={filterBY}
              renderItem={({ item }) => (
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', height: 35 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#337AB7', width: 5, height: '100%' }} />
                    <Text style={{ fontFamily: 'Roboto-Light', marginLeft: 40 }}>{item.label}</Text>
                  </View>
                  <View style={{ alignSelf: 'flex-end' }}>
                    <Icon name="check" color="#337AB7" size={22} />
                  </View>
                </View>
              )}
              keyExtractor={item => item.id}
            />

            <View style={{ marginTop: 20, marginBottom: 10, borderWidth: 2, borderRadius: 5, borderColor: '#337AB7', alignItems: 'center' }}>
              <Text style={{ fontFamily: 'Roboto-Medium', color: "#337AB7", padding: 7 }}>Aplicar filtros</Text>
            </View>

          </View>
        }
        isVisible={isVisible}
        style={{ margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
      />

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
    marginTop: 15,
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

  filter_container: {
    position: 'absolute',
    bottom: -15,
    width: '100%',
    height: 30,
  },

  filter_card: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',

    paddingLeft: 5,
    paddingRight: 5,
    marginLeft: 10,
    marginRight: 10,

    backgroundColor: '#FFF',
    borderRadius: 3,
    height: 28,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 5,
  },

  flex_filter_container: {
    width: '100%',
  },

  modal_style: {
    position: "absolute",
    width: '100%',
    backgroundColor: "#FFF",
    bottom: 0,
    padding: 20,
    paddingTop: 10,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
