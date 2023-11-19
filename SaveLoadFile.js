import * as FileSystem from 'expo-file-system';

const FILE_PATH = `${FileSystem.documentDirectory}likedItems.json`;

export const saveLikedItems = async (likedItems) => {
  try {
    await FileSystem.writeAsStringAsync(FILE_PATH, JSON.stringify(likedItems));
  } catch (error) {
    console.error('Error saving liked items:', error);
  }
};

export const loadLikedItems = async () => {
  try {
    const fileContent = await FileSystem.readAsStringAsync(FILE_PATH);
    return fileContent ? JSON.parse(fileContent) : [];
  } catch (error) {
    console.error('Error loading liked items:', error);
    return [];
  }
};
