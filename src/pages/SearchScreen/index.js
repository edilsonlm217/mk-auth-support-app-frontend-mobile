import React, { useState, useContext, useRef } from 'react';
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
  ActivityIndicator,
} from 'react-native';
import api from '../../services/api';
import Modal from 'react-native-modal';

import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';

import search_illustration from '../../assets/search.png'
import no_search_illustration from '../../assets/no-search-result.png';

export default function SearchScreen({ navigation }) {
  const globalStore = useContext(store);
  const { userToken } = globalStore.state;

  const [searchTerm, setSearchTerm] = useState('');

  const [preFilter, setPreFilter] = useState({
    filterOP: 'Clientes ativados',
    filterBY: 'Nome ou CPF',
  });

  const [filterOP, setFilterOP] = useState([
    { id: 1, label: 'Clientes ativados', isActive: true },
    { id: 2, label: 'Clientes desativados', isActive: false },
  ]);

  const [filterBY, setFilterBY] = useState([
    { id: 1, label: 'Nome ou CPF', isActive: true },
    { id: 2, label: 'Caixa Hermética', isActive: false },
    // { id: 3, label: 'Endereço', isActive: false },
    // { id: 4, label: 'Vencimento', isActive: false },
    { id: 5, label: 'SSID', isActive: false },
  ]);

  const [searchResult, setSearchResult] = useState([]);

  const [isVisible, setIsVisible] = useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const [noContent, setNoContent] = useState(false);

  const refInput = useRef(null);

  async function searchFor(term) {
    setIsLoading(true);

    var filterByID;
    var filterMode = 'enable';


    filterOP.map(item => {
      if (item.isActive && item.id !== 1) {
        filterMode = 'disable';
      }
    });

    filterBY.map(item => {
      if (item.isActive) {
        filterByID = item.id;
      }
    });

    try {
      const response = await api.get(`search?term=${term}&searchmode=${filterMode}&filterBy=${filterByID}&tenant_id=${globalStore.state.tenantID}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.data) {
        response.data.map(item => {
          item.nome = capitalize(item.nome);
        });

        setSearchResult(response.data);
        setNoContent(false);
        setIsLoading(false);
      }

      if (response.data.length === 0) {
        setNoContent(true);
      }
    } catch (error) {
      console.warn('Erro na chamada a API. Está impresso no console!');
      console.log(error);
      setIsLoading(false);

      // se error for timeout, é um tratamento.
      // se for 204, é outro tratamento

    }


  }

  function capitalize(string) {
    return string.toLowerCase().split(' ').map(s => s.charAt(0).toUpperCase() + s.substring(1)).join(' ');
  }

  const headerHeight = Dimensions.get('window').height * 23 / 100;

  const renderItem = ({ item }) => {
    return (
      <TouchableOpacity
        onPress={() => navigateToClient(item.id, item.nome)}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          padding: 12
        }}>
        <Text numberOfLines={1} style={{ flex: 1 }}>{item.nome}</Text>
        <View style={styles.search_result_row}>
          <MaterialIcon
            name='checkbox-blank-circle'
            color={item.equipment_array === 'Online' ? 'green' : 'red'}
            size={12}
          />
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
        <TouchableOpacity
          onPress={() => setIsVisible(true)}
          style={[styles.search_btn, { backgroundColor: bg_color }]}
        >
          <Icon name={icon_name} color={icon_color} size={22} />
        </TouchableOpacity>
      );
    }
  };

  function navigateToClient(client_id, client_name) {
    navigation.navigate('ClientScreen', {
      client_id,
      client_name,
    });
  }

  function handleModalClosing() {
    var prev_filterOP;
    var prev_filterBY;

    filterOP.map(item => {
      if (item.isActive) {
        prev_filterOP = item.label;
      }
    });

    filterBY.map(item => {
      if (item.isActive) {
        prev_filterBY = item.label;
      }
    });

    setPreFilter({
      filterOP: prev_filterOP,
      filterBY: prev_filterBY,
    });

    setIsVisible(false);
  }

  function applyFilter() {
    filterOP.map(item => {
      if (item.label === preFilter.filterOP) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    filterBY.map(item => {
      if (item.label === preFilter.filterBY) {
        item.isActive = true;
      } else {
        item.isActive = false;
      }
    });

    setIsVisible(false);
  }

  function setDefaultFilerOP() {
    const new_filterOP = [];

    filterOP.map(item => {
      if (item.id === 1) {
        item.isActive = true;

        setPreFilter({
          filterOP: item.label,
          filterBY: preFilter.filterBY,
        });
      } else {
        item.isActive = false;
      }

      new_filterOP.push(item);
    });

    setFilterOP(new_filterOP);
  }

  function setDefaultFilerBY() {
    const new_filterBY = [];

    filterBY.map(item => {
      if (item.id === 1) {
        item.isActive = true;

        setPreFilter({
          filterBY: item.label,
          filterOP: preFilter.filterOP,
        });
      } else {
        item.isActive = false;
      }

      new_filterBY.push(item);
    });

    setFilterBY(new_filterBY);
  }

  function handleClearInputText() {
    refInput.current.clear();

    setSearchTerm('');
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
              ref={refInput}
              style={styles.search_input}
              placeholder="O que deseja buscar?"
              onChangeText={text => setSearchTerm(text)}
              returnKeyType="search"
              onSubmitEditing={() => searchFor(searchTerm)}
            />
            {searchTerm !== '' &&
              <TouchableOpacity
                style={{
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 10
                }}
                onPress={() => handleClearInputText()}
              >
                <Icon name="close" size={18} color="#004C8F" />
              </TouchableOpacity>
            }
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
            {filterOP.map((item, index) => {
              if (item.isActive && item.label !== "Clientes ativados") {
                return (
                  <View key={index} style={styles.filter_card} >
                    <Text style={[styles.illustration_subtitle, { marginRight: 5 }]}>
                      {item.label}
                    </Text>
                    <TouchableOpacity onPress={() => setDefaultFilerOP()}>
                      <Icon name="close" size={16} color="#004C8F" />
                    </TouchableOpacity>
                  </View>
                );
              }
            })}

            {filterBY.map((item, index) => {
              if (item.isActive && item.label !== "Nome ou CPF") {
                return (
                  <View key={index} style={styles.filter_card}>
                    <Text style={[styles.illustration_subtitle, { marginRight: 5 }]}>
                      {item.label}
                    </Text>
                    <TouchableOpacity onPress={() => setDefaultFilerBY()}>
                      <Icon name="close" size={16} color="#004C8F" />
                    </TouchableOpacity>
                  </View>
                );
              }
            })}

          </ScrollView>
        </View>

      </View>

      {
        isLoading
          ? <ActivityIndicator
            style={{ marginTop: 30 }}
            size="large" color="#004C8F" />
          : <>
            {noContent
              ? <>
                <View style={styles.illustration_container}>
                  <Image source={no_search_illustration} />
                  <Text
                    style={styles.illustration_subtitle}
                  >Nenhum resultado encontrado</Text>
                </View>
              </>
              : <>
                {
                  searchResult.length !== 0 &&
                  <View>
                    <FlatList
                      keyboardShouldPersistTaps={true}
                      style={styles.scrollview_container}
                      ItemSeparatorComponent={renderSeparator}
                      data={searchResult}
                      renderItem={renderItem}
                      keyExtractor={(item, index) => `list-item-${index}`}
                    />
                  </View>
                }
              </>
            }
          </>
      }

      {
        searchResult.length === 0 && noContent === false &&
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
            <TouchableOpacity
              onPress={() => handleModalClosing()}
              style={{ alignItems: 'flex-end' }}
            >
              <Icon name="close" size={22} color="#000" />
            </TouchableOpacity>

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
                <TouchableOpacity
                  onPress={() => setPreFilter({
                    filterOP: item.label,
                    filterBY: preFilter.filterBY
                  })}
                  style={styles.filter_row}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[
                      styles.filter_pipeline,
                      {
                        backgroundColor: preFilter.filterOP === item.label
                          ? '#337AB7'
                          : '#FFF'
                      }
                    ]} />
                    <Text style={styles.filter_label}>{item.label}</Text>
                  </View>
                  <View style={{ alignSelf: 'flex-end' }}>
                    <Icon
                      name="check"
                      color={preFilter.filterOP === item.label
                        ? '#337AB7'
                        : '#FFF'
                      }
                      size={22}
                    />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.label}
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
                <TouchableOpacity onPress={() => setPreFilter({
                  filterBY: item.label,
                  filterOP: preFilter.filterOP
                })} style={styles.filter_row}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={[
                      styles.filter_pipeline,
                      {
                        backgroundColor: preFilter.filterBY === item.label
                          ? '#337AB7'
                          : '#FFF'
                      }
                    ]} />
                    <Text style={styles.filter_label}>{item.label}</Text>
                  </View>
                  <View style={{ alignSelf: 'flex-end' }}>
                    <Icon
                      name="check"
                      color={preFilter.filterBY === item.label
                        ? '#337AB7'
                        : '#FFF'
                      }
                      size={22} />
                  </View>
                </TouchableOpacity>
              )}
              keyExtractor={item => item.label}
            />

            <TouchableOpacity
              onPress={() => applyFilter()}
              style={styles.apply_btn}
            >
              <Text style={styles.apply_label}>Aplicar filtros</Text>
            </TouchableOpacity>

          </View>
        }
        isVisible={isVisible}
        style={{ margin: 0 }}
        animationInTiming={500}
        animationOutTiming={500}
        useNativeDriver={true}
      />

    </View >
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
    marginTop: 30,
    backgroundColor: '#F7F7F7',
    marginLeft: 10,
    marginRight: 10,
    borderColor: '#707070',
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 5,
  },

  search_result_row: {
    flexDirection: 'row',
    width: '12%',
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

  filter_label: {
    fontFamily: 'Roboto-Light',
    marginLeft: 40
  },

  filter_pipeline: {
    width: 5,
    height: '100%'
  },

  filter_row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    height: 35
  },

  apply_btn: {
    marginTop: 20,
    marginBottom: 10,
    borderWidth: 2,
    borderRadius: 5,
    borderColor: '#337AB7',
    alignItems: 'center'
  },

  apply_label: {
    fontFamily: 'Roboto-Medium',
    color: "#337AB7",
    padding: 7
  },
});
