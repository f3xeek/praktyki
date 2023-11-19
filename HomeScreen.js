import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import Popup from './MainPopUp';
import { saveLikedItems, loadLikedItems } from './SaveLoadFile';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import 'react-native-gesture-handler';
import { PinchGestureHandler} from 'react-native-gesture-handler';
import Animated from 'react-native-reanimated';

const HomeScreen = () => {
  const [paintings, setPaintings] = useState([]);
  const [page, setPage] = useState(9);
  const scale = new Animated.Value(1);
  const [lastImgClicked, setLastImgClicked] = useState(105282);
  const [modalVisible, setModalVisible] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const isFocused = useIsFocused();
  

  useEffect(() => {
    const fetchLikedItems = async () => {
      const storedLikedItems = await loadLikedItems();
      setLikedItems(storedLikedItems);
    };
    fetchLikedItems();
  }, [isFocused]);

  const likeButtonPress = async (itemId) => {
    const isLiked = likedItems.includes(itemId);
    let updatedLikedItems;


    if (isLiked) {
      updatedLikedItems = likedItems.filter((id) => id !== itemId);
    } else {
      updatedLikedItems = [...likedItems, itemId];
    }

    setLikedItems(updatedLikedItems);

    await saveLikedItems(updatedLikedItems);
  };

  const RenderIt = ({ item }) => {
    const isLiked = likedItems.includes(item.id);
    const onPinchEvent = Animated.event([{ nativeEvent: { scale } }], { useNativeDriver: false });
    return (
      item.image_id && (
        <TouchableWithoutFeedback onPress={() => { setModalVisible(true); setLastImgClicked(item.id); }}>
          <View style={styles.imageContainer}>
            <Text style={styles.titles}>{item.title}</Text>
            <Animated.Image
              style={styles.image}
              source={{ uri: `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg` }}
            />
            <View style={styles.ButtonsContainer}>
              <TouchableWithoutFeedback onPress={() => likeButtonPress(item.id)}><Text style={[styles.button, { backgroundColor: isLiked ? '#ccffcc' :'#ffcccb'  }]}>Like</Text></TouchableWithoutFeedback>
              <TouchableWithoutFeedback onPress={() => console.log(likedItems)} ><Text style={styles.button}>Details</Text></TouchableWithoutFeedback>
              <TouchableWithoutFeedback ><Text style={styles.button}><FontAwesome name="search-plus" color={'#000'} size={20}/>
              <PinchGestureHandler onGestureEvent={onPinchEvent} >
               <Animated.Image source={{ uri: `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg` }}
               style={[styles.fullscreenImage, 
               { transform: [{ scale }] }]} 
               resizeMode="contain"/>
               </PinchGestureHandler></Text></TouchableWithoutFeedback>
            </View>
          </View>
        </TouchableWithoutFeedback>)
    );
  };

  const handleEndReached = () => {
    setPage((prevPage) => prevPage + 1);
  };

  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks?limit=20&page=${page}&fields=title,id,alt_text,description,date_start,date_end,artist_display,is_zoomable,image_id,artist_id,style_title,image_id`);
      setPaintings((prevPaintings) => [...prevPaintings, ...response.data.data]);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, isFocused]);
  return (
    <View style={styles.container}>
      <FlatList
        data={paintings}
        keyExtractor={(item) => item.image_id.toString()}
        renderItem={RenderIt}
        onEndReached={handleEndReached}
        onEndReachedThreshold={4}
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      <Popup modalVisible={modalVisible} toggleModal={() => setModalVisible(false)} data={paintings.find(item => item.id === lastImgClicked)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  imageContainer: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  titles: {
    margin: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  ButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    textAlign: 'center',
    flex: 1,
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
});

export default HomeScreen;
