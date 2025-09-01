import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Image } from 'react-native';
import { API_BASE_URL } from '../config';
import { colors, spacing, radius, shadow } from '../theme';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function ChatScreen() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [conversationId, setConversationId] = useState(null);

  useEffect(() => {
    const init = async () => {
      const saved = await AsyncStorage.getItem('conversation');
      if (saved) setMessages(JSON.parse(saved));
      let cid = await AsyncStorage.getItem('conversationId');
      if (!cid) {
        try {
          const r = await fetch(`${API_BASE_URL}/conversations`, { method: 'POST' });
          if (r.ok) {
            const j = await r.json();
            cid = j.conversation_id;
            await AsyncStorage.setItem('conversationId', cid);
          }
        } catch {}
      }
      setConversationId(cid || null);
    };
    init();
  }, []);

  const ensureConversation = async () => {
    let cid = conversationId || (await AsyncStorage.getItem('conversationId'));
    if (!cid) {
      try {
        const r = await fetch(`${API_BASE_URL}/conversations`, { method: 'POST' });
        if (r.ok) {
          const j = await r.json();
          cid = j.conversation_id;
          await AsyncStorage.setItem('conversationId', cid);
          setConversationId(cid);
        }
      } catch {}
    }
    return cid;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');

    const trySend = async (cid) => {
      const res = await fetch(`${API_BASE_URL}/conversations/message`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ conversation_id: cid, message: userMessage.text })
      });
      return res;
    };

    try {
      let cid = await ensureConversation();
      if (!cid) throw new Error('No conversation');

      let res = await trySend(cid);
      if (res.status === 404) {
        // Stale conversation id, recreate and retry once
        await AsyncStorage.removeItem('conversationId');
        setConversationId(null);
        cid = await ensureConversation();
        if (!cid) throw new Error('Failed to create conversation');
        res = await trySend(cid);
      }
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data = await res.json();

      let imageMsg = null;
      if (data.recommended_title) {
        try {
          const cover = await fetch(`${API_BASE_URL}/cover`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: data.recommended_title, size: '512x512' })
          });
          if (cover.ok) {
            const cov = await cover.json();
            imageMsg = { sender: 'bot', image: cov.image_data_url };
          }
        } catch {}
      }

      const botText = { sender: 'bot', text: data.reply };
      const newList = imageMsg ? [...messages, userMessage, imageMsg, botText] : [...messages, userMessage, botText];
      setMessages(newList);
      await AsyncStorage.setItem(
        'conversation',
        JSON.stringify(newList)
      );
      // refresh saved conversation id just in case
      const currentCid = await AsyncStorage.getItem('conversationId');
      if (!currentCid && cid) await AsyncStorage.setItem('conversationId', cid);
      if (cid && cid !== conversationId) setConversationId(cid);
    } catch (e) {
      setMessages((prev) => [...prev, { sender: 'bot', text: `Network error. ${e.message}` }]);
    }
  };

  return (
    <View style={styles.container}>
      <FlatList
        contentContainerStyle={{ paddingVertical: spacing.md }}
        data={messages}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={[styles.bubble, item.sender === 'user' ? styles.bubbleUser : styles.bubbleBot]}>
            {item.image ? (
              <Image source={{ uri: item.image }} style={styles.image} />
            ) : (
              <Text style={styles.bubbleText}>{item.text}</Text>
            )}
          </View>
        )}
        style={{ flex: 1 }}
      />
      <View style={styles.composer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="Type a message"
          placeholderTextColor={colors.textMuted}
        />
        <TouchableOpacity style={styles.sendBtn} onPress={sendMessage}>
          <Text style={styles.sendLabel}>Send</Text>
        </TouchableOpacity>
      </View>
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
  image: { width: 256, height: 256, borderRadius: radius.md },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
    paddingVertical: spacing.md,
  },
  input: {
    flex: 1,
    backgroundColor: colors.surface,
    color: colors.text,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  sendBtn: {
    backgroundColor: colors.primary,
    borderRadius: radius.md,
    paddingHorizontal: spacing.lg,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendLabel: { color: colors.white, fontWeight: '700' },
});
