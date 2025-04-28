import { View, Text, ActivityIndicator, SafeAreaView, ScrollView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getExpensePercent } from '../../backend/capital';
import { getData } from '../../backend';
import { s } from "react-native-wind";
import PieChart from 'react-native-pie-chart';
import { useFocusEffect } from '@react-navigation/native';

const AnalyticsScreen = () => {
  const [percentages, setPercentages] = useState({
    food: 0,
    education: 0,
    housing: 0,
    health: 0,
    transportation: 0,
    entertainment: 0,
    other: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalExpense, setTotalExpense] = useState(0); // Added for showing total
  const [dataUpdated, setDataUpdated] = useState(false);

  useFocusEffect(
    
    React.useCallback(() => {
      const fetchData = async () => {
        try {
          setIsLoading(true);
          const categories = ['Food', 'Education', 'Housing', 'Health', 'Transportation', 'Entertainment', 'Other'];
          const newPercentages = {};
          getData((expenseData, total) => {
                setTotalExpense(total);
              });
          await Promise.all(
            categories.map(async (category) => {
              try {
                const percent = await getExpensePercent(category);
                newPercentages[category.toLowerCase()] = percent;
              } catch (err) {
                console.error(`Error fetching ${category} percentage:`, err);
                newPercentages[category.toLowerCase()] = 0;
              }
            })
          );
          
          Object.keys(newPercentages).forEach(key => {
            if (isNaN(newPercentages[key]) || newPercentages[key] === undefined) {
              newPercentages[key] = 0;
            }
          });
          
          setPercentages(newPercentages);
        } catch (err) {
          console.error('Error in data fetching:', err);
          setError('Failed to load expense data');
        } finally {
          setIsLoading(false);
        }
      };
      fetchData(); // Your data fetching function
    }, [])
  );
  // Updated color scheme for a more professional finance app look
  const categoryDetails = [
    { key: 'food', label: 'Food & Dining', color: '#FF6B6B', icon: '🍔' },
    { key: 'education', label: 'Education', color: '#4ECDC4', icon: '📚' },
    { key: 'housing', label: 'Housing & Rent', color: '#845EC2', icon: '🏠' },
    { key: 'health', label: 'Healthcare', color: '#FF9671', icon: '⚕️' },
    { key: 'transportation', label: 'Transportation', color: '#FFC75F', icon: '🚗' },
    { key: 'entertainment', label: 'Entertainment', color: '#008F7A', icon: '🎬' },
    { key: 'other', label: 'Other Expenses', color: '#C34A36', icon: '📋' },
  ];

  const series = categoryDetails.map(cat => ({
    value: percentages[cat.key],
    color: cat.color
  }));

  // Check if we have any data to display
  const hasData = series.some(item => item.value > 0);

  if (error) {
    return (
      <SafeAreaView style={s`flex-1 bg-white`}>
        <View style={s`flex-1 justify-center items-center p-4`}>
          <Text style={s`text-xl text-red-500 font-medium`}>{error}</Text>
          <Text style={s`text-base text-gray-500 mt-2`}>Please try again later</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={s`flex-1 bg-white`}>
      <ScrollView contentContainerStyle={s`flex-grow`}>
        <View style={s`flex-1 px-4 py-6`}>

          <View style={s`mb-6 px-2`}>
            <Text style={s`text-3xl font-bold text-gray-800`}>Spending Analytics</Text>
            <Text style={s`text-base text-gray-500 mt-1`}>Track where your money goes</Text>
          </View>

          <View style={s`flex-1 items-center justify-center`}>
            {isLoading ? (
              <View style={s`py-16 items-center`}>
                <ActivityIndicator size="large" color="#6366F1" />
                <Text style={s`mt-4 text-gray-600`}>Loading your expense data...</Text>
              </View>
            ) : !hasData ? (
              <View style={s`py-16 items-center px-4`}>
                <Text style={s`text-xl text-gray-600 text-center`}>No expense data available for this month</Text>
                <Text style={s`mt-2 text-gray-500 text-center`}>Start tracking your expenses to see insights here</Text>
              </View>
            ) : (
              <>
                {/* Total Expense Card */}
                <View style={s`w-full bg-indigo-50 rounded-xl p-4 mb-6`}>
                  <Text style={s`text-gray-600 mb-1`}>Total Monthly Expenses</Text>
                  <Text style={s`text-3xl font-bold text-indigo-700`}>Rs.{totalExpense.toLocaleString()}</Text>
                </View>

                {/* Chart Section */}
                <View style={s`w-full items-center mb-6`}>
                  <View style={s`w-64 h-64 mb-2`}>
                    <PieChart
                      widthAndHeight={250}
                      series={series}
                      cover={0.6}
                      padAngle={0.04}
                    />
                  </View>
                </View>

                {/* Legend Section */}
                <View style={s`w-full bg-gray-50 rounded-xl p-4`}>
                  <Text style={s`text-lg font-semibold text-gray-800 mb-3`}>Expense Breakdown</Text>
                  
                  {categoryDetails.map((category, index) => {
                    const percent = percentages[category.key];
                    if (percent <= 0) return null;
                    
                    return (
                      <View key={category.key} style={s`flex-row items-center justify-between py-3 border-b border-gray-200`}>
                        <View style={s`flex-row items-center`}>
                         <View style={[s`w-6 h-6 rounded-full flex items-center justify-center mr-3`, { backgroundColor: category.color }]}>
                            <Text>{category.icon}</Text>
                          </View>
                          <Text style={s`text-base text-gray-800`}>{category.label}</Text>
                        </View>
                        <View>
                          <Text style={s`text-base font-medium text-gray-800`}>{percent.toFixed(1)}%</Text>
                          <Text style={s`text-xs text-gray-500`}>
                            Rs.{Math.round(totalExpense * (percent / 100))}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              </>
            )}
          </View>
          
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default AnalyticsScreen;