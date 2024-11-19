import {Image, StyleSheet, Text, View} from 'react-native';
import React from 'react';

type ListViewProps = {
  title: string;
  description: string;
  date: string;
};

const ListView = ({title, description, date}: ListViewProps) => {
  return (
    <View style={styles.container}>
      <Image source={require('../../assets/wasabi.png')} style={styles.image} />
      <View style={styles.contentContainer}>
        <View style={styles.vertical}>
          <Text style={styles.txt}>{title}</Text>
          <Text style={styles.bodytxt}>{description}</Text>
        </View>
        <Text style={styles.datetxt}>{date}</Text>
      </View>
    </View>
  );
};

export default ListView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    height: 80,
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  image: {
    height: 60,
    width: 60,
    borderWidth: 2,
    borderRadius: 30,
    marginRight: 10,
  },
  contentContainer: {
    flex: 1,
    justifyContent: 'space-between',
    marginTop: 10,
  },
  vertical: {
    flexDirection: 'column',
    borderBottomWidth: 2,
    borderBottomColor: 'grey',
    paddingBottom: 5,
    marginRight: 10,
  },
  txt: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 2,
  },
  bodytxt: {
    color: 'grey',
    fontSize: 14,
  },
  datetxt: {
    color: 'grey',
    fontSize: 14,
    alignSelf: 'flex-end',
    position: 'absolute',
    paddingRight: 10,
  },
});
