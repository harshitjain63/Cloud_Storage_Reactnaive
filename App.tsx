import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import FileManagerScreen from './screens/FileManagerScreen';
import ConfigurationScreen from './screens/ConfigurationScreen';
import AwsFileManager from './screens/AwsFileManager';
import AzureFileManager from './screens/AzureFileManager';
import AnimationScreen from './screens/AnimationScreen';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import SwipeAnimation from './screens/SwipeAnimation';
import PinchGesture from './screens/PinchGesture';
import TapAnimationScreen from './screens/TapAnimationScreen';
import ListAnimation from './screens/ListAnimation';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  FileManager: {service: string};
  Configuration: {service: string};
  AwsFileManager: {service: string};
  AzureFileManager: {service: string};
  Animation: undefined;
  SwipeAnimation: undefined;
  PinchAnimation: undefined;
  TapAnimation: undefined;
  ListAnimation: undefined;
};

const App = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      {/* content */}

      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{title: 'Home'}}
          />
          <Stack.Screen
            name="FileManager"
            component={FileManagerScreen}
            options={{title: 'FileManager'}}
          />
          <Stack.Screen
            name="Configuration"
            component={ConfigurationScreen}
            options={{title: 'Configuration'}}
          />
          <Stack.Screen
            name="AwsFileManager"
            component={AwsFileManager}
            options={{title: 'FileManager'}}
          />
          <Stack.Screen
            name="AzureFileManager"
            component={AzureFileManager}
            options={{title: 'FileManager'}}
          />
          <Stack.Screen
            name="Animation"
            component={AnimationScreen}
            options={{title: 'Animation Screen'}}
          />
          <Stack.Screen
            name="SwipeAnimation"
            component={SwipeAnimation}
            options={{title: 'Swipe Animation Screen'}}
          />
          <Stack.Screen
            name="PinchAnimation"
            component={PinchGesture}
            options={{title: 'PinchGesture Animation Screen'}}
          />
          <Stack.Screen
            name="TapAnimation"
            component={TapAnimationScreen}
            options={{title: 'TapGesture Animation Screen'}}
          />
          <Stack.Screen
            name="ListAnimation"
            component={ListAnimation}
            options={{title: 'List Animation Screen'}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

export default App;
