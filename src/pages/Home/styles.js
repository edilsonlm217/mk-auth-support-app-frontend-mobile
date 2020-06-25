import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    height: '100%',
    backgroundColor: '#337AB7',
  },

  date_selector: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: '5%',
    marginBottom: 5,
  },

  date: {
    marginLeft: 25,
    marginRight: 25,
    color: '#FFF',
    fontSize: 24,
  },

  section_container: {
    flex: 1,
    backgroundColor: '#FFF',
  },

  indicatorStyle: {
    backgroundColor: '#337AB7', 
    height: 4, 
    borderRadius: 8,
  },

  label_style: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },

  tabBar_style: {
    backgroundColor: '#FFF',
    borderTopRightRadius: 20,
    borderTopLeftRadius: 20,
    height: 50,
  },
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
  
  all_done_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  illustration_container: {
    resizeMode: "contain",
    width: 300,
    opacity: 0.8,
    height: 300,
    alignSelf: 'center',
  },
});

export default styles;