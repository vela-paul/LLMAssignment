import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HistoryScreen() {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const load = async () => {
      const saved = await AsyncStorage.getItem('conversation');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    };
    load();
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <Text style={item.sender === 'user' ? styles.user : styles.bot}>{item.text}</Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  user: { alignSelf: 'flex-end', backgroundColor: '#dcf8c6', padding: 8, borderRadius: 4, marginVertical: 2 },
  bot: { alignSelf: 'flex-start', backgroundColor: '#ececec', padding: 8, borderRadius: 4, marginVertical: 2 }
});
