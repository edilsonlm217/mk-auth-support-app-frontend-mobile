import { StyleSheet } from 'react-native';
import { fonts } from '../../styles/index';

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF",
    width: '100%',
    height: '100%',
    padding: 20,
    paddingTop: 60,
  },
  header_container: {
    flexDirection: 'row',
    marginBottom: 15,
    justifyContent: "space-between",
  },

  main_text_login_senha: {
    fontWeight: "bold",
    fontSize: fonts.regular,
  },

  main_text: {
    fontWeight: "bold",
    fontSize: fonts.regular,
    minWidth: '90%',
    maxWidth: '90%',
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
    justifyContent: "space-between"
  },

  cto_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: "space-between"
  },

  line_container: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  btns_contaier: {
    flexDirection: "row",
    justifyContent: 'space-around',
    marginTop: 20,
    backgroundColor: '#FFF'
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
    fontSize: fonts.medium,
    fontWeight: "bold",
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
    fontSize: fonts.medium,
    fontWeight: "bold",
    color: '#FFF',
  },

  close_request_btn: {
    width: 200,
    height: 50,
    backgroundColor: '#337AB7',
    alignSelf: 'center',
    marginTop: 30,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },

  btn_label: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: fonts.medium,
  },

  modal_for_employees: {
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

  mfe_current_employee_section: {
    marginBottom: 10,
    marginTop: 10,
  },

  mfe_employees_section: {
    marginBottom: 10,
    marginTop: 10,
  },

  mfe_main_text: {
    fontWeight: "bold",
    marginBottom: 10,
    fontSize: fonts.regular,
  },

  mfe_confirm_btn: {
    backgroundColor: '#337AB7',
    marginTop: 15,
    borderRadius: 20,
    marginBottom: 10,
  },

  mfe_confirm_btn_label: {
    color: '#FFF',
    alignSelf: 'center',
    fontWeight: 'bold',
    fontSize: fonts.regular,
    margin: 5,
  },

  section_header: {
    marginTop: 0,
  },

  header_title: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: fonts.regular,
  },

  client_status: {
    fontSize: fonts.small,
    textAlign: 'center',
    marginRight: 5
  },

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

  modal_header: {
    fontWeight: "bold",
    fontSize: fonts.regular,
    marginBottom: 5,
  },

  text_input_style: {
    marginTop: 0,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#989898',
  },

  modal_btn_container: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
  },

  swiped_options: {
    position: "absolute",
    bottom: 0,
    right: 0,
    zIndex: 3,

    height: '100%',
    backgroundColor: '#f2f2f2',

    justifyContent: 'space-around',
    alignItems: 'center',
    flexDirection: 'row',
  },

  clickable_line: {
    padding: 5,
    borderBottomWidth: StyleSheet.hairlineWidth,
    flexDirection: 'row',
    justifyContent: "space-between"
  },
});

export default styles;