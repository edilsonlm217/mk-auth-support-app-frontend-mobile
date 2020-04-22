import React, { useMemo, useState, useEffect, useReducer, useContext } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {format, subDays, addDays} from 'date-fns';
import axios from 'axios';

import pt from 'date-fns/locale/pt';
import { store } from '../../store/store';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';
import TabViewComponent from '../../components/TabViewComponent/index';

export default function Home({ navigation }) {
  const [date, setDate] = useState(new Date());

  const globalState = useContext(store);

  const [state, dispatch] = useReducer(reducer, {
    open_requests: [],
    close_requests: [],
  });

  useEffect(() => {
    async function loadAPI() {
      try {
        const response = await axios.post(`http://${globalState.state.server_ip}:${globalState.state.server_port}/requests`, {
          tecnico: globalState.state.employee_id,
          date: format(date, "yyyy-MM-dd'T'")+"00:00:00.000Z",
        });

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

  return (
    <View style={styles.container}>
      <AppHeader navigation={navigation} />
      <View style={styles.date_selector}>
        <TouchableOpacity onPress={handlePrevDay}>
          <Icon name="chevron-left" size={30} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.date}>{dateFormatted}</Text>
        <TouchableOpacity onPress={handleNextDay}>
          <Icon name="chevron-right" size={30} color="#FFF" />
        </TouchableOpacity>
      </View>
      
      <TabViewComponent state={state} navigation={navigation}/>

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
});
