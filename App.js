import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { FontAwesome } from '@expo/vector-icons';
import HomeScreen from './HomeScreen';
import SearchScreen from './SearchScreen';
import LikedScreen from './LikedScreen';
import AuthorScreen from './AuthorScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const HomeStack = () => {
  return (
    <Stack.Navigator >
      <Stack.Screen name="Home" component={HomeScreen} options={{headerShown:false}}/>
      <Stack.Screen name="Author" component={AuthorScreen}/>
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ headerShown: false }}>
        <Tab.Screen name="Explore" component={HomeStack} options={{tabBarIcon: ({ color, size }) => (
              <FontAwesome name={'home'} size={size+8} color={color} />
            ),
          }}/>
        <Tab.Screen name="Search" component={SearchScreen} options={{tabBarIcon: ({ color, size }) => (
              <FontAwesome name={'search'} size={size} color={color} />
            ),
          }}/>        
          <Tab.Screen name="Liked" component={LikedScreen} options={{tabBarIcon: ({ color, size }) => (
            <FontAwesome name={'heart'} size={size} color={color} />
          ),
        }}/>
      </Tab.Navigator>
    </NavigationContainer>
  );
}
