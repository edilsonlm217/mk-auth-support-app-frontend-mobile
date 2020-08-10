import React, { useState, useContext } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';

import AppHeader from '../../components/AppHeader/index';

import ClientDetails from '../ClientDetails/index';
import ClientConnections from '../ClientConnections/index';
import ClientFinancing from '../ClientFinancing/index';

export default function ClientScreen({ navigation, route }) {
  const globalState = useContext(store);

  const { client_id, client_name } = route.params;

  const [index, setIndex] = useState(0);

  const [routes] = useState([
    { key: 'first', title: 'Geral' },
    { key: 'second', title: 'Conexões' },
    { key: 'third', title: 'Financeiro' },
  ]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return (
          <View
            style={styles.section_container}
          >
            <ClientDetails data={client_id} state={globalState} navigation={navigation} />
          </View>
        );

      case 'second':
        return (
          <View
            style={styles.section_container}
          >
            <ClientConnections data={client_id} state={globalState} />
          </View>
        );

      case 'third':
        return (
          <View
            style={styles.section_container}
          >
            <ClientFinancing data={client_id} state={globalState} navigation={navigation} />
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <AppHeader
        navigation={navigation}
        label={client_name}
        altura="10%"
        backButton={true}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props =>
          <TabBar
            {...props}
            indicatorStyle={styles.indicatorStyle}
            labelStyle={styles.label_style}
            style={styles.tabBar_style}
          />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#337AB7',
  },

  section_container: {
    backgroundColor: '#FFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    flex: 1,
    padding: 20,
    paddingBottom: 0,
  },

  main_text: {
    fontWeight: "bold",
    fontSize: fonts.regular,
    minWidth: '90%',
    maxWidth: '90%',
  },

  sub_text: {
    fontSize: fonts.small,
    color: '#989898',
  },

  indicatorStyle: {
    backgroundColor: '#FFF',
    height: 3,
    borderRadius: 8,
  },

  label_style: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: fonts.regular,
    alignSelf: 'center',
    textAlign: "center",
  },

  tabBar_style: {
    backgroundColor: '#337AB7',
    minHeight: 45,
    elevation: 0,
    marginBottom: 5,
    width: '90%',
    alignSelf: 'center',
  },
});
