import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Text, Alert } from 'react-native';
import { TabView, TabBar } from 'react-native-tab-view';
import { useIsFocused } from '@react-navigation/native';
import axios from 'axios';

import { fonts } from '../../styles/index';
import { store } from '../../store/store';
import { clientStore } from '../../store/client';

import AppHeader from '../../components/AppHeader/index';
import ModalContainer from '../../components/ModalContainer/index';

import ClientDetails from '../ClientDetails/index';
import ClientConnections from '../ClientConnections/index';
import ClientFinancing from '../ClientFinancing/index';

export default function ClientScreen({ navigation, route }) {
  const globalState = useContext(store);
  const ClientState = useContext(clientStore);
  const { setIsLoading, setClientData } = ClientState.methods;

  const { client_id, client_name } = route.params;

  const [index, setIndex] = useState(0);

  const [count, setCount] = useState(0);

  const [routes] = useState([
    { key: 'first', title: 'Geral' },
    { key: 'second', title: 'Conexões' },
    { key: 'third', title: 'Financeiro' },
  ]);

  const [isVisible, setIsVisible] = useState(false);

  const isFocused = useIsFocused(false);

  useEffect(() => {
    if (isFocused) {
      setCount(count + 1);
      if (count + 1 > 1) {
        setIsVisible(true);
      }
    }
  }, [isFocused]);

  async function loadAPI() {
    try {
      setIsLoading();

      const response = await axios.get(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/client/${client_id}`,
        {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      setClientData(response.data);
    } catch {
      Alert.alert('Erro', 'Não foi possível comunicar com a API');
    }
  }

  useEffect(() => {
    loadAPI();
  }, []);

  useEffect(() => {
    if (isVisible === false) {
      loadAPI();
    }
  }, [isVisible]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case 'first':
        return (
          <View
            style={styles.section_container}
          >
            <ClientDetails data={client_id} state={globalState} clientState={ClientState} navigation={navigation} />
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

  const renderLabel = ({ route }) => (
    <View>
      <Text style={styles.label_style} ellipsizeMode='tail' numberOfLines={1}>
        {route.title.toUpperCase()}
      </Text>
    </View>
  );

  function handleModalClosing() {
    setIsVisible(false);
  }

  function handleNavigateToLocation() {
    handleModalClosing();

    navigation.navigate('UpdateClienteLocation', {
      data: {
        id: ClientState.state.client.id,
      }
    });
  }

  function handleNavigateToCTO() {
    handleModalClosing();

    const [latidude, longitude] = ClientState.state.client.coordenadas.split(',');

    navigation.navigate('CTOs', {
      to: 'CTO',
      latidude: latidude,
      longitude: longitude,
      client_name: ClientState.state.client.nome,
      client_id: ClientState.state.client.id,
    });
  }

  return (
    <View style={styles.container}>
      <AppHeader
        navigation={navigation}
        label={client_name}
        altura="10%"
        backButton={true}
        clientScreen={true}
        OpenModal={() => setIsVisible(true)}
      />

      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: Dimensions.get('window').width }}
        renderTabBar={props =>
          <TabBar
            {...props}
            renderLabel={renderLabel}
            indicatorStyle={styles.indicatorStyle}
            style={styles.tabBar_style}
          />
        }
      />

      <>
        {isVisible &&
          <ModalContainer
            clientData={ClientState.state.client}
            closeModal={() => setIsVisible(false)}
            goToModalLocation={() => handleNavigateToLocation()}
            goToModalCTO={() => handleNavigateToCTO()}
          />
        }
      </>
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
    fontSize: fonts.medium,
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

  modal_style: {
    position: "absolute",
    width: '100%',
    backgroundColor: "#FFF",
    bottom: 0,
    padding: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});
