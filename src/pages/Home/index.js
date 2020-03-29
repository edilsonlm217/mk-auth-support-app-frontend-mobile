import React, {useMemo, useState, useEffect, useReducer} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Dimensions, FlatList} from 'react-native';
import {format, subDays, addDays} from 'date-fns';
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import pt from 'date-fns/locale/pt';

import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';
import FlatListCard from '../../components/FlatListCard/index';

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: 'first', title: 'Abertos' },
    { key: 'second', title: 'Fechados' },
  ]);

  const [state, dispatch] = useReducer(reducer, {
    open_requests: [],
    close_requests: [],
  });

  const initialLayout = {width: Dimensions.get('window').width};

  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM", {locale: pt}),
    [date],
  );

  useEffect(() => {
    async function loadAPI() {
      const response = await api.post('requests', {
        tecnico: 5,
        date: format(date, "yyyy-MM-dd'T'")+"00:00:00.000Z",
      });
      
      dispatch({
        type: 'save_requests',
        payload: {
          requests: response.data,
        },
      });
    }

    loadAPI();
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

  function handlePrevDay() {
    setDate(subDays(date, 1));
  }

  function handleNextDay() {
    setDate(addDays(date, 1));
  }

  const OpenRequestsRoute = () => (
    <View style={styles.section_container}>
        <FlatList
          data={state.open_requests}
          renderItem={({ item }) => <FlatListCard data={item}/>}
          keyExtractor={item => String(item.id)}
        />
    </View>
  );

  const CloseRequestsRoute = () => (
    <View style={styles.section_container}>
        <FlatList
          data={state.close_requests}
          renderItem={({ item }) => <FlatListCard data={item}/>}
          keyExtractor={item => String(item.id)}
        />
    </View>
  );

  const renderScene = SceneMap({
    first: OpenRequestsRoute,
    second: CloseRequestsRoute,
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{backgroundColor: '#337AB7', height: 4, borderRadius: 8}}
      labelStyle={{
        color: '#000',
        fontWeight: 'bold',
        fontSize: 16,
      }}
      style={{
        backgroundColor: '#FFF',
        borderTopRightRadius: 20,
        borderTopLeftRadius: 20,
        height: 50,
      }}
    />
  );

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.date_selector}>
        <TouchableOpacity onPress={handlePrevDay}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.date}>{dateFormatted}</Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Icon name="chevron-right" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>

      
      <TabView
          navigationState={{index, routes}}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
      />

    </View>
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
  },

  date: {
    marginLeft: 15,
    marginRight: 15,
    color: '#FFF',
    fontSize: 18,
  },

  section_container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
});
