import React, { useState, useEffect, useContext } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ScrollView, Image } from 'react-native';

import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/MaterialIcons';

import api from '../../services/api';
import { store } from '../../store/store';
import no_message from '../../assets/no_messages.png';

export default function NotesScreen({ navigation, route }) {
  const globalState = useContext(store);
  const { tenantID: tenant_id, userToken } = globalState.state;

  const [refreshing, setRefreshing] = useState(false);
  const [notes, setNotes] = useState([]);


  async function fetchNotes() {
    setRefreshing(true);

    try {
      const { chamado } = route.params;

      const response = await api.get(`messages?tenant_id=${tenant_id}&chamado=${chamado}`, {
        timeout: 10000,
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });

      setNotes(response.data);
      setRefreshing(false);
    } catch (error) {
      setRefreshing(false);
      Alert.alert('Erro', 'Não foi possível carregar notas');
    }
  }

  useEffect(() => {
    fetchNotes();
  }, []);


  const AddButton = () => (
    <TouchableOpacity onPress={() => { }}>
      <Icon
        name="add-circle"
        size={25}
        color="#FFFFFF"
        style={{ marginRight: 20, marginTop: 5 }}
      />
    </TouchableOpacity >
  );

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: (props) => (
        <AddButton
          {...props}
        />
      ),
    });
  }, [navigation]);

  return (
    <View style={{ flex: 1, paddingTop: 25, paddingLeft: 15, paddingRight: 15, padding: 5, backgroundColor: '#FFF' }}>
      <ScrollView style={{ flex: 1 }}>

        {notes.length === 0 && (
          <View style={{ alignSelf: 'center', marginTop: 200 }}>
            <Image source={no_message} style={{ width: 200, height: 150 }} />
            <Text style={{ alignSelf: 'center', marginTop: 10 }}>Não há Mensagens</Text>
          </View>
        )}

        {notes.map(note => (
          <View key={note.id} style={{ backgroundColor: "#EBEBEB", padding: 10, borderRadius: 10, marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <UserAvatar style={{ width: 30, height: 30 }} size={30} name={note.atendente} />
                <Text style={{ fontFamily: 'Roboto-Bold', marginLeft: 5 }}>{` ${note.atendente}`}</Text>
              </View>
              <Text style={{ fontFamily: 'Roboto-Light', fontSize: 12, marginLeft: 10 }}>{note.msg_data}</Text>
            </View>
            <Text style={{ fontFamily: 'Roboto-Light', paddingLeft: 5 }}>
              {note.msg}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View >
  );
}

const styles = StyleSheet.create({

});