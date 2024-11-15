/* eslint-disable react-native/no-inline-styles */
import 'react-native-url-polyfill/auto';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {BlobServiceClient} from '@azure/storage-blob';
import * as DocumentPicker from 'react-native-document-picker';
import 'core-js/features/symbol/async-iterator';
import {Buffer} from 'buffer';
import RNFS from 'react-native-fs';

const AzureFileManager = () => {
  const [containers, setContainers] = useState([]);
  const [selectedContainer, setSelectedContainer] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [containerNameInput, setContainerNameInput] = useState('');
  const [folder, setFolder] = useState('');
  const [folderPath, setFolderPath] = useState('');

  const blobSasUrl =
    'https://aarjavjain.blob.core.windows.net/?sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-11-14T14:35:36Z&st=2024-11-14T06:35:36Z&spr=https&sig=xUtGrDBYEEkVHazSRfzsc7urV6slqfVZERsDQXESPU8%3D';
  const blobServiceClient = new BlobServiceClient(blobSasUrl);

  // Append current time to make container name unique
  const containerName = containerNameInput + new Date().getTime();
  const containerClient = blobServiceClient.getContainerClient(containerName);
  console.log(selectedContainer);
  const createContainer = async () => {
    try {
      console.log(`Creating container "${containerName}"...`);
      await containerClient.create();
      console.log(`Done. URL: ${containerClient.url}`);
      listContainers(); // Refresh the container list
    } catch (error) {
      console.log('Error creating container:', error.message);
    }
  };

  const deleteContainer = async () => {
    const newContainerClient =
      blobServiceClient.getContainerClient(selectedContainer);
    try {
      console.log(`Deleting container "${containerName}"...`);
      await newContainerClient.delete();
      Alert.alert('Container deleted.');
      listContainers(); // Refresh the container list
    } catch (error) {
      console.log('Error deleting container:', error.message);
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
        uploadFiles(files, selectedContainer);
      }
    } catch (error) {
      if (DocumentPicker.isCancel(error)) {
        console.log('User cancelled document picker');
      } else {
        console.error('Document picker error:', error);
      }
    }
  };

  const listContainers = async () => {
    try {
      console.log('Retrieving container list...');
      const iter = blobServiceClient.listContainers();
      let containerList = [];

      for await (const container of iter) {
        containerList.push(container.name);
      }

      setContainers(containerList);
      console.log('Containers:', containerList);
    } catch (error) {
      console.log('Error retrieving containers:', error.message);
    }
  };

  useEffect(() => {
    listContainers();
  }, []);

  const listFiles = async name => {
    const newContainerClient = blobServiceClient.getContainerClient(name);
    setSelectedContainer(name);
    try {
      console.log('Retrieving file list...');
      const iter = newContainerClient.listBlobsFlat();
      let files = [];

      for await (const blobItem of iter) {
        files.push(blobItem.name);
      }

      if (files.length > 0) {
        console.log('Files:', files);
        setSelectedFile(files);
      } else {
        console.log('The container does not contain any files.');
      }
    } catch (error) {
      console.log('Error retrieving files:', error.message);
    }
  };

  const uploadFiles = async (files, containerName) => {
    try {
      console.log(`Uploading files to container "${containerName}"...`);

      // Create a container client for the specified container
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Iterate over the files and create promises for each upload
      const promises = files.map(async file => {
        const filePath = file.uri;
        const data = await RNFS.readFile(filePath, 'base64');
        console.log('55555', data);
        const buffer = Buffer.from(data, 'base64');
        const blockBlobClient = containerClient.getBlockBlobClient(file.name);
        return blockBlobClient.upload(buffer, buffer.byteLength, {
          blobHTTPHeaders: {blobContentType: file.type}, // Set content type if needed
        });
      });

      await Promise.all(promises);
      console.log('Upload completed.');
      // Optionally refresh the file list for the container
      listFiles(containerName);
    } catch (error) {
      console.log('Error uploading files:', error.message);
    }
  };
  const createFolder = async (containerNamed, folderName) => {
    try {
      const folderContainerClient =
        blobServiceClient.getContainerClient(containerNamed);
      const emptyBlobClient = folderContainerClient.getBlockBlobClient(
        `${folderName}/`,
      );

      // Upload an empty blob to create a "folder"
      await emptyBlobClient.uploadData(new Blob([]));
      console.log(
        `Empty folder "${folderName}" created in container "${containerNamed}"`,
      );
    } catch (error) {
      console.log('Error creating folder:', error.message);
    }
  };

  return (
    <View style={{padding: 10}}>
      <Text style={styles.txt}>
        Currently Selected Container is : {selectedContainer}
      </Text>
      <Text style={styles.txt}>Azure File Manager</Text>
      <TextInput
        style={styles.input}
        value={containerNameInput}
        onChangeText={text => setContainerNameInput(text)}
        placeholder="Enter Container name"
        placeholderTextColor="grey"
      />
      <TextInput
        style={styles.input}
        value={folder}
        onChangeText={text => setFolder(text)}
        placeholder="Enter folder name"
        placeholderTextColor="grey"
      />
      <Button title="Create Container" onPress={createContainer} />
      <Button title="Delete Container" onPress={deleteContainer} />
      <Button title="Upload Files" onPress={selectFiles} />
      <Button
        title="create folder"
        onPress={() => createFolder(selectedContainer, folder)}
      />
      <Text style={styles.txt}>Containers:</Text>
      <View style={{height: '50%', width: '100%'}}>
        <ScrollView>
          {selectedContainer ? (
            <View>
              <Text style={styles.txt}>{`📂 ${selectedContainer}`}</Text>
              {selectedFile.map((file, index) => (
                <View key={index}>
                  <Text style={styles.txt}>
                    {file.endsWith('/')
                      ? `📂 ${file.slice(0, -1)}`
                      : `📃 ${file}`}
                  </Text>
                </View>
              ))}
              <Button title="Back" onPress={() => setSelectedContainer(null)} />
            </View>
          ) : containers.length > 0 ? (
            containers.map((item, index) => (
              <View key={index}>
                <Text
                  style={styles.txt}
                  onPress={() => {
                    listFiles(item);
                    setSelectedContainer(item);
                  }}>
                  {`📂 ${item}`}
                </Text>
              </View>
            ))
          ) : (
            <Text style={styles.txt}>No containers present</Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 10,
    color: 'black',
  },
  txt: {
    color: 'black',
    marginVertical: 5,
  },
});

export default AzureFileManager;
