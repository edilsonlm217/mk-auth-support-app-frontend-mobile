import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  card: {
    marginLeft: 20,
    marginRight: 20,
    marginTop: 10,
    marginBottom: 10,
    borderRadius: 6,
    backgroundColor: '#FFF',

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.32,
    shadowRadius: 5.46,

    elevation: 10,
  },

  card_header_content_container: {
    padding: 20,
  },

  card_header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  profile_img: {
    alignSelf: 'center',
    backgroundColor: '#33B2B7',
    width: 70,
    height: 70,
    borderRadius: 50,
    marginLeft: 20,
    marginRight: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 0,
  },

  client_name: {
    fontWeight: 'bold',
    fontSize: 20,
    maxWidth: 250,
    color: '#808080',
  },

  visit_time: {
    fontWeight: 'bold',
    fontSize: 18,
    color: '#808080',
  },

  card_body: {
    marginLeft: 20,
    marginRight: 20,
    marginBottom: 20,
  },

  main_body_text: {
    fontWeight: 'bold',
  },

  location_btn: {
    height: 40,
    borderTopWidth: 0.5,
    borderTopColor: '#D8D8D8',
    textAlign: 'center',
    textAlignVertical: 'center',
    fontSize: 16,
  },

  close_request_btn: {
    height: 40,
    backgroundColor: '#337AB7',
    color: '#FFF',
    textAlign: 'center',
    textAlignVertical: 'center',
    borderBottomLeftRadius: 6,
    borderBottomRightRadius: 6,
    fontSize: 16,
  },
});

export default styles;
