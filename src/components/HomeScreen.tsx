import { View, Text, ScrollView, TouchableOpacity, Image, SafeAreaView, StatusBar}from 'react-native';
import React, { useState, useEffect } from 'react';
import { s } from "react-native-wind";
import Ionicons from 'react-native-vector-icons/Ionicons';
import Logo from '../images/logo.png';
import { getData } from '../../backend';

const HomeScreen = ({ navigation }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [username, setUsername] = useState('User');
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    setIsLoading(true);
    getData((expenseData, total) => {
      setExpenses(expenseData);
      setTotalAmount(total);
      setRecentTransactions(expenseData.slice(0, 3)); // Get the 3 most recent transactions
      setIsLoading(false);
    });
  };

  // Get category icon
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

  // Format date for better display
  const formatDisplayDate = (timestamp) => {
    const date = new Date(timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }
  };

  // Quick actions data
  const quickActions = [
    { 
      title: 'Add\nExpense', 
      icon: 'add-circle', 
      color: 'bg-indigo-500', 
      onPress: () => navigation.navigate('Add') 
    },
    { 
      title: 'View\nAll', 
      icon: 'list', 
      color: 'bg-green-500', 
      onPress: () => navigation.navigate('Expenses') 
    },
    { 
      title: 'View\nStats', 
      icon: 'pie-chart', 
      color: 'bg-orange-500', 
      onPress: () => navigation.navigate('Analytics') 
    },
  ];

  // Tips data
  const tips = [
    "Track daily expenses to build better financial habits",
    "Create a monthly budget and stick to it",
    "Save at least 20% of your income each month",
    "Review your spending patterns weekly"
  ];

  return (
    <SafeAreaView style={s`flex-1 bg-white`}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      <ScrollView>
        <View style={s`flex-row justify-between items-center p-2 border-b border-gray-100`}>
          <View>
            <View style={s`flex-row items-center`}>
              <Image source={Logo} style={[s`ml-2 mr-2`, { width: 30, height: 30 }]} resizeMode="contain" />
              <Text style={[s`text-2xl font-bold`, { color: 'rgb(174, 190, 111)' }]}>लेखा</Text>
            </View>
            <Text style={s`text-gray-500 ml-3 text-xs mt-1`}>A Personalized Expense Manager</Text>
          </View>
        </View>

        <View style={s`p-4`}>
          <View style={[s`rounded-3xl p-6 shadow-lg mb-6`, { backgroundColor: '#BFA181' }]}>
            <Text style={[s`text-[#BFA181] font-bold mb-1`,{color: '#b20238'}]}>Total Spending</Text>
            <Text style={[s`text-white text-3xl font-bold mb-3`,{color: '#E7E8D1'}]}>Rs.{totalAmount}</Text>
            <View style={s`flex-row justify-between`}>
              <View style={s`py-1 rounded-xl`}>
                <Text style={s`text-xs text-white`}>Expenses</Text>
                <Text style={s`text-white text-xl font-bold`}>{expenses.length}</Text>
              </View>
              
              <TouchableOpacity 
                style={s`bg-white px-4 py-2 rounded-lg flex-row items-center`}
                onPress={() => navigation.navigate('Analytics')}
              >
                <Text style={s`text-indigo-700 font-medium mr-1`}>View Details</Text>
                <Ionicons name="arrow-forward" size={16} color="#4338CA" />
              </TouchableOpacity>
            </View>
          </View>
          
          <Text style={s`text-lg font-semibold text-gray-800 mb-3`}>Quick Actions</Text>
          <View style={s`flex-row justify-between mb-6`}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={s`items-center w-28 py-4 rounded-xl ${action.color}`}
                onPress={action.onPress}
              >
                <Ionicons name={action.icon} size={28} color="#FFFFFF" />
                <Text style={s`text-white text-center mt-2 font-medium text-sm`}>{action.title}</Text>
              </TouchableOpacity>
            ))}
          </View>
          
          <View style={s`mb-6`}>
            <View style={s`flex-row justify-between items-center mb-3`}>
              <Text style={s`text-lg font-semibold text-gray-800`}>Recent Transactions</Text>
              <TouchableOpacity onPress={() => navigation.navigate('Expenses')}>
                <Text style={s`text-indigo-600 font-medium`}>See All</Text>
              </TouchableOpacity>
            </View>
            
            {isLoading ? (
              <View style={s`bg-gray-50 rounded-xl p-4 items-center justify-center h-24`}>
                <Text style={s`text-gray-500`}>Loading transactions...</Text>
              </View>
            ) : recentTransactions.length === 0 ? (
              <View style={s`bg-gray-50 rounded-xl p-6 items-center justify-center`}>
                <Text style={s`text-gray-600 mb-2`}>No recent transactions</Text>
                <TouchableOpacity 
                  style={s`bg-indigo-100 px-4 py-2 rounded-lg`}
                  onPress={() => navigation.navigate('Add')}
                >
                  <Text style={s`text-indigo-600 font-medium`}>Add Your First Expense</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={s`bg-gray-50 rounded-xl overflow-hidden`}>
                {recentTransactions.map((item, index) => (
                  <TouchableOpacity 
                    key={item.id}
                    style={s`flex-row items-center p-4 ${index < recentTransactions.length - 1 ? 'border-b border-gray-200' : ''}`}
                  >
                    <View style={s`h-10 w-10 rounded-full bg-indigo-100 items-center justify-center mr-3`}>
                      <Text>{getCategoryIcon(item.category)}</Text>
                    </View>
                    <View style={s`flex-1`}>
                      <Text style={s`text-gray-800 font-medium`}>{item.description || item.category}</Text>
                      <Text style={s`text-gray-500 text-xs`}>{formatDisplayDate(item.timestamp)}</Text>
                    </View>
                    <Text style={s`text-gray-800 font-bold`}>Rs. {parseFloat(item.amount).toLocaleString()}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>

          <View style={[s`rounded-2xl p-5 shadow-sm mb-6`, { backgroundColor: '#F4B81A' }]}>
            <View style={s`flex-row items-center mb-3`}>
              <Text style={s`text-lg mr-2`}>💡</Text>
              <Text style={s`text-white font-bold text-lg`}>Tip of the Day</Text>
            </View>
            <Text style={s`text-white`}>{tips[Math.floor(Math.random() * tips.length)]}</Text>
          </View>

          {/* Budget Overview */}
          {/* <Text style={s`text-lg font-semibold text-gray-800 mb-3`}>Monthly Overview</Text>
          <View style={s`bg-gray-50 rounded-xl p-5 mb-6`}>
            <View style={s`flex-row justify-between items-center mb-4`}>
              <Text style={s`text-gray-600`}>Budget Status</Text>
              <View style={s`flex-row items-center`}>
                <Text style={s`text-gray-800 font-bold`}>{Math.min(totalAmount / 10000 * 100, 100).toFixed(0)}%</Text>
                <Text style={s`text-gray-500 ml-1`}>of Rs. 10,000</Text>
              </View>
            </View>
            
            <View style={s`h-3 bg-gray-200 rounded-full overflow-hidden mb-1`}>
              <View 
                style={[
                  s`h-full bg-indigo-500 rounded-full`, 
                  { width: `${Math.min(totalAmount / 10000 * 100, 100)}%` }
                ]} 
              />
            </View>
            
            <Text style={s`text-xs text-gray-500 text-right`}>
              {totalAmount >= 10000 ? 'Budget exceeded' : `Rs. ${(10000 - totalAmount).toLocaleString()} remaining`}
            </Text>
          </View> */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;