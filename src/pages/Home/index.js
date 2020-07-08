import React, { useMemo, useState, useEffect, useReducer, useContext } from 'react';
import { Dimensions, View, Text, TouchableOpacity, Alert, ScrollView, RefreshControl, Image } from 'react-native';
import { format, subDays, addDays } from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import { useIsFocused } from '@react-navigation/native';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';

import { store } from '../../store/store';

import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';
import Card from '../../components/Card/index';

import NoConnection from '../../assets/broken-link.png';

import styles from './styles';
import { icons } from '../../styles/index';

export default function Home({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const globalState = useContext(store);

  console.log(globalState.state.isAdmin);

  const { signOut } = globalState.methods;

  const [state, dispatch] = useReducer(reducer, {
    open_requests: [],
    close_requests: [],
  });

  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Abertos' },
    { key: 'second', title: 'Fechados' },
  ]);

  const [refreshing, setRefreshing] = useState(false);

  // Hook para verificar se a tela atual está focada
  const isFocused = useIsFocused(false);

  // Estado que verificar se houve erro no carregamento dos dados da API
  const [isOutOfConnection, setIsOutOfConnection] = useState(false);

  async function onRefresh() {
    loadAPI();
  }

  async function loadAPI() {
    try {
      setRefreshing(true);

      const response = await axios.post(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/requests`,
        {
          tecnico: globalState.state.isAdmin === 'true' ? null : globalState.state.employee_id,
          date: format(date, "yyyy-MM-dd'T'") + "00:00:00.000Z",
        },
        {
          timeout: 2500,
          headers: {
            Authorization: `Bearer ${globalState.state.userToken}`,
          },
        },
      );

      dispatch({
        type: 'save_requests',
        payload: {
          requests: response.data,
        },
      });

      setRefreshing(false);
      setIsOutOfConnection(false);
    } catch (error) {
      setRefreshing(false);
      if (error.message.includes('401')) {
        handleLogout();
        Alert.alert(
          'Sessão expirada',
          'Sua sessão não é mais válida. Você será direcionado a tela de login'
        );
      } else {
        Alert.alert(
          'Erro de conexão',
          'Não foi possível conectar ao servidor! Por favor,verifique se as configurações IP estão corretas.'
        );
        setIsOutOfConnection(true);
      }
    }
  }

  useEffect(() => {
    loadAPI();
  }, [date]);

  useEffect(() => {
    if (isFocused) {
      loadAPI();
    }
  }, [isFocused]);


  function reducer(state, action) {
    switch (action.type) {
      case 'save_requests':
        let open_arr = [];
        let close_arr = [];

        if (action.payload.requests.length !== 0) {
          action.payload.requests.map(item => {
            if (item.status === 'fechado') {
              close_arr.push(item);
            }
            else {
              open_arr.push(item);
            }
          });
        }

        return {
          open_requests: open_arr,
          close_requests: close_arr,
        }
    }
  }

  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM", { locale: pt }),
    [date],
  );

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  function handleNewDate(event, selectedDate) {
    if (event.type === 'set') {
      setIsDatePickerVisible(false);
      setDate(selectedDate);
    } else if (event.type === 'dismissed') {
      setIsDatePickerVisible(false);
    }
  }

  function OpenRequestsRoute() {
    if (isOutOfConnection === false) {
      return (
        <View style={styles.section_container}>
          {state.open_requests.length !== 0
            ?
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              {state.open_requests.map(item => (
                <Card key={item.id} item={item} navigation={navigation} />
              ))}
            </ScrollView>
            :
            <View style={{ flex: 1 }}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
                {refreshing !== true &&
                  <View>
                    <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>Nenhum chamado</Text>
                  </View>
                }
              </ScrollView>
            </View>
          }
        </View>
      );
    } else {
      return (
        <View style={styles.section_container}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Image source={NoConnection} />
              <Text style={{ fontSize: 18, marginTop: 30 }}>Não há conexão com o servidor</Text>
            </View>
          </ScrollView>
        </View>
      );
    }
  }

  function CloseRequestsRoute() {
    if (isOutOfConnection === false) {
      return (
        <View style={styles.section_container}>
          {
            state.close_requests.length !== 0
              ?
              <ScrollView
                style={{ flex: 1 }}
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
                {state.close_requests.map(item => (
                  <Card key={item.id} item={item} navigation={navigation} />
                ))}
              </ScrollView>
              :
              <View style={{ flex: 1 }}>
                <ScrollView
                  refreshControl={
                    <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                  }
                >
                  {refreshing !== true &&
                    <View>
                      <Text style={{ alignSelf: 'center', marginTop: 50, fontSize: 18 }}>Nenhum chamado</Text>
                    </View>
                  }
                </ScrollView>
              </View>
          }
        </View>
      );
    } else {
      return (
        <View style={styles.section_container}>
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            }
          >
            <View style={{ alignItems: 'center', marginTop: 50 }}>
              <Image source={NoConnection} />
              <Text style={{ fontSize: 18, marginTop: 30 }}>Não há conexão com o servidor</Text>
            </View>
          </ScrollView>
        </View>
      );
    }
  }

  async function handleLogout() {
    try {
      const keys = ['@auth_token', '@employee_id', '@server_ip', '@server_port'];
      await AsyncStorage.multiRemove(keys);

      signOut();
    } catch (error) {
      Alert.alert('Error', 'Não foi possível fazer logout automático');
    }
  }

  const renderScene = SceneMap({
    first: OpenRequestsRoute,
    second: CloseRequestsRoute,
  });

  return (
    <>
      <View style={styles.container}>
        <AppHeader navigation={navigation} />
        <View style={styles.date_selector}>
          <TouchableOpacity onPress={handlePrevDay}>
            <Icon name="chevron-left" size={icons.large} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
            <Text style={styles.date}>{dateFormatted}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextDay}>
            <Icon name="chevron-right" size={icons.large} color="#FFF" />
          </TouchableOpacity>
        </View>

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

      {
        isDatePickerVisible
          ?
          <DateTimePicker
            mode={date}
            display="calendar"
            value={date}
            onChange={(event, selectedDate) => { handleNewDate(event, selectedDate) }}
            style={{ backgroundColor: 'red' }}
          />
          : <></>
      }
    </>
  );
}
