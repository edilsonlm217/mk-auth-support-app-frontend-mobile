import { StyleSheet } from 'react-native';

import { fonts } from '../../styles/index';

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

  confirm_btn_container: {
    margin: 20,
    marginTop: 30,
    alignItems: 'center',
  },

  option_label: {
    fontSize: fonts.medium,
    fontWeight: "bold",
    marginTop: 20,
    marginLeft: 20,
  },

  confirm_btn: {
    width: '100%',
    maxWidth: 200,
    backgroundColor: '#337AB7',
    borderRadius: 25,
    height: 40,
  },

  btn_label: {
    color: '#FFF',
    fontWeight: 'bold',
    alignSelf: 'center',
    justifyContent: 'center',
    height: '100%',
    textAlignVertical: "center",
    fontSize: fonts.medium,
  },

  modal_style: {
    width: '100%',
    maxWidth: 275,
    backgroundColor: "#FFF",
    alignSelf: "center",
    borderWidth: 0,
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
    marginLeft: 30,
    marginRight: 30,
  },

  modal_text_style: {
    fontSize: fonts.regular,
    textAlign: "center",
    marginBottom: 10,
  },
});

export default styles;