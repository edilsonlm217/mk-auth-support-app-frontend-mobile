import React, { useState } from 'react';
import { StyleSheet } from 'react-native';

import ModalHome from '../ModalHome/index';
import EditNumber from '../ModalEditContact/index';
import EditPhoneNumber from '../ModalEditContact/index';
import EditAddress from '../ModalEditAddress/index';

export default function ModalContainer(props) {
  const [viewMode, setViewMode] = useState(0);

  const navigation_array = [
    () => { setViewMode(1) },
    () => { setViewMode(2) },
    () => { setViewMode(3) },
    () => { props.goToModal() },
    () => { props.goToModal() },
  ];

  const CurrentView = () => {
    if (viewMode === 0) {
      return (
        <ModalHome navigationOptions={navigation_array} />
      );
    } else if (viewMode === 1) {
      return (
        <EditNumber label="Alterar número de telefone" goBack={() => setViewMode(0)} />
      );
    } else if (viewMode === 2) {
      return (
        <EditPhoneNumber label="Alterar número do celular" goBack={() => setViewMode(0)} />
      );
    }

    return (
      <EditAddress label="Alterar endereço" goBack={() => setViewMode(0)} />
    );
  }

  return (
    <CurrentView />
  );
}

const styles = StyleSheet.create({

});