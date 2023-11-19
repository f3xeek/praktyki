import React from 'react';
import { Modal, StyleSheet, Text, Pressable, View, Animated, Dimensions } from 'react-native';
import { PinchGestureHandler } from 'react-native-gesture-handler';

const {width, height} = Dimensions.get('window')
const ZoomImage = ({ modalVisible, toggleModal, data }) => {
    const scale=React.useRef(new Animated.Value(1)).current;
    const handlePinch = Animated.event([{ nativeEvent: { scale } }], { useNativeDriver: false });

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
          toggleModal();
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <PinchGestureHandler onGestureEvent={handlePinch}>
            <Animated.Image source={{ uri: `https://www.artic.edu/iiif/2/${data.image_id}/full/1600,/0/default.jpg` }} style={[styles.fullImage, {transform:[{scale}]}]} />
            </PinchGestureHandler>
            <Pressable
              style={[styles.button, styles.buttonClose]}
              onPress={() => toggleModal()}>
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
  fullImage: {
    height:height-20,
    width:width-20,
    marginBottom:10,
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
});

export default ZoomImage;
