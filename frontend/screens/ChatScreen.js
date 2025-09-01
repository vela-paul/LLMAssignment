import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    const loadConversation = async () => {
      const saved = await AsyncStorage.getItem('conversation');
      if (saved) {
        setMessages(JSON.parse(saved));
      }
    };
    loadConversation();
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    try {
      const res = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: input })
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
      await AsyncStorage.setItem(
        'conversation',
        JSON.stringify([...messages, userMessage, { sender: 'bot', text: data.reply }])
      );
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'bot', text: 'Network error.' }]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <Text style={item.sender === 'user' ? styles.user : styles.bot}>{item.text}</Text>
        )}
        style={{ flex: 1 }}
      />
      <View style={styles.inputRow}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  inputRow: { flexDirection: 'row', alignItems: 'center' },
  input: {
    flex: 1,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    marginRight: 8
  },
  user: {
    alignSelf: 'flex-end',
    backgroundColor: '#dcf8c6',
    padding: 8,
    borderRadius: 4,
    marginVertical: 2
  },
  bot: {
    alignSelf: 'flex-start',
    backgroundColor: '#ececec',
    padding: 8,
    borderRadius: 4,
    marginVertical: 2
  }
});
