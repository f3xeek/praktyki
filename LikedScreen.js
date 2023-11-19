import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { loadLikedItems, saveLikedItems } from './SaveLoadFile'; 
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome, } from '@expo/vector-icons';
import axios from 'axios';

const LikedItemsList = () => {
  const [likedItems, setLikedItems] = useState([]);
  const [LikedPaintings, setLikedPaintings] = useState([])
  const isFocused = useIsFocused();
  const fetchData = async () => {
    try {
      const response = await axios.get(`https://api.artic.edu/api/v1/artworks?ids=${likedItems.join(',')}&fields=id,title,image_id`);
      const artworks = response.data.data;
      setLikedPaintings(artworks);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };
  
  const fetchLikedItems = async () => {
    try {
      const loadedItems = await loadLikedItems();
      setLikedItems(loadedItems);
    } catch (error) {
      console.error('Error loading liked items:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [isFocused]);

  useEffect(() => {
    fetchLikedItems();
  }, [isFocused]);

  const handleDeleteItem = async (item) => {
    const updatedItems = likedItems.filter((likedItem) => likedItem !== item.id);
    const updatedPaintings = LikedPaintings.filter((likedItem) => likedItem.id !== item.id);
    setLikedItems(updatedItems);
    await saveLikedItems(updatedItems);
    setLikedPaintings(updatedPaintings);
  };

  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <Image source={{uri:`https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg` }} style={styles.image}/>
      <Text style={styles.itemText}>{item.title}</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(item)}>
        <FontAwesome name={'trash'} color={'#c22'} size={25} style={styles.trashcan}/>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liked Items List</Text>
      <FlatList
    data={LikedPaintings}
    keyExtractor={(item) => item.id.toString()} 
    renderItem={renderItem}
/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop: 40,
    backgroundColor: '#F5F5F5',
  },
  trashcan:{
    textAlign:'right',
    paddingRight:10,
  },
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    maxWidth:400,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemText: {
    fontSize: 16,
    maxWidth:200,
  },
  image:{
    width:100,
    height:100,
  }

});

export default LikedItemsList;
