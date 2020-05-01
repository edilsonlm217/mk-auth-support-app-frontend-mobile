import React, { useMemo, useState, useEffect, useReducer, useContext } from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import {format, subDays, addDays} from 'date-fns';
import DateTimePicker from '@react-native-community/datetimepicker';
import axios from 'axios';

import pt from 'date-fns/locale/pt';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';
import TabViewComponent from '../../components/TabViewComponent/index';

export default function Home({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [isDatePickerVisible, setIsDatePickerVisible] = useState(false);

  const [state, dispatch] = useReducer(reducer, {
    open_requests: [],
    close_requests: [],
  });

  useEffect(() => {
    async function loadAPI() {
      try {
        const response = await axios.post(
          `http://10.0.2.2:3333/requests`, 
          {
            tecnico: 5,
            //tecnico: globalState.state.employee_id,
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

  function handleNewDate(event, selectedDate) {
    if (event.type === 'set') {
      setIsDatePickerVisible(false);
      setDate(selectedDate);
    } else if (event.type === 'dismissed') {
      setIsDatePickerVisible(false);
    }
  }

  return (
    <>
      <View style={styles.container}>
        <AppHeader navigation={navigation} />
        <View style={styles.date_selector}>
          <TouchableOpacity onPress={handlePrevDay}>
            <Icon name="chevron-left" size={32} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setIsDatePickerVisible(true)}>
            <Text style={styles.date}>{dateFormatted}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleNextDay}>
            <Icon name="chevron-right" size={32} color="#FFF" />
          </TouchableOpacity>
        </View>
        
        <TabViewComponent state={state} navigation={navigation}/>

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
  },

  date: {
    marginLeft: 25,
    marginRight: 25,
    color: '#FFF',
    fontSize: 22,
  },
});
