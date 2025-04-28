import { View, Text, TextInput, TouchableOpacity, Modal, SafeAreaView, FlatList, StyleSheet, Alert } from 'react-native'
import { s } from "react-native-wind";
import React, {useEffect, useState} from 'react'
import { createTable, insertData } from '../../backend';

const AddItemsScreen = ({onItemAdded}) => {
    useEffect(() => {
      createTable();
    }, [])
    

    const [amount, setAmount] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState('Category');
    const [mode, setMode] = useState('Mode');
    
    const [categoryModalVisible, setCategoryModalVisible] = useState(false);
    const [modeModalVisible, setModeModalVisible] = useState(false);
    
    const categories = ['Food','Education','Housing','Health', 'Transportation','Entertainment','Other'];
    const modes = ['Mode','Self','Others'];

    const handleAddItem=()=>{
      if (!amount || category === 'Category' || mode === 'Mode') {
        Alert.alert('Missing Information', 'Please fill in all required fields');
        return;
      }

      insertData(category, description, amount, mode, (success) => {
        if (success) {
          Alert.alert('Success','Item added successfully!',
            [
              {
              text: 'Add Another',
                onPress: () => {
                  // Clear form
                  setAmount('');
                  setDescription('');
                  setCategory('Category');
                  setMode('Mode');
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
                  setMode('Mode');
                  if (onItemAdded) onItemAdded();
                } 
              },
            ]
          );
        }
      });
    }
    

    const CustomDropdown = ({ value, onPress }) => (
        <TouchableOpacity style={s`flex-row items-center justify-between border border-[#ddd] rounded-lg px-3 h-12 bg-white w-[48%]`}onPress={onPress}>
          <Text style={s`value === 'Category' || value === 'Mode' 
            ? 'text-[#777]' 
            : 'text-black font-medium'`}>
            {value}
          </Text>
          <Text style={s`text-[#777]`}>▼</Text>
        </TouchableOpacity>
      );
      
      const SelectionModal = ({ visible, onClose, items, onSelect, title }) => (
        <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={onClose}>
          <SafeAreaView style={s`flex-1 justify-end bg-black/50`}>
            <View style={s`bg-white rounded-t-2xl p-5 max-h-[70%]`}>
              <Text style={s`text-xl font-semibold text-gray-800 mb-4`}>{title}</Text>
      
              <FlatList data={items} keyExtractor={(item) => item}renderItem={({ item }) => (
                  <TouchableOpacity style={s`p-4 border-b border-gray-200`}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                  >
                    <Text style={s`text-base text-gray-700`}>{item}</Text>
                  </TouchableOpacity>
                )}
              />
      
             <TouchableOpacity style={[s`mt-4 rounded-xl py-3 items-center`, styles.bg]} onPress={onClose}>
                <Text style={s`text-gray-800 font-medium`}>Close</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </Modal>
      );
      

  return(
    <View style={s`flex-1 p-4 bg-[#f9f9f9]`}>
        <Text style={s`text-2xl font-bold mb-5 text-[#333]`}>Add New Expense</Text>

        <View style={s`flex-row mb-4 justify-between`}>
            <TextInput
            style={[s`flex-1 h-12 border rounded-lg px-3 bg-white mr-2 text-black`]}
            placeholder="Amount"
            placeholderTextColor="#777"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            />
            
            <CustomDropdown 
            value={category} 
            onPress={() => setCategoryModalVisible(true)} 
            />
        </View>

        <View style={s`flex-row mb-4 justify-between`}>
            <TextInput
            style={s`flex-1 h-12 border border-[#ddd] rounded-lg px-3 bg-white mr-2 text-black`}
            placeholder="Description"
            placeholderTextColor="#777"
            value={description}
            onChangeText={setDescription}
            />
            
            <CustomDropdown 
            value={mode} 
            onPress={() => setModeModalVisible(true)} 
            />
        </View>

        <TouchableOpacity 
            style={[s` h-12 rounded-lg items-center justify-center mt-2`,styles.bg]}
            onPress={handleAddItem}>
            <Text style={s`text-white font-bold text-base`}>Add Expense</Text>
        </TouchableOpacity>

        {/* Category Selection Modal */}
        <SelectionModal
            visible={categoryModalVisible}
            onClose={() => setCategoryModalVisible(false)}
            items={categories}
            onSelect={setCategory}
            title="Select Category"
        />

        {/* Mode Selection Modal */}
        <SelectionModal
            visible={modeModalVisible}
            onClose={() => setModeModalVisible(false)}
            items={modes}
            onSelect={setMode}
            title="Select Payment Mode"
            titleStyle={{ color: '#a3b9c9' }}
        />
    </View>

  )
}

export default AddItemsScreen

const styles = StyleSheet.create({
    bg: {
      backgroundColor: "#ACBE6F",
    },
    borderbg:{
        borderColor: 'green'
    }
  });