import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import UserAvatar from 'react-native-user-avatar';
import Icon from 'react-native-vector-icons/MaterialIcons';

export default function NotesScreen({ navigation }) {

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
    <View style={{ flex: 1, paddingTop: 25, marginLeft: 10, marginRight: 10, padding: 5 }}>
      <View style={{ backgroundColor: "#EBEBEB", padding: 10, borderRadius: 10, marginBottom: 10 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <UserAvatar style={{ width: 30, height: 30 }} size={30} name="Tereza Farias" />
            <Text style={{ fontFamily: 'Roboto-Bold', marginLeft: 5 }}> Tereza Farias</Text>
          </View>
          <Text style={{ fontFamily: 'Roboto-Light', fontSize: 12, marginLeft: 10 }}>22/12/2020 às 21:13:56</Text>
        </View>
        <Text style={{ fontFamily: 'Roboto-Light', paddingLeft: 5 }}>
          Retirar ONU + Roteador - 3 Meses So pagou a ativacao
          </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({

});