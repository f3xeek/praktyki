import React, { useEffect, useState } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, StyleSheet, ScrollView, Image, TouchableOpacity} from 'react-native';
import { FontAwesome, } from '@expo/vector-icons';
import { useIsFocused } from '@react-navigation/native';
import { saveLikedItems, loadLikedItems } from './SaveLoadFile';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const isFocused = useIsFocused();
  const [loading, setLoading] = useState(false);
  const [likedItems, setLikedItems] = useState([]);
  const fetchArtistsAndArtworks = async () => {
    try {
      setLoading(true);

      const artistsResponse = await fetch(`https://api.artic.edu/api/v1/artists/search?q=${searchQuery}`);
      const artistsData = await artistsResponse.json();
      setArtists(artistsData.data);
      const artworksResponse = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchQuery}&fields=id,title,image_id`);
      const artworksData = await artworksResponse.json();
      setArtworks(artworksData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };
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
  const renderItem = ({ item }) => (
    <View style={styles.itemContainer}>
      <View style={styles.imageContainer}>
        {item.image_id && (
          <Image
            source={{
              uri: `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`,
            }}
            style={styles.image}
          />
        )}
      </View>
      <View style={styles.textContainer}>
        <FontAwesome name={'heart'} color={'#c22'} size={25} style={styles.trashcan} />
        <Text style={styles.itemText}>{item.title}</Text>
        <TouchableOpacity onPress={() => likeButtonPress(item.id)}></TouchableOpacity>
      </View>
    </View>
  );
  

  return (
    <ScrollView style={styles.container}>
      <View >
        <TextInput
          style={styles.input}
          placeholder="Search for artists and artworks"
          onChangeText={(text) => setSearchQuery(text)}
          value={searchQuery}
        />
        <Button title="Search" onPress={fetchArtistsAndArtworks} />
        {loading ? (
          <ActivityIndicator style={styles.loadingIndicator} size="large" color="#0000ff" />
        ) : (
          <View>
            <FlatList
              data={artworks}
              keyExtractor={(item) => item.id.toString()}
              renderItem={ renderItem}
            />
            <FlatList
              data={artists}
              keyExtractor={(item) => item.id.toString()}
              renderItem={renderItem}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    marginTop:40,
  },
  itemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    marginBottom: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  trashcan:{
    paddingRight: 10,
  },
  image:{
    width:100,
    height:100,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
  },
  loadingIndicator: {
    marginTop: 20,
  },
  textContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  imageContainer: {
    flex: 1,
  },
  itemText: {
    textAlign: 'center',
    flex: 1, 
  },
});

export default SearchScreen;
