import React, {useMemo, useState, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {format, subDays, addDays} from 'date-fns';
import pt from 'date-fns/locale/pt';
import {
  Collapse,
  CollapseHeader,
  CollapseBody,
} from 'accordion-collapse-react-native';

import api from '../../services/api';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import AppHeader from '../../components/AppHeader/index';

export default function Home() {
  const [date, setDate] = useState(new Date());
  const [data, setData] = useState([]);

  const dateFormatted = useMemo(
    () => format(date, "dd 'de' MMMM", {locale: pt}),
    [date],
  );

  useEffect(() => {
    async function loadAPI() {
      const response = await api.get('requests', {
        tecnico: 5,
        date: '2020-03-06T00:00:00.000Z',
      });
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
        <Text>{data.name}</Text>
        <View style={styles.card}>
          <Collapse>
            <CollapseHeader>
              <View style={styles.card_header}>
                <View style={styles.profile_img}>
                  <Text style={styles.profile_text}>MS</Text>
                </View>
                <View style={styles.client_section}>
                  <Text style={styles.client_name}>Milena de Souza Silva</Text>
                  <Text style={styles.sub_text}>
                    Rua Eduarda Magalhães (antiga A), 15 - Ouro Verde
                  </Text>
                </View>
              </View>
            </CollapseHeader>
            <CollapseBody>
              <View style={styles.card_body}>
                <View style={styles.service_info}>
                  <Text style={styles.sub_text}>Serviço:</Text>
                  <Text style={styles.main_body_text}>
                    Ativação via Fibra ótica
                  </Text>
                </View>
                <View>
                  <Text style={styles.sub_text}>Relato do cliente:</Text>
                  <Text style={styles.main_body_text}>
                    Cliente já possui roteador
                  </Text>
                </View>
              </View>
              <View>
                <Text style={styles.location_btn}>Localização</Text>
                <Text style={styles.close_request_btn}>Fechar chamado</Text>
              </View>
            </CollapseBody>
          </Collapse>
        </View>
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

  card: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
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

  card_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  profile_img: {
    alignSelf: 'center',
    backgroundColor: '#33B2B7',
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },

  profile_text: {
    fontSize: 30,
    color: '#FFF',
  },

  client_section: {
    flex: 1,
    marginBottom: 20,
    marginTop: 20,
    marginRight: 20,
  },

  client_name: {
    fontWeight: 'bold',
    fontSize: 20,
  },

  sub_text: {
    color: '#ABABAB',
  },

  card_body: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },

  service_info: {
    marginBottom: 15,
  },

  main_body_text: {
    fontWeight: 'bold',
  },

  location_btn: {
    height: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#D8D8D8',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },

  close_request_btn: {
    height: 40,
    backgroundColor: '#337AB7',
    color: '#FFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    fontSize: 16,
  },
});
