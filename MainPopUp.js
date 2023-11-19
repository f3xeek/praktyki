import React from 'react';
import { Modal, StyleSheet, Text, Pressable, View } from 'react-native';
import HTML from 'react-native-render-html';
import { useNavigation } from '@react-navigation/native';

const Popup = ({ modalVisible, toggleModal, data }) => {
  const navigation = useNavigation();

  if (!data) {
    return null
  }
  return (
    <View style={styles.centeredView}>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          toggleModal(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.ModalTitle}>{data.title}</Text>
            <View>
              {data.description && (
                <>
                  <Text style={styles.modalText}>Description:</Text>
                  <HTML
                    source={{ html: data.description.substring(0, 1100) + '...' }}
                    style={styles.modalText}
                    tagsStyles={linkStyles}
                  />
                </>
              )}
              {data.artist_display && (
                <Text style={[styles.modalText, styles.hyperlink]} onPress={() => { navigation.navigate('Author', {authorId:data.artist_id}); toggleModal(false); }}>
                  Artist: {data.artist_display}
                </Text>
              )}
              {data.style_title && (
                <Text style={styles.modalText} onPress={() => { navigation.navigate('Genre'); toggleModal(false); }}>
                  Style: {data.style_title}
                </Text>
              )}
              {data.date_start && <Text style={styles.modalText}>Start Date: {data.date_start}</Text>}
              {data.date_end && <Text style={styles.modalText}>End Date: {data.date_end}</Text>}
            </View>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => toggleModal(!modalVisible)}>
              <Text style={styles.ButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};
const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    justifyContent: 'center', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  ModalTitle: {
    fontWeight: 'bold',
    textAlign: 'center',
    justifyContent: 'center',
  },
  modalText: {
    marginBottom: 5,
    textAlign: 'center',
  },
  ButtonText:{
    paddingLeft: 10,
    paddingRight: 10,
  },
  hyperlink:{
    textDecorationLine: 'underline',
  }
});

const linkStyles = {
  a: {
    textDecorationLine: 'none', 
    color: '#000', 
  },
};

export default Popup;
