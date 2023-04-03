import { PermissionsAndroid, Alert } from 'react-native';
// import openMap from 'react-native-open-maps';
import OpenMap from 'react-native-open-map';
import LocationServicesDialogBox from 'react-native-android-location-services-dialog-box';

class LocationService {
  constructor() {
    this.init();
  }

  init() {}

  async isGPSEnable() {
    try {
      await LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2 style='color: #0af13e'>Usar Localização ?</h2>Este app quer alterar as configurações do seu dispositivo:<br/><br/>Usar GPS, Wi-Fi e rede do celular para localização<br/><br/><a href='#'>Saiba mais</a>",
        ok: 'SIM',
        cancel: 'NÃO',
        enableHighAccuracy: true,
        showDialog: true,
        openLocationServices: true,
        preventOutSideTouch: false,
        preventBackClick: false,
        providerListener: false,
      });

      return true;
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar se o GPS está ativo');
      return false;
    }
  }

  async navigateToCoordinate(coordinate) {
    try {
      await LocationServicesDialogBox.checkLocationServicesIsEnabled({
        message:
          "<h2 style='color: #0af13e'>Usar Localização ?</h2>Este app quer alterar as configurações do seu dispositivo:<br/><br/>Usar GPS, Wi-Fi e rede do celular para localização<br/><br/><a href='#'>Saiba mais</a>",
        ok: 'SIM',
        cancel: 'NÃO',
        enableHighAccuracy: true,
        showDialog: true,
        openLocationServices: true,
        preventOutSideTouch: false,
        preventBackClick: false,
        providerListener: false,
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível verificar se o GPS está ativo');
      return;
    }

    const [latitude, longitude] = coordinate.split(',');

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        // openMap({
        //   provider: 'google',
        //   end: `${latitude},${longitude}`,
        // });

        OpenMap.show({
          latitude: latitude,
          longitude: longitude,
          cancelText: 'Fechar',
          actionSheetTitle: 'Como deseja navegar?',
        });
      } else {
        Alert.alert('Erro', 'Não foi possível recuperar sua Localização');
      }
    } catch (err) {
      Alert.alert('Erro', 'Não é possível navegar até o cliente');
    }
  }
}

export default new LocationService();
