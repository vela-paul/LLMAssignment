import React, { useState } from 'react';
import { SafeAreaView, View, Button } from 'react-native';
import ChatScreen from './screens/ChatScreen';
import HistoryScreen from './screens/HistoryScreen';

export default function App() {
  const [screen, setScreen] = useState('chat');

  return (
    <SafeAreaView style={{ flex: 1 }}>
      {screen === 'chat' ? <ChatScreen /> : <HistoryScreen />}
      <View style={{ flexDirection: 'row', justifyContent: 'space-around', padding: 10 }}>
        <Button title="Chat" onPress={() => setScreen('chat')} />
        <Button title="History" onPress={() => setScreen('history')} />
      </View>
    </SafeAreaView>
  );
}
