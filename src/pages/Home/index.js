import React, { useMemo, useState, useEffect, useReducer, useContext } from 'react';
import { Dimensions, View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, RefreshControl } from 'react-native';
import {format, subDays, addDays} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import axios from 'axios';

import { store } from '../../store/store';

import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';
import Card from '../../components/Card/index';

export default function Home({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const globalState = useContext(store);

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

  async function onRefresh() {
    setRefreshing(true);
    loadAPI();
    setRefreshing(false);
  }

  async function loadAPI() {
    try {
      const response = await axios.post(
        `http://${globalState.state.server_ip}:${globalState.state.server_port}/requests`, 
        {
          tecnico: globalState.state.employee_id,
          date: format(date, "yyyy-MM-dd'T'")+"00:00:00.000Z",
        }
      );

      dispatch({
        type: 'save_requests',
        payload: {
          requests: response.data,
        },
      });
    } catch {
      Alert.alert('Não foi possível conectar ao servidor! Por favor,verifique se as configurações IP estão corretas.');
    }
  }

  useEffect(() => {
    setRefreshing(true);
    loadAPI();
    setRefreshing(false);
  }, [date]);
  
  
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
    () => format(date, "dd 'de' MMMM", {locale: pt}),
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
    return (
      <View style={styles.section_container}>
        { state.open_requests.length !== 0
          ?
            <ScrollView 
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              { state.open_requests.map(item => (
                <Card key={item.id} item={item} navigation={navigation}/>
              ))} 
            </ScrollView>
          :
            <View style={{flex: 1}}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
                <View>
                  <Text style={{alignSelf: 'center', marginTop: 50, fontSize: 18}}>Nenhum chamado</Text>
                </View>
              </ScrollView>
            </View>
        }
      </View>
    );
  }

  function CloseRequestsRoute() {
    return (
      <View style={styles.section_container}>
        {
          state.close_requests.length !== 0
          ?
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
            >
              { state.close_requests.map(item => (
                <Card key={item.id} item={item} navigation={navigation}/>
              ))} 
            </ScrollView>
          :
            <View style={{flex: 1}}>
              <ScrollView
                refreshControl={
                  <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                }
              >
                <View>
                  <Text style={{alignSelf: 'center', marginTop: 50, fontSize: 18}}>Nenhum chamado</Text>
                </View>
              </ScrollView>
            </View>
        }
      </View>
    );
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
            <Icon name="chevron-left" size={34} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
            <Text style={styles.date}>{dateFormatted}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextDay}>
            <Icon name="chevron-right" size={34} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={{width: Dimensions.get('window').width}}
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
            onChange={(event, selectedDate) => {handleNewDate(event, selectedDate)}}
            style={{backgroundColor: 'red'}}
          />
        : <></>
      }
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#337AB7',
  },

  date_selector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '5%',
    marginBottom: 5,
  },

  date: {
    marginLeft: 25,
    marginRight: 25,
    color: '#FFF',
    fontSize: 24,
  },

  section_container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  indicatorStyle: {
    backgroundColor: '#337AB7', 
    height: 4, 
    borderRadius: 8,
  },

  label_style: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  tabBar_style: {
    backgroundColor: '#FFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 50,
  },
  card: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#FFF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 10,
  },

  card_header_content_container: {
    padding: 20,
  },

  card_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  
  client_name: {
    fontWeight: 'bold',
    fontSize: 20,
    maxWidth: 250,
    color: '#808080',
  },

  visit_time: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#808080',
  },
  
  all_done_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  illustration_container: {
    resizeMode: "contain",
    width: 300,
    opacity: 0.8,
    height: 300,
    alignSelf: 'center',
  },
});
