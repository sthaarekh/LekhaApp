import { View, Text, FlatList } from 'react-native'
import React, { useState, useEffect } from 'react'
import { s } from "react-native-wind";
import { getData, formatDate } from '../../backend';

const ViewScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);

  useEffect(() => {
    loadExpenses();
  }, [])
  
  const loadExpenses = () => {
    setIsLoading(true);
    getData((expenseData, total) => {
      setExpenses(expenseData);
      setTotalAmount(total);
      setIsLoading(false);
    });
  };

  const renderExpenseItem = ({item}) => (
    <View style={s`bg-white p-4 mb-4 rounded-lg shadow`}>
      <View style={s`flex-row justify-between items-center mb-2`}>
        <View style={s`bg-blue-100 px-3 py-1 rounded-full`}>
          <Text style={s`text-blue-600 text-sm font-semibold`}>{item.category}</Text>
        </View>
        <Text style={s`text-green-600 font-bold text-lg`}>Rs.{item.amount}</Text>
      </View>

      <Text style={s`text-gray-600 mb-2`}>{item.description || 'No description'}</Text>

      <View style={s`flex-row justify-between items-center`}>
        <Text style={s`text-gray-400 text-xs`}>{formatDate(item.timestamp)}</Text>
        <View style={s`bg-green-100 px-3 py-1 rounded-full`}>
          <Text style={s`text-green-600 text-xs font-semibold`}>{item.payment_mode}</Text>
        </View>
      </View>

    </View>
  );


  return (
    <View style={s`flex-1 bg-gray-100 p-4`}>
      <View style={s`bg-white p-4 rounded-lg shadow mb-4`}>
        <Text style={s`text-xl font-bold text-gray-800 mb-1`}>Expense Summary</Text>
        <Text style={s`text-2xl font-bold text-green-600 mb-1`}>Rs.{totalAmount}</Text>
        <Text style={s`text-gray-500`}>{expenses.length} transactions</Text>
      </View>

      <Text style={s`text-lg font-semibold text-gray-700 mb-2`}>Recent Expenses</Text>

      {isLoading ? (
        <View style={s`flex-1 justify-center items-center`}>
          <Text style={s`text-gray-500`}>Loading expenses...</Text>
        </View>
      ) : false ? (
        <View style={s`flex-1 justify-center items-center`}>
          <Text style={s`text-gray-500`}>No expenses added yet</Text>
        </View>
      ):(
        <FlatList
        data={expenses}
        renderItem={renderExpenseItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={{ paddingBottom: 20 }}
        refreshing={isLoading}
        onRefresh={loadExpenses}
        showsVerticalScrollIndicator={false}
      />
      // <View>Hello</View>
      )}
    </View>
  )
}

export default ViewScreen