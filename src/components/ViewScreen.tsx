import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, SafeAreaView, ActivityIndicator, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { s } from 'react-native-wind';
import { getData, formatDate, addExpense } from '../../backend'; 
import Ionicons from 'react-native-vector-icons/Ionicons';

const ViewScreen = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [expenses, setExpenses] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showCalendar, setShowCalendar] = useState(false);

  useEffect(() => {
    loadExpenses();
  }, []);

  const loadExpenses = () => {
    setIsLoading(true);
    getData((expenseData, total) => {
      setExpenses(expenseData);
      setTotalAmount(total);
      setIsLoading(false);
    });
  };

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

  const getExpensesForDate = (date) => {
    if (!date) return expenses; // If no date selected, return all expenses
  
    return expenses.filter((expense) => {
      const expenseDate = expense.timestamp.split(' ')[0]; // Get 'YYYY-MM-DD'
      return expenseDate === date;
    });
  };
  
  const getTotalForDate = (date) => {
    const filtered = getExpensesForDate(date);
    return filtered.reduce((sum, expense) => sum + Number(expense.amount), 0);
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

  const currentMonth = new Date().toLocaleString('default', { month: 'long' });
  const currentYear = new Date().getFullYear();

  return (
    <SafeAreaView style={s`flex-1 bg-gray-50`}>
      <View style={s`flex-1 px-4 pt-4 pb-2`}>
        <View style={s`mb-4`}>
          <Text style={s`text-3xl font-bold text-gray-800`}>Expenses</Text>
          <Text style={s`text-base text-gray-500`}>Track & manage your spending</Text>
        </View>

        <View style={s`bg-lime-600 p-5 rounded-xl shadow-md mb-4`}>
          <Text style={s`text-indigo-100 mb-1`}>{currentMonth} {currentYear} Total</Text>
          <Text style={s`text-3xl font-bold text-white mb-1`}>Rs.{totalAmount}</Text>
          <View style={s`flex-row items-center mt-1`}>
            <Text style={s`text-indigo-100`}>{expenses.length} transactions</Text>
          </View>
        </View>

        <TouchableOpacity
          style={s`bg-indigo-300 px-5 py-3 rounded-2xl mb-3 flex-row items-center justify-center`}
          onPress={() => setShowCalendar(true)}>
          <Ionicons name="calendar-outline" size={20} color="white" />
          <Text style={s`text-white text-base font-semibold ml-2`}>View Individual Day</Text>
        </TouchableOpacity>

        {showCalendar && (
          <View style={s`mb-4`}>
            <Calendar
            onDayPress={day => {
              setSelectedDate(day.dateString);
              setShowCalendar(false); // Hide calendar after selection
            }}
            markedDates={
              selectedDate
                ? { [selectedDate]: { selected: true, selectedColor: '#4F46E5' } }
                : {}
            }
            theme={{
              selectedDayBackgroundColor: '#4F46E5',
              todayTextColor: '#10B981',
              arrowColor: '#4F46E5',
              textSectionTitleColor: '#64748b',
              textDayFontWeight: '500',
            }}
            maxDate={new Date().toISOString().split('T')[0]} 
          />
           <TouchableOpacity
              style={s`mt-2 ml-auto px-2 py-1 rounded bg-red-500 w-20 items-center`}
              onPress={() => setShowCalendar(false)}
              activeOpacity={0.8}>
              <Text style={s`text-white text-xs font-semibold`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        )}

        {selectedDate && (
          <View style={s`bg-indigo-100 p-4 rounded-xl mb-4`}>
            <View style={s`flex-row justify-between items-center`}>
              <Text style={s`text-gray-700 font-medium mb-1`}>
                {selectedDate} Summary
              </Text>
              <TouchableOpacity
                style={s`px-2 py-1 rounded bg-gray-200`}
                onPress={() => setSelectedDate(null)}
              >
                <Text style={s`text-gray-700 text-xs`}>Clear Filter</Text>
              </TouchableOpacity>
            </View>
            <Text style={s`text-2xl font-bold text-indigo-700 mb-1`}>
              Rs. {getTotalForDate(selectedDate)}
            </Text>
            <Text style={s`text-gray-600`}>
              {getExpensesForDate(selectedDate).length} transactions
            </Text>
          </View>
        )}

        <View style={s`flex-1`}>
          <View style={s`flex-row justify-between items-center mb-4`}>
            <Text style={s`text-lg font-semibold text-gray-800`}>
              {selectedDate ? "Expenses for selected day" : "Recent Transactions"}
            </Text>
          </View>

          {isLoading ? (
            <View style={s`flex-1 justify-center items-center`}>
              <ActivityIndicator size="large" color="#4F46E5" />
              <Text style={s`text-gray-500 mt-4`}>Loading your expenses...</Text>
            </View>
          ) : getExpensesForDate(selectedDate).length === 0 ? (
            <View style={s`flex-1 justify-center items-center py-12`}>
              <View style={s`w-16 h-16 bg-gray-200 rounded-full items-center justify-center mb-4`}>
                <Text style={s`text-2xl`}>📋</Text>
              </View>
              <Text style={s`text-lg font-medium text-gray-600 mb-2`}>
                {selectedDate ? "No expenses for this day" : "No expenses yet"}
              </Text>
              <Text style={s`text-gray-500 text-center px-6`}>
                Add an expense for this date to see it here.
              </Text>
            </View>
          ) : (
            <FlatList
              data={getExpensesForDate(selectedDate)}
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
