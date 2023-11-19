import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableWithoutFeedback, Image } from 'react-native';
import Popup from './MainPopUp';
import { saveLikedItems, loadLikedItems } from './SaveLoadFile';
import axios from 'axios';
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome } from '@expo/vector-icons';
import ZoomImage from './ZoomableModal';
import { useNavigation } from '@react-navigation/native';

const HomeScreen = () => {
  const [paintings, setPaintings] = useState([]);
  const [page, setPage] = useState(3);
  const [lastImgClicked, setLastImgClicked] = useState();
  const [modalVisible, setModalVisible] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const isFocused = useIsFocused();
  const [imageZoom, setimageZoom] = useState(false)
  const navigation = useNavigation();
  

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
    return (
      item.image_id && (
        <TouchableWithoutFeedback onPress={() => { setModalVisible(true); setLastImgClicked(item.id); }}>
          <View style={styles.imageContainer}>
            <Text style={styles.titles}>{item.title}</Text>
            <Image
              style={styles.image}
              source={{ uri: `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`}}
            />
            <View style={styles.ButtonsContainer}>
              <TouchableWithoutFeedback onPress={() => likeButtonPress(item.id)}><Text style={[styles.button, { color: isLiked ? '#f44' :'#000'  }]}><FontAwesome name="heart" size={30} /></Text></TouchableWithoutFeedback>
              {item.longitude&&(<TouchableWithoutFeedback onPress={() => navigation.navigate('Map', {longitude:item.longitude, latitude:item.latitude, title:item.title})} ><Text style={styles.button}><FontAwesome name="map" color={'#000'} size={30}/></Text></TouchableWithoutFeedback>)}
              {item.is_zoomable&&(<TouchableWithoutFeedback ><Text style={styles.button}><FontAwesome name="search-plus" color={'#000'} size={30} onPress={()=>[setLastImgClicked(item.id),setimageZoom(true)]}/> </Text></TouchableWithoutFeedback>)}
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
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks?limit=30&page=${page}&fields=title,id,alt_text,description,date_start,date_end,artist_display,is_zoomable,image_id,artist_id,style_title,image_id,latitude,longitude`);
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
        keyExtractor={(item) => item.id.toString()}
        renderItem={RenderIt}
        onEndReached={handleEndReached}
        onEndReachedThreshold={4}
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
      />
      <Popup modalVisible={modalVisible} toggleModal={() => setModalVisible(false)} data={paintings.find(item => item.id === lastImgClicked)} />
      <ZoomImage modalVisible={imageZoom} toggleModal={()=> setimageZoom(false) } data={paintings.find(item => item.id === lastImgClicked)} />
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
    marginBottom:8,
    textAlign: 'center',
    flex: 1,
  },
});

export default HomeScreen;
