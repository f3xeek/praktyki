import React, { useState } from 'react';
import { View, TextInput, Button, FlatList, Text, ActivityIndicator, StyleSheet, ScrollView} from 'react-native';

const App = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [artists, setArtists] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchArtistsAndArtworks = async () => {
    try {
      setLoading(true);

      const artistsResponse = await fetch(`https://api.artic.edu/api/v1/artists/search?q=${searchQuery}`);
      const artistsData = await artistsResponse.json();
      setArtists(artistsData.data);
      const artworksResponse = await fetch(`https://api.artic.edu/api/v1/artworks/search?q=${searchQuery}`);
      const artworksData = await artworksResponse.json();
      setArtworks(artworksData.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

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
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>
                </View>
              )}
            />
            <FlatList
              data={artists}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.itemContainer}>
                  <Text style={styles.itemTitle}>{item.title}</Text>

                </View>
              )}
            />
          </View>
        )}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop:40,
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default App;
