import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  Alert,
  StyleSheet,
  FlatList,
  TextInput,
  ActivityIndicator,
  Modal,
  TouchableOpacity,
} from 'react-native';
import {loadConfiguration} from '../utils/storage';
import axios from 'axios';
import * as DocumentPicker from 'react-native-document-picker';
import {useNavigation} from '@react-navigation/native';

const FileManagerScreen = () => {
  const [configured, setConfigured] = useState(false);
  const [serviceName] = useState('Wasabi');
  const [file, setFiles] = useState([]);
  const [folder, setFolders] = useState([]);
  const [currentPath, setCurrentPath] = useState('');
  const [folderName, setFolderName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const navigation = useNavigation();

  const handleOptionSelect = screen => {
    setModalVisible(false);
    navigation.navigate(screen);
  };

  useEffect(() => {
    loadConfiguration(serviceName).then(config => {
      if (config) {
        setConfigured(true);
      } else {
        Alert.alert('Error', 'Please configure AWS S3 first');
      }
    });
  }, [serviceName]);

  useEffect(() => {
    fetchFilesFolders();
  }, [currentPath]);

  const navigateTo = foldername => {
    setCurrentPath(prevPath => prevPath + foldername);
  };

  const fetchFilesFolders = async () => {
    const config = await loadConfiguration(serviceName);
    setIsLoading(true);
    if (config) {
      const {accessKey, secretKey} = config;
      try {
        const response = await axios.post(
          'https://filestoreserver.onrender.com/wasabi/fetch-content',
          {
            currentPath: currentPath,
            accessKeyId: accessKey,
            secretAccessKey: secretKey,
            region: 'us-east-1',
            bucketName: 'filemanager',
          },
        );
        if (response.data) {
          setIsLoading(false);
        }
        console.log('Response:', response.data);
        const {files, folders} = response.data;
        setFiles(files);
        setFolders(folders);
      } catch (error) {
        console.error('Error fetching files/folders:', error);
        Alert.alert('Error', 'Failed to fetch files/folders');
      }
    } else {
      Alert.alert('Error', 'AWS S3 configuration not found');
    }
  };

  const createFolder = async () => {
    const config = await loadConfiguration(serviceName);
    const {accessKey, secretKey} = config;

    try {
      const response = await axios.post(
        'https://filestoreserver.onrender.com/wasabi/create-folder',
        {
          folderName: folderName,
          currentPath: currentPath,
          accessKeyId: accessKey,
          secretAccessKey: secretKey,
          region: 'us-east-1',
          bucketName: 'filemanager',
        },
      );

      console.log('Response:', response.data);
      fetchFilesFolders();
    } catch (error) {
      console.error('Error creating folder:', error);
      const errorMessage = error.message || 'An unknown error occurred';
      Alert.alert('Error', `Failed to create folder: ${errorMessage}`);
    }
  };

  const goBack = () => {
    if (currentPath === '/') {
      setCurrentPath('');
    }
    setCurrentPath(prevPath => {
      const part = prevPath.split('/').filter(Boolean);
      part.pop();
      return part.length > 0 ? part.join('/') + '/' : '';
    });
  };

  const uploadFiles = async files => {
    const config = await loadConfiguration(serviceName);
    const {accessKey, secretKey} = config;

    try {
      const formData = new FormData();
      formData.append('accessKeyId', accessKey);
      formData.append('secretAccessKey', secretKey);
      formData.append('region', 'us-east-1');
      formData.append('bucketName', 'filemanager');
      formData.append('currentPath', currentPath);

      files.forEach(filess => {
        formData.append('files', {
          uri: filess.uri,
          type: filess.type,
          name: filess.name,
        });
      });

      console.log('formdata', formData);

      const response = await axios.post(
        'https://filestoreserver.onrender.com/wasabi/upload-file',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      console.log('Upload response:', response.data);
    } catch (error) {
      console.error('Upload error:', error);
    }
  };

  const selectFiles = async () => {
    try {
      const files = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
        allowMultiSelection: true,
      });

      console.log('Selected files:', files);
      if (files) {
        uploadFiles(files);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Document picker error:', error);
      }
    }
  };

  if (!configured) {
    return (
      <Text style={styles.txt}>
        Please do the configuration of {serviceName}
      </Text>
    );
  }
  console.log('currentpath', currentPath);
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => setModalVisible(true)}
        style={styles.button}>
        <Text style={styles.buttonText}>Open Menu</Text>
      </TouchableOpacity>
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalBackground}>
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={() => handleOptionSelect('AwsFileManager')}
              style={styles.option}>
              <Text style={styles.optionText}>Go to Aws FileManager</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleOptionSelect('AzureFileManager')}
              style={styles.option}>
              <Text style={styles.optionText}>Go to Azure FileManager</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styles.option}>
              <Text style={styles.optionText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <TextInput
        style={styles.input}
        value={folderName}
        onChangeText={text => setFolderName(text)}
        placeholder="Enter Folder name"
        placeholderTextColor={'grey'}
      />
      <Button title="Create Folder" onPress={() => createFolder()} />
      <Button title="Upload Files" onPress={selectFiles} />
      <Text style={styles.sectionTitle}>Content:</Text>
      {isLoading && <ActivityIndicator />}
      <FlatList
        data={folder.concat(file)}
        keyExtractor={(item, index) => item.name + index}
        renderItem={({item}) => (
          <View style={styles.item}>
            <Text
              onPress={() =>
                item.name.endsWith('/')
                  ? navigateTo(item.name)
                  : Alert.alert(item.name)
              }
              style={styles.txt}>
              {item.name.endsWith('/')
                ? `📂 ${item.name.slice(0, -1)}`
                : `📃 ${item.name}`}
            </Text>
          </View>
        )}
      />
      {currentPath && <Button title="Go back" onPress={goBack} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    color: 'black',
  },
  item: {
    padding: 10,
    marginVertical: 5,
    backgroundColor: '#f1f1f1',
    borderRadius: 5,
  },
  txt: {
    color: 'black',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 10,
    color: 'black',
  },
  button: {
    padding: 15,
    backgroundColor: '#6200ea',
    borderRadius: 5,
    margin: '3%',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: 300,
    alignItems: 'center',
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
    alignItems: 'center',
  },
  optionText: {
    fontSize: 18,
    color: 'black',
  },
});

export default FileManagerScreen;
