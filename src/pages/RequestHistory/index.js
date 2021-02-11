import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, RefreshControl } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';

import api from '../../services/api';

export default function RequestHistory(props) {
  const [state, setState] = useState(null);
  const [sortMode, setSortMode] = useState('DESC');
  const [refreshing, setRefreshing] = useState(false);

  async function fetchRequests() {
    const { tenant_id, client_id, userToken } = props.data;

    try {
      setRefreshing(true);

      const response = await api.get(
        `requests/history?tenant_id=${tenant_id}&client_id=${client_id}&sort_mode=${sortMode}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      setState(response.data);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      console.log(error);
      Alert.alert('Erro', 'Não foi possível recuperar chamados')
    }
  }

  useEffect(() => {
    fetchRequests();
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [sortMode]);

  function handleSorting() {
    if (sortMode === 'DESC') {
      setSortMode('ASC');
    } else {
      setSortMode('DESC');
    }
  }

  function handleNavigate(id, nome, assunto) {
    props.navigation.setParams({
      re_open_modal: false,
    });


    props.navigation.navigate('Details', {
      id: id,
      nome: nome,
      assunto: assunto,
      tipo: state.client.tipo,
      ip: state.client.ip,
      plano: state.client.plano,
    });
  }

  const Card = ({ data }) => {
    if (data) {

      const data_fechamento =
        data.fechamento === null
          ? format(parseISO(data.visita), `dd 'de' MMM 'de' yyyy`, { locale: pt })
          : format(parseISO(data.fechamento), `dd 'de' MMM 'de' yyyy`, { locale: pt });

      return (
        <TouchableOpacity
          onPress={() => handleNavigate(data.id, data.nome, data.assunto)}
          style={styles.card}
        >
          <View style={styles.card_header}>
            <Text numberOfLines={1} style={styles.client_name}>{data.nome}</Text>
            <Text style={styles.sub_text}>{data_fechamento}</Text>
          </View>
          <Text
            style={[
              styles.sub_text,
              { fontFamily: 'Roboto-Regular' }]
            }
          >{`Serviço: ${data.assunto}`}</Text>
          <Text
            style={[
              styles.sub_text,
              { fontFamily: 'Roboto-Regular' }
            ]}
          >{`Técnico: ${data.tecnico === null ? 'Não assinalado' : data.tecnico}`}</Text>
        </TouchableOpacity>
      );
    }

    return <></>;
  };

  return (
    <ScrollView
      style={{ flex: 1 }}
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchRequests()}
        />
      }
    >
      <Text style={styles.main_text}>Abertos</Text>

      {state !== null &&
        <>
          {state.opened_requests.length > 0
            ?
            <>
              {state.opened_requests.map(request => (
                <Card key={request.id} data={request} />
              ))}
            </>
            :
            <Text style={styles.sub_text}>Nenhum chamado</Text>
          }

        </>
      }

      <View style={styles.header_container}>
        <Text
          style={[
            styles.main_text,
            { height: '100%', textAlignVertical: 'center' }
          ]}
        >Fechados</Text>

        <TouchableOpacity
          onPress={() => handleSorting()}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          {sortMode === 'desc'
            ?
            <>
              <Text
                style={[
                  styles.sub_text,
                  { marginRight: 15 }
                ]}
              >Mais recentes primeiro</Text>
              <Icon name="sort-ascending" size={22} color="#337AB7" />
            </>
            :
            <>
              <Text
                style={[
                  styles.sub_text,
                  { marginRight: 15 }
                ]}
              >Mais antigos primeiro</Text>
              <Icon name="sort-descending" size={22} color="#337AB7" />
            </>
          }

        </TouchableOpacity>
      </View>

      <ScrollView
        style={{ flex: 1, marginTop: 5 }}
      >
        {state !== null &&
          <>
            {state.closed_requests.length > 0
              ?
              <>
                {state.closed_requests.map(request => (
                  <Card key={request.id} data={request} />
                ))}
              </>
              :
              <Text style={styles.sub_text}>Nenhum chamado</Text>
            }
          </>
        }
      </ScrollView>

    </ScrollView >
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 10,
    borderWidth: StyleSheet.hairlineWidth,
    borderRadius: 4,
    borderColor: '#04EF72',
    marginBottom: 10,
  },

  card_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  main_text: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5
  },

  sub_text: {
    fontFamily: 'Roboto-Light',
    fontSize: 12,
  },

  client_name: {
    fontWeight: 'bold',
    fontSize: 16,
    flex: 1,
    paddingRight: 10,
    color: '#808080',
  },

  header_container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 15,
  },
});
