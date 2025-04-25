import React, {useEffect, useState} from 'react'
import { View, Text, TouchableOpacity, StyleSheet,SafeAreaView} from 'react-native';
import { s } from "react-native-wind";
import AddItemsScreen from './AddItemsScreen';
import ViewScreen from './ViewScreen';
import SplashScreen from 'react-native-splash-screen';

const HomeScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('add'); // 'add' or 'view'
  useEffect(() => {
    setTimeout(() => {
    SplashScreen.hide();
    },500)
  }, [])
  
  return (
    <SafeAreaView style={s`flex-1 bg-white`}>
    <View style={s`flex-row bg-white shadow shadow-black shadow-opacity-10 shadow-radius-2 elevation-2`}>
      <TouchableOpacity 
        style={s`flex-1 p-4 items-center justify-center border-b-2 ${currentScreen === 'add' ? 'border-b-[#a3b9c9]' : 'border-b-transparent'}`}
        onPress={() => setCurrentScreen('add')}
      >
        <Text style={s`text-black text-base font-medium`}>Add Items</Text>
      </TouchableOpacity>
      <TouchableOpacity 
        style={s`flex-1 p-4 items-center justify-center border-b-2 ${currentScreen === 'view' ? 'border-b-[#a3b9c9]' : 'border-b-transparent'}`}
        onPress={() => setCurrentScreen('view')}
      >
        <Text style={s`text-black text-base font-medium`}>View Expenses</Text>
      </TouchableOpacity>
    </View>

    {currentScreen === 'add' ? (
      // <AddItemsScreen onItemAdded={() => setCurrentScreen('view')} />
      <AddItemsScreen/>
    ) : (
      <ViewScreen/>
    )}
  </SafeAreaView>
  )
}

export default HomeScreen