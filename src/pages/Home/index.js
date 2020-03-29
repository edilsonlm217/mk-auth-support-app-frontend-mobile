import React, {useMemo, useState, useEffect, useReducer} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {format, subDays, addDays} from 'date-fns';

import pt from 'date-fns/locale/pt';
import api from '../../services/api';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';
import TabViewComponent from '../../components/TabViewComponent/index';

export default function Home() {
  const [date, setDate] = useState(new Date());

  const [state, dispatch] = useReducer(reducer, {
    open_requests: [],
    close_requests: [],
  });

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
      
      <TabViewComponent state={state}/>

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
