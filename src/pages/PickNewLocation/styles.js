import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },

  mapMarkerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  bottom_option: {
    marginTop: 10,
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#FFF',
    height: 150,
    width: '100%',

    borderTopWidth: 1,
    borderTopColor: 'red',
  },
  
  option_label: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
  },

  confirm_btn: {
    margin: 20,
    marginTop: 30,
    marginLeft: 110,
    marginRight: 110,
    alignItems: 'center',
    height: 50,
    backgroundColor: '#337AB7',
    borderRadius: 25,
  },

  btn_label: {
    color: '#FFF',
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 15,
  }
});

export default styles;