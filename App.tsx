import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import SplashScreen from 'react-native-splash-screen';
import HomeScreen from './src/components/HomeScreen';
import AnalyticsScreen from './src/components/AnalyticsScreen';
import AddItemsScreen from './src/components/AddItemsScreen';
import ViewScreen from './src/components/ViewScreen';

const tabConfig = [
  {
    name: "Home",
    component: HomeScreen,
    focusedIcon: 'home',
    unFocusedIcon: 'home-outline',
    iconComponent: Ionicons
  },
  {
    name: "Expenses",
    component: ViewScreen,
    focusedIcon: 'list-circle',
    unFocusedIcon: 'list-circle-outline',
    iconComponent: Ionicons,
  },
  {
    name: "Add",
    component: AddItemsScreen,
    focusedIcon: 'add-circle',
    unFocusedIcon: 'add-circle-outline',
    iconComponent: Ionicons,
  },
  {
    name: "Analytics",
    component: AnalyticsScreen,
    focusedIcon: 'chart-pie',
    unFocusedIcon: 'chart-pie',
    iconComponent: FontAwesome5,
  },
];

const App = () => {
  useEffect(() => {
    setTimeout(() => {
    SplashScreen.hide();
    },500)
  }, [])
  
  const Tab = createBottomTabNavigator();
  
  const screenOptions = ({ route }) => ({
    tabBarIcon: ({ focused, color, size }) => {
      const routeConfig = tabConfig.find(config => config.name === route.name);
      const iconName = focused ? routeConfig.focusedIcon : routeConfig.unFocusedIcon;
      const IconComponent = routeConfig.iconComponent;
      return <IconComponent name={iconName} size={size} color={color} />;
    },
    tabBarActiveTintColor: 'rgb(174, 190, 111)', 
    tabBarInactiveTintColor: '#6B7280',
    tabBarLabelStyle: {
      fontSize: 12,
      fontWeight: '500',
      paddingBottom: 5,
    },
    tabBarStyle: {
      height: 60,
      paddingTop: 5,
      borderTopWidth: 1,
      borderTopColor: '#F3F4F6',
      elevation: 8,
      shadowOpacity: 0.05,
      shadowRadius: 10,
    },
    headerShown: false,
  });

  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={screenOptions}>
        {tabConfig.map(route => (
          <Tab.Screen key={route.name} 
            name={route.name} 
            component={route.component} 
            options={{
              tabBarLabel: ({ focused }) => (
                <Text style={{
                  color: focused ? 'rgb(174, 190, 111)' : '#6B7280',
                  fontSize: 12,
                  fontWeight: focused ? '600' : '400',
                }}>
                  {route.name}
                </Text>
              )
            }}
          />
        ))}
      </Tab.Navigator>
    </NavigationContainer>
  );
};

export default App;