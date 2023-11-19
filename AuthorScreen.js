import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { FlatList } from 'react-native-gesture-handler';

const AuthorScreen = ({ route }) => {
  const navigation = useNavigation();
  const authorId = route.params.authorId;
  const [artistData, setArtistData] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://api.artic.edu/api/v1/artists/${authorId}`
        );
        setArtistData(response.data);

        const artworksResponse = await axios.get(
          `https://api.artic.edu/api/v1/artworks/search?${response.data.title}&limit=20&fields=image_id,id,artist_id`
        );
        setArtworks(artworksResponse.data.data);
        navigation.setOptions({
          headerTitle: response.data.data.title,
          headerTitleAlign: 'center',
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [authorId]);

  if (loading) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>
        {artistData.data.birth_date && `Birth Date: ${artistData.data.birth_date}`}
      </Text>
      <Text style={styles.text}>
        {artistData.data.death_date && `Death Date: ${artistData.data.death_date}`}
      </Text>
      <Text style={styles.description}>
        {artistData.data.description && `Description: ${artistData.data.description}`}
      </Text>
      {console.log(authorId, artworks)}
      <FlatList
        data={artworks}
        keyExtractor={(item) => item.image_id.toString()}
        nestedScrollEnabled={false}
        showsVerticalScrollIndicator={false}
        renderItem={({ item,index }) => (
          <View style={styles.imageContainer}>
            <Image
              source={{
                uri: `https://www.artic.edu/iiif/2/${item.image_id}/full/400,/0/default.jpg`,
              }}
              style={[
                styles.image,
                index % 2 === 1 ? styles.rightImage : null,
              ]}
            />
          </View>
        )}
      />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  loadingContainer: {
    padding: 0,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  text: {
    fontSize: 18,
    marginBottom: 4,
  },
  description: {
    fontSize: 16,
    marginTop: 8,
  },
  imageContainer: {
    flex: 1,
    width: '100%',
  },
  image: {
    width: 300,
    height: 300,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  
});

export default AuthorScreen;
