import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
import FileManagerScreen from './screens/FileManagerScreen';
import ConfigurationScreen from './screens/ConfigurationScreen';
import AwsFileManager from './screens/AwsFileManager';
import AzureFileManager from './screens/AzureFileManager';

const Stack = createNativeStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  FileManager: {service: string};
  Configuration: {service: string};
  AwsFileManager: {service: string};
  AzureFileManager: {service: string};
};

const App = () => {
  return (
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
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
