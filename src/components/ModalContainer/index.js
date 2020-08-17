import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Modal from 'react-native-modal';

import ModalHome from '../ModalHome/index';
import EditNumber from '../ModalEditContact/index';
import EditPhoneNumber from '../ModalEditContact/index';
import EditAddress from '../ModalEditAddress/index';

export default function ModalContainer(props) {
  console.log(props.clientData);
  const [viewMode, setViewMode] = useState(0);

  const [isVisible, setIsVisible] = useState(true);

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
        <EditNumber for={'editFone'} clientData={props.clientData} label="Alterar número de telefone" goBack={() => setViewMode(0)} />
      );
    } else if (viewMode === 2) {
      return (
        <EditPhoneNumber for={'editCelular'} clientData={props.clientData} label="Alterar número do celular" goBack={() => setViewMode(0)} />
      );
    }

    return (
      <EditAddress clientData={props.clientData} label="Alterar endereço" goBack={() => setViewMode(0)} />
    );
  }

  function handleModalClosing() {
    if (viewMode === 0) {
      setIsVisible(false);
      props.closeModal();
    } else {
      setViewMode(0);
    }
  }

  return (
    <Modal
      onBackButtonPress={handleModalClosing}
      onBackdropPress={handleModalClosing}
      children={
        <View style={styles.modal_style}>
          <CurrentView />
        </View>
      }
      isVisible={isVisible}
      style={{ margin: 0 }}
      animationInTiming={500}
      animationOutTiming={500}
      useNativeDriver={true}
    />
  );
}

const styles = StyleSheet.create({
  modal_style: {
    position: "absolute",
    width: '100%',
    backgroundColor: "#FFF",
    bottom: 0,
    padding: 20,
    paddingBottom: 0,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});