import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import React, { useState, useEffect } from 'react';
import { s } from "react-native-wind";
import { getData, formatDate } from '../../backend';
import Ionicons from 'react-native-vector-icons/Ionicons';

const ViewScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [groupedExpenses, setGroupedExpenses] = useState({});

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    setIsLoading(true);
    getData((expenseData, total) => {
      setExpenses(expenseData);
      setTotalAmount(total);
      
      // Group expenses by date for better organization
      const grouped = expenseData.reduce((groups, expense) => {
        const date = formatDate(expense.timestamp).split(',')[0]; // Just get the date part
        if (!groups[date]) {
          groups[date] = [];
        }
        groups[date].push(expense);
        return groups;
      }, {});
      
      setGroupedExpenses(grouped);
      setIsLoading(false);
    });
  };
  
  // Get category-specific icon and color
  const getCategoryStyle = (category) => {
    const styles = {
      'Food': { icon: '🍔', color: 'bg-orange-100 text-orange-600' },
      'Education': { icon: '📚', color: 'bg-blue-100 text-blue-600' },
      'Housing': { icon: '🏠', color: 'bg-indigo-100 text-indigo-600' },
      'Health': { icon: '⚕️', color: 'bg-red-100 text-red-600' },
      'Transportation': { icon: '🚗', color: 'bg-yellow-100 text-yellow-600' },
      'Entertainment': { icon: '🎬', color: 'bg-purple-100 text-purple-600' },
      'Other': { icon: '📋', color: 'bg-gray-100 text-gray-600' },
    };
    
    return styles[category] || { icon: '💰', color: 'bg-green-100 text-green-600' };
  };

  const renderExpenseItem = ({ item }) => {
    const categoryStyle = getCategoryStyle(item.category);
    const colorClasses = categoryStyle.color.split(' ');
    const bgClass = colorClasses[0];
    const textClass = colorClasses[1];
    
    return (
      <TouchableOpacity 
        activeOpacity={0.7}
        style={s`bg-white p-4 mb-3 rounded-xl shadow-sm border border-gray-100`}
      >
        <View style={s`flex-row justify-between items-center mb-2`}>
          <View style={s`flex-row items-center`}>
            <View style={s`${bgClass} w-8 h-8 rounded-full items-center justify-center mr-2`}>
              <Text>{categoryStyle.icon}</Text>
            </View>
            <View>
              <Text style={s`font-bold text-gray-600 text-base`}>{item.description || 'Expense'}</Text>
              <Text style={s`${textClass} text-xs font-medium`}>{item.category}</Text>
            </View>
          </View>
          <Text style={s`text-lg font-bold text-green-600`}>Rs. {item.amount}</Text>
        </View>
        
        <View style={s`flex-row justify-between items-center mt-2 pt-2 border-t border-gray-100`}>
          <Text style={s`text-gray-500 text-xs`}>{formatDate(item.timestamp)}</Text>
          <View style={s`flex-row items-center`}>
            <Text style={s`text-gray-600 text-xs font-medium`}>{item.payment_mode}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };
  
  const renderDateHeader = (date) => (
    <View style={s`flex-row items-center mb-2 mt-4`}>
      <View style={s`w-2 h-2 bg-indigo-500 rounded-full mr-2`}></View>
      <Text style={s`text-sm font-medium text-gray-500`}>{date}</Text>
    </View>
  );

  const renderSectionList = () => {
    const dates = Object.keys(groupedExpenses).sort((a, b) => 
      new Date(b) - new Date(a) // Sort dates in descending order
    );
    
    return dates.map(date => (
      <View key={date}>
        {renderDateHeader(date)}
        {groupedExpenses[date].map(expense => (
          <View key={expense.id}>
            {renderExpenseItem({ item: expense })}
          </View>
        ))}
      </View>
    ));
  };

  // Calculate total count for current month
  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  return (
    <SafeAreaView style={s`flex-1 bg-gray-50`}>
      <View style={s`flex-1 px-4 pt-4 pb-2`}>
        {/* Header */}
        <View style={s`mb-4`}>
          <Text style={s`text-3xl font-bold text-gray-800`}>Expenses</Text>
          <Text style={s`text-base text-gray-500`}>Track & manage your spending</Text>
        </View>
        
        {/* Summary Card */}
        <View style={s`bg-lime-600 p-5 rounded-xl shadow-md mb-6`}>
          <Text style={s`text-indigo-100 mb-1`}>{currentMonth} {currentYear} Total</Text>
          <Text style={s`text-3xl font-bold text-white mb-1`}>Rs.{totalAmount}</Text>
          <View style={s`flex-row items-center mt-1`}>
            <Text style={s`text-indigo-100`}>{expenses.length} transactions</Text>
          </View>
        </View>
        
        {/* Transaction List */}
        <View style={s`flex-1`}>
          <View style={s`flex-row justify-between items-center mb-4`}>
            <Text style={s`text-lg font-semibold text-gray-800`}>Recent Transactions</Text>
          </View>
          
          {isLoading ? (
            <View style={s`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={s`text-gray-500 mt-4`}>Loading your expenses...</Text>
            </View>
          ) : expenses.length === 0 ? (
            <View style={s`flex-1 justify-center items-center py-12`}>
              <View style={s`w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-4`}>
                <Text style={s`text-2xl`}>📋</Text>
              </View>
              <Text style={s`text-lg font-medium text-gray-600 mb-2`}>No expenses yet</Text>
              <Text style={s`text-gray-500 text-center px-6`}>
                Add your first expense to start tracking your spending
              </Text>
            </View>
          ) : (
            <FlatList
              data={expenses}
              renderItem={renderExpenseItem}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ paddingBottom: 100 }}
              refreshing={isLoading}
              onRefresh={loadExpenses}
              showsVerticalScrollIndicator={false}
              ListFooterComponent={<View style={s`h-10`} />}
            />
          )}
        </View>
      </View>
    </SafeAreaView>
  );
};

export default ViewScreen;