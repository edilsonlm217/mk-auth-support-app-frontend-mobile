import React, {useMemo, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {format, subDays, addDays} from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';
import FlatListCard from '../../components/FlatListCard/index';

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);

  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM", {locale: pt}),
    [date],
  );

  useEffect(() => {
    async function loadAPI() {
      const response = await api.post('requests', {
        tecnico: 5,
        date: '2020-03-06T00:00:00.000Z',
      });
      
      setData(response.data);
    }

    loadAPI();
  }, []);

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

      <View style={styles.section_container}>
        <FlatList
          data={data}
          renderItem={({ item }) => <FlatListCard data={item}/>}
          keyExtractor={item => String(item.id)}
        />
      </View>
      
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
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 10,
  },
});
