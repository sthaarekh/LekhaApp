import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/components/HomeScreen';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AnalyticsScreen from './src/components/AnalyticsScreen';


const tabConfig=[
  {
    name:"Home",
    component: HomeScreen,
    focusedIcon: 'home',
    unFocusedIcon: 'home-outline',
    iconComponent: Ionicons
  },
  {
    name:"Analytics",
    component: AnalyticsScreen,
    focusedIcon: 'settings',
    unFocusedIcon: 'settings-outline',
    iconComponent: Ionicons,
  },
]
const App = () => {
  const Tab = createBottomTabNavigator();
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      const routeConfig = tabConfig.find(config => config.name === route.name);
      const iconName = focused
        ? routeConfig.focusedIcon
        : routeConfig.unFocusedIcon;
      const IconComponent = routeConfig.iconComponent;
  
      return <IconComponent name={iconName} size={size} color={color} />;
    },
          tabBarActiveTintColor:'blue',
          tabBarInactiveTintColor: 'black',
          tabBarLabelStyle:{
            fontSize:14,
            paddingBottom:5,
            fontWeight: 600,
          },
          tabBarStyle:{
            height:60,
            paddingTop:0,
          }
  });

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
      {tabConfig.map(route=>(
      <Tab.Screen key={route.name} name={route.name} component={route.component} />
    ))}
    </Tab.Navigator>
  </NavigationContainer>
  )
}

export default App