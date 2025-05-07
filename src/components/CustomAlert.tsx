import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Platform } from 'react-native';
import { s } from "react-native-wind";


let BlurView;
try {
  BlurView = require('@react-native-community/blur').BlurView;
} catch (e) {
  // Fallback if BlurView is not available
  BlurView = ({ children, style }) => (
    <View style={[style, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
      {children}
    </View>
  );
}

const CustomAlert = ({ visible, title, message, buttons, icon }) => {
  const renderAlertContent = () => (
    <View style={s`flex-1 justify-center items-center px-4`}>
      <View style={s`bg-white w-full max-w-md rounded-2xl shadow-lg overflow-hidden border border-red-500`}>
        {/* Header with color bar */}
        <View style={s`h-2 w-full`} />
        
        {/* Alert content */}
        <View style={s`p-6 items-center`}>
          {/* Icon */}
          <View style={s`w-16 h-16 bg-indigo-100 rounded-full items-center justify-center mb-4`}>
            <Text style={s`text-3xl`}>{icon || '✓'}</Text>
          </View>
          
          {/* Title */}
          <Text style={s`text-xl font-bold text-gray-800 mb-2 text-center`}>{title}</Text>
          
          {/* Message */}
          <Text style={s`text-gray-600 mb-6 text-center`}>{message}</Text>
          
          {/* Buttons */}
          <View style={s`w-full flex-row justify-between`}>
            {buttons.map((button, index) => (
              <TouchableOpacity
                key={index}
                style={s`${button.primary ? 'bg-indigo-600' : 'bg-gray-100'} 
                  py-3 px-4 rounded-xl 
                  ${buttons.length === 1 ? 'flex-1' : 'flex-1 mx-1'}`}
                onPress={button.onPress}
              >
                <Text 
                  style={s`${button.primary ? 'text-white' : 'text-gray-700'} 
                    font-medium text-center`}
                >
                  {button.text}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      {Platform.OS === 'ios' && BlurView !== undefined ? (
        <BlurView
          style={StyleSheet.absoluteFill}
          blurType="dark"
          blurAmount={10}
        >
          {renderAlertContent()}
        </BlurView>
      ) : (
        // Android or other platforms - use a semi-transparent background
        <View style={[StyleSheet.absoluteFill, { backgroundColor: 'rgba(0,0,0,0.7)' }]}>
          {renderAlertContent()}
        </View>
      )}
    </Modal>
  );
};

export default CustomAlert;