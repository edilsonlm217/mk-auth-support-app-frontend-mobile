import { StyleSheet } from 'react-native';

import { fonts } from '../../styles/index';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  header_container: {
    flexDirection: 'row',
    marginBottom: 15,
  },

  main_text: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    maxWidth: '95%',
  },

  sub_text: {
    fontSize: fonts.small,
    color: '#989898',
  },

  line_container_location: {
    flexDirection: 'row',
  },

  location_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  line_container: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btns_contaier: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#FFF',
  },
  secondary_btn: {
    backgroundColor: '#FFF',
    width: 160,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },

  secondary_btn_text: {
    fontSize: fonts.regular,
    fontWeight: 'bold',
    color: '#337AB7',
  },

  main_btn: {
    backgroundColor: '#337AB7',
    width: 160,
    height: 45,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 6,
  },

  main_btn_text: {
    fontSize: fonts.regular,
    fontWeight: 'bold',
    color: '#FFF',
  },

  close_request_btn: {
    width: 230,
    height: 60,
    backgroundColor: '#337AB7',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 200,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn_label: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: fonts.regular,
  },
});

export default styles;
