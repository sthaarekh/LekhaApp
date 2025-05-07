import { View, Text, TextInput, TouchableOpacity, Modal, SafeAreaView, FlatList, StyleSheet, Alert,KeyboardAvoidingView,Platform,ScrollView} from 'react-native';
import { s } from "react-native-wind";
import React, {useEffect, useState} from 'react';
import { createTable, insertData } from '../../backend';

const AddItemsScreen = ({onItemAdded}) => {
  useEffect(() => {
    createTable();
  }, []);

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Category');
  const [mode, setMode] = useState('Payment Method');
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);
  const [modeModalVisible, setModeModalVisible] = useState(false);

  const categories = ['Food', 'Education', 'Housing', 'Health', 'Transportation', 'Entertainment', 'Other'];
  const modes = ['Self','Other'];

  const getCategoryIcon = (category) => {
    const icons = {
      'Food': '🍔',
      'Education': '📚',
      'Housing': '🏠',
      'Health': '⚕️',
      'Transportation': '🚗',
      'Entertainment': '🎬',
      'Other': '📋',
    };
    
    return icons[category] || '💰';
  };
  
  const getPaymentIcon = (mode) => {
    const icons = {
      'Self': '📱',
      'Other': '🤑',
    };
    return icons[mode] || '💲';
  };

  const handleAddItem = () => {
    if (Number(amount) < 0) {
      Alert.alert('Amount is negative');
      return;
    }
    if (!amount || category === 'Category' || mode === 'Payment Method') {
      Alert.alert('Missing Information', 'Please fill in all required fields');
      return;
    }
    
    insertData(category, description, amount, mode, (success) => {
      if (success) {
        Alert.alert(
          'Success',
          'Expense added successfully!',
          [
            {
              text: 'Add Another',
              onPress: () => {
                // Clear form
                setAmount('');
                setDescription('');
                setCategory('Category');
                setMode('Payment Method');
              },
              style: 'cancel',
            },
            {
              text: 'View All',
              onPress: () => {
                // Clear form and switch to view screen
                setAmount('');
                setDescription('');
                setCategory('Category');
                setMode('Payment Method');
                if (onItemAdded) onItemAdded();
              }
            },
          ]
        );
      }
    });
  };

  const CustomDropdown = ({ value, placeholder, onPress, icon }) => (
    <TouchableOpacity 
      style={s`flex-row items-center justify-between border border-gray-200 rounded-xl px-4 h-14 bg-white ${value !== placeholder ? 'border-indigo-300' : ''}`}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={s`flex-row items-center`}>
        {icon && (
          <Text style={s`mr-2 text-lg`}>{icon}</Text>
        )}
        <Text style={s`${value === placeholder ? 'text-gray-400' : 'text-gray-800 font-medium'}`}>
          {value}
        </Text>
      </View>
      <Text style={s`text-gray-400`}>▼</Text>
    </TouchableOpacity>
  );

  const SelectionModal = ({ visible, onClose, items, onSelect, title, getIcon }) => (
    <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
      <SafeAreaView style={s`flex-1 justify-end bg-black/50`}>
        <View style={s`bg-white rounded-t-3xl p-6 max-h-[70%]`}>
          <View style={s`flex-row justify-between items-center mb-6`}>
            <Text style={s`text-2xl font-bold text-gray-800`}>{title}</Text>
            <TouchableOpacity onPress={onClose} style={s`h-8 w-8 items-center justify-center rounded-full bg-gray-100`}>
              <Text style={s`text-gray-500 font-bold`}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <FlatList 
            data={items} 
            keyExtractor={(item) => item}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={s`flex-row items-center p-4 border-b border-gray-100 active:bg-gray-50`}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                {getIcon && (
                  <Text style={s`mr-3 text-xl`}>{getIcon(item)}</Text>
                )}
                <Text style={s`text-base text-gray-700`}>{item}</Text>
              </TouchableOpacity>
            )}
            contentContainerStyle={s`pb-6`}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );

  return(
    <SafeAreaView style={s`flex-1 bg-white`}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={s`flex-1`}
      >
        <ScrollView contentContainerStyle={s`flex-grow`}>
          <View style={s`flex-1 p-4`}>
            {/* Header */}
            <View style={s`mb-4`}>
              <Text style={s`text-3xl font-bold text-gray-800 mb-1`}>Add Expense</Text>
              <Text style={s`text-base text-gray-500`}>Record your spending details</Text>
            </View>
            
            <View style={s`bg-gray-50 p-5 rounded-xl mb-6`}>
              <Text style={s`text-gray-500 mb-2 text-sm`}>AMOUNT</Text>
              <View style={s`flex-row items-center`}>
                <Text style={s`text-2xl font-bold text-gray-700 mr-2`}>Rs.</Text>
                <TextInput
                  style={s`text-2xl font-bold text-gray-800 flex-1`}
                  placeholder="0.00"
                  placeholderTextColor="#A3A3A3"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="numeric"
                />
              </View>
            </View>
            
            <View style={s`mb-4`}>
              <Text style={s`text-sm font-medium text-gray-500 mb-2 ml-1`}>DESCRIPTION</Text>
              <TextInput
                style={s`h-14 border border-gray-200 rounded-xl px-4 bg-white text-gray-800 mb-4`}
                placeholder="What was this expense for?"
                placeholderTextColor="#A3A3A3"
                value={description}
                onChangeText={setDescription}
              />
              
              <Text style={s`text-sm font-medium text-gray-500 mb-2 ml-1`}>CATEGORY</Text>
              <CustomDropdown
                value={category}
                placeholder="Category"
                onPress={() => setCategoryModalVisible(true)}
                icon={category !== 'Category' ? getCategoryIcon(category) : null}
              />
              
              <Text style={s`text-sm font-medium text-gray-500 mb-2 ml-1 mt-4`}>PAYMENT METHOD</Text>
              <CustomDropdown
                value={mode}
                placeholder="Payment Method"
                onPress={() => setModeModalVisible(true)}
                icon={mode !== 'Payment Method' ? getPaymentIcon(mode) : null}
              />
            </View>
            
            <TouchableOpacity
              style={s`h-14 rounded-xl items-center justify-center mt-4 bg-indigo-600 shadow-sm`}
              onPress={handleAddItem}
              activeOpacity={0.8}
            >
              <Text style={s`text-white font-bold text-base`}>Save Expense</Text>
            </TouchableOpacity>
            
            <View style={s`flex-row items-center mt-6 bg-yellow-50 p-4 rounded-xl`}>
              <Text style={s`text-lg mr-2`}>💡</Text>
              <Text style={s`text-gray-700 text-sm`}>
                Regular expense tracking helps you identify spending patterns and save more.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      
      <SelectionModal
        visible={categoryModalVisible}
        onClose={() => setCategoryModalVisible(false)}
        items={categories}
        onSelect={setCategory}
        title="Select Category"
        getIcon={getCategoryIcon}
      />
      
      <SelectionModal
        visible={modeModalVisible}
        onClose={() => setModeModalVisible(false)}
        items={modes}
        onSelect={setMode}
        title="Select Payment Method"
        getIcon={getPaymentIcon}
      />
    </SafeAreaView>
  );
};

export default AddItemsScreen;