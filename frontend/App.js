import React, { useState } from 'react';
import { SafeAreaView, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';
import { API_BASE_URL } from './config';
import { colors, spacing, radius } from './theme';

export default function App() {
  const [screen, setScreen] = useState('chat');

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: colors.background }}>
      <View style={styles.header}>
        <Text style={styles.title}>Smart Librarian</Text>
      </View>
      <View style={{ flex: 1 }}>
        {screen === 'chat' ? <ChatScreen /> : <HistoryScreen />}
      </View>
      <View style={styles.tabBar}>
        <TabButton label="Chat" active={screen === 'chat'} onPress={() => setScreen('chat')} />
        <TabButton label="History" active={screen === 'history'} onPress={() => setScreen('history')} />
      </View>
    </SafeAreaView>
  );
}

function TabButton({ label, active, onPress }) {
  return (
    <TouchableOpacity style={[styles.tabButton, active && styles.tabButtonActive]} onPress={onPress}>
      <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: spacing.lg,
    backgroundColor: colors.surface,
    borderBottomColor: colors.border,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  title: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: spacing.md,
    backgroundColor: colors.surface,
    borderTopColor: colors.border,
    borderTopWidth: 1,
  },
  tabButton: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    backgroundColor: '#1a1a1a',
  },
  tabButtonActive: {
    backgroundColor: colors.primary,
  },
  tabLabel: {
    color: colors.text,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: colors.white,
  },
});
