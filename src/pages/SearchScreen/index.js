import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';

import Icon from 'react-native-vector-icons/MaterialIcons';

import { fonts } from '../../styles/index';

import search_illustration from '../../assets/search.png'

export default function SearchScreen() {
  const headerHeight = Dimensions.get('window').height * 23 / 100;

  const SearchBtn = ({ icon_color, bg_color, icon_name }) => {
    return (
      <View style={[styles.search_btn, { backgroundColor: bg_color }]}>
        <Icon name={icon_name} color={icon_color} size={22} />
      </View>
    );
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
              style={styles.search_input}
            />
            <TouchableOpacity>
              <SearchBtn
                icon_color="#F9F9F9"
                bg_color='#004C8F'
                icon_name="search"
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={{ marginLeft: 5, marginRight: 5 }}>
            <SearchBtn
              icon_color="#004C8F"
              bg_color='#F7F7F7'
              icon_name="tune"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.illustration_container}>
        <Image source={search_illustration} />
        <Text
          style={styles.illustration_subtitle}
        >Informe o nome ou CPF do cliente para começar</Text>
      </View>
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
    color: '#004C8F'
  },
});
