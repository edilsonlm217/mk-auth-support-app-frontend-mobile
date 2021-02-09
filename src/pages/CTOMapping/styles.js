import { StyleSheet } from 'react-native';

import { fonts } from '../../styles/index';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map_container: {
    flex: 1,
  },

  map: {
    height: '100%',
  },

  bottom_menu: {
    minHeight: 230,
    maxHeight: '55%',
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 0.7,
    borderTopColor: 'red',
  },

  main_title: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
  },

  suggested_card: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,

    marginBottom: 15,
    marginTop: 10,

    borderWidth: 0.5,
    borderRadius: 20,
    borderColor: '#AFAFAF',
  },

  suggested_card_selected: {
    flexDirection: 'row',
    justifyContent: 'space-between',

    padding: 5,
    paddingLeft: 15,
    paddingRight: 15,

    marginBottom: 15,
    marginTop: 10,

    borderWidth: 1,
    borderRadius: 20,
    borderColor: '#3842d2',
  },

  card_name: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  icon_container: {
    borderWidth: 0.5,
    borderRadius: 50,
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },

  distance_container: {
    alignItems: 'flex-end',
  },

  card_title: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
  },

  sub_card_title: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    minWidth: 70,
  },

  sub_card_title_distance: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    textAlign: 'right',
    minWidth: 70,
  },

  sub_card_icon_container: {
    minWidth: 70,
    alignItems: 'flex-end',
  },

  sub_card_title_selected: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    color: '#FFF',
    minWidth: 70,
  },

  card_distance: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
  },

  connection_amount: {
    color: '#AFAFAF',
  },

  sub_cards_container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    alignItems: 'center',
  },

  sub_cards: {
    flexGrow: 1,
    height: 55,

    borderWidth: 0.5,
    borderColor: '#AFAFAF',
    borderRadius: 20,

    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,

    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,

    justifyContent: 'center',
  },

  sub_cards_selected: {
    flexGrow: 1,
    height: 55,

    borderWidth: 0.5,
    borderColor: '#3842D2',
    borderRadius: 20,

    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,

    marginTop: 10,
    marginLeft: 5,
    marginRight: 5,

    justifyContent: 'center',

    backgroundColor: '#3842D2',
  },

  main_line: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  main_line_selected: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: '100%',
  },

  sub_line: {
    color: '#AFAFAF',
  },

  modal_style: {
    width: 300,
    backgroundColor: '#FFF',
    alignSelf: 'center',
    borderWidth: 0,
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
  },

  modal_header: {
    fontWeight: 'bold',
    fontSize: fonts.regular,
    width: '100%',
    marginBottom: 5,
  },

  modal_confirm_btn: {
    width: '100%',
    height: 40,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#3842D2',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 4,
  },

  modal_cancel_btn: {
    width: '100%',
    height: 40,
    marginTop: 10,
    display: 'flex',
    justifyContent: 'center',
    borderRadius: 4,
    backgroundColor: '#000',

    shadowColor: '#000',
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 4,
  },

  modal_btn_style: {
    fontSize: fonts.regular,
    textAlign: 'center',
    color: '#FFF',
  },
});

export default styles;
