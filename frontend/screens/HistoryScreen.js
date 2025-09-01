import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { colors, spacing, radius, shadow } from '../theme';
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
        contentContainerStyle={{ paddingVertical: spacing.md }}
        data={messages}
        keyExtractor={(_, idx) => idx.toString()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
            <Text style={styles.bubbleText}>{item.text}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background, paddingHorizontal: spacing.lg },
  bubble: {
    maxWidth: '80%',
    borderRadius: radius.lg,
    padding: spacing.md,
    marginVertical: spacing.xs,
    ...shadow.card,
  },
  bubbleUser: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  bubbleBot: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
  },
  bubbleText: { color: colors.white, lineHeight: 20 },
});
