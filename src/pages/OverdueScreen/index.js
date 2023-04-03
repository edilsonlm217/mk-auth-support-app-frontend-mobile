import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  Alert,
} from 'react-native';
import { useIsFocused } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import Card from '../../components/Card';
import AppHeader from '../../components/AppHeader/index';

import styles from './styles';
import api from '../../services/api';
import { store } from '../../store/store';

export default function OverdueScreen({ navigation }) {
  const globalStore = useContext(store);

  const [sortMode, setSortMode] = useState('DESC');
  const [isLoading, setIsLoading] = useState(true);
  const [overdueAmount, setOverdueAmount] = useState(0);
  const [state, setState] = useState([]);

  const isFocused = useIsFocused(false);

  async function fetchOverdueRequests() {
    const { tenantID, userToken } = globalStore.state;

    try {
      setIsLoading(true);

      const response = await api.get(
        `requests/overdue?tenant_id=${tenantID}&sortMode=${sortMode}`,
        {
          timeout: 10000,
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      let card_amount = 0;
      response.data.map(item => {
        card_amount += item.cards.length;
      });

      setState(response.data);
      setOverdueAmount(card_amount);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      Alert.alert(
        'Erro',
        'Não foi possível recuperar chamados. Tente novamente!',
      );
    }
  }

  useEffect(() => {
    fetchOverdueRequests();
  }, []);

  useEffect(() => {
    fetchOverdueRequests();
  }, [sortMode, isFocused]);

  useEffect(() => {
    navigation.setOptions({ tabBarBadge: overdueAmount });
  }, [overdueAmount]);

  const SortButton = () => {
    function handleSorting() {
      if (sortMode === 'DESC') {
        setSortMode('ASC');
      } else {
        setSortMode('DESC');
      }
    }

    return (
      <TouchableOpacity style={styles.sort_btn} onPress={() => handleSorting()}>
        <Text style={[styles.sub_text, { marginRight: 15 }]}>
          {sortMode === 'ASC'
            ? 'Mais recentes primeiro'
            : 'Mais antigos primeiro'}
        </Text>

        <Icon
          name={sortMode === 'ASC' ? 'sort-descending' : 'sort-ascending'}
          size={22}
          color="#337AB7"
        />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <AppHeader
        navigation={navigation}
        label="Chamados em atraso"
        altura="21%"
      />
      <View style={{ backgroundColor: '#337AB7', flex: 1 }}>
        <View style={styles.container}>
          <SortButton />

          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isLoading}
                onRefresh={() => fetchOverdueRequests()}
              />
            }>
            {state.map(group => (
              <View key={group.date_group}>
                <Text style={styles.group_label}>{group.date_group}</Text>

                {group.cards.map(data => (
                  <Card key={data.id} item={data} navigation={navigation} />
                ))}
              </View>
            ))}
          </ScrollView>
        </View>
      </View>
    </>
  );
}
