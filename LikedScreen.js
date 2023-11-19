import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { loadLikedItems, saveLikedItems } from './SaveLoadFile'; 
import { useIsFocused } from '@react-navigation/native';
import { FontAwesome, } from '@expo/vector-icons';

const LikedItemsList = () => {
  const [likedItems, setLikedItems] = useState([]);
  const isFocused = useIsFocused();

  const fetchLikedItems = async () => {
    try {
      const loadedItems = await loadLikedItems();
      setLikedItems(loadedItems);
    } catch (error) {
      console.error('Error loading liked items:', error);
    }
  };

  useEffect(() => {
    fetchLikedItems();
  }, [isFocused]);

  const handleDeleteItem = (index) => {
    const updatedItems = [...likedItems];
    updatedItems.splice(index, 1);
    setLikedItems(updatedItems);
    saveLikedItems(updatedItems);
  };

  const renderItem = ({ item, index }) => (
    <View style={styles.itemContainer}>
      <Text style={styles.itemText}>{item}</Text>
      <TouchableOpacity onPress={() => handleDeleteItem(index)}>
        <FontAwesome name={'trash'} color={'#c22'} size={25}/>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Liked Items List</Text>
      <FlatList
        data={likedItems}
        keyExtractor={(item, index) => index.toString()}
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
  title: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 10,
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  itemText: {
    fontSize: 16,
  },

});

export default LikedItemsList;
