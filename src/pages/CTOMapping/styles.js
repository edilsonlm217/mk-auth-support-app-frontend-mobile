import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  map_container: {
    flex: 1,
  },
  
  map: {
    height: "100%",
  },

  bottom_menu: {
    minHeight: 230,
    maxHeight: 370,
    backgroundColor: '#FFF',
    padding: 15,
    borderTopWidth: 0.7,
    borderTopColor: "red",
  },

  main_title: {
    fontWeight: "bold",
    fontSize: 18,
  },
  
  suggested_card: {
    borderWidth: 0.5,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 15,
    marginTop: 10,
    borderRadius: 20,
    borderColor: '#AFAFAF',
  },

  suggested_card_selected: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    marginBottom: 15,
    marginTop: 10,
    borderRadius: 20,
    borderColor: '#3842D2',
    borderWidth: 1,
  },

  card_name: {
    flexDirection: "row",
    alignItems: "center",
  },

  icon_container: {
    borderWidth: 0.5,
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },

  distance_container: {
    alignItems: "flex-end",
  },

  card_title: {
    fontWeight: "bold",
    fontSize: 20,
  },

  sub_card_title: {
    fontWeight: "bold",
    fontSize: 18,
  },

  sub_card_title_selected: {
    fontWeight: "bold",
    fontSize: 22,
    color: "#FFF",
  },

  card_distance: {
    fontWeight: "bold",
    fontSize: 20,
  },

  connection_amount: {
    color: '#AFAFAF',
  },

  sub_cards_container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  sub_cards: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 20,
    borderColor: '#AFAFAF',
    minWidth: 180,
    marginTop: 15,
    height: 65,
  },

  sub_cards_selected: {
    borderWidth: 0.5,
    padding: 10,
    borderRadius: 20,
    borderColor: '#AFAFAF',
    minWidth: 180,
    marginTop: 15,
    height: 65,
    backgroundColor: "#3842D2",
  },

  main_line: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  main_line_selected: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    height: '100%',
  },

  sub_line: {
    color: '#AFAFAF',
  },

  modal_style: {
    width: 300,
    backgroundColor: "#FFF",
    alignSelf: "center",
    borderWidth: 0,
    borderRadius: 10,
    padding: 20,
    paddingTop: 10,
  },

  modal_header: {
    fontWeight: "bold",
    fontSize: 18,
    width: '100%',
    marginBottom: 5,
  },

  modal_confirm_btn: {
    width: '100%',
    height: 40,
    marginTop: 10,
    display: "flex",
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
    display: "flex",
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
    fontSize: 18,
    textAlign: "center",
    color: '#FFF',
  },
});

export default styles;