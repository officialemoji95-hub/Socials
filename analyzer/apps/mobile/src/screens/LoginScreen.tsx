import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';

export const LoginScreen = () => {
  const [instagramToken, setInstagramToken] = useState('');
  const [tiktokToken, setTiktokToken] = useState('');

  const onSaveTokens = () => {
    Alert.alert('Tokens saved', 'OAuth placeholders used. Replace with actual OAuth flow later.');
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Connect accounts</Text>
      <Text style={{ color: '#6B7280' }}>Use OAuth placeholders for now, then paste access tokens manually for MVP testing.</Text>

      <Button title="Connect Instagram (OAuth placeholder)" onPress={() => Alert.alert('Instagram OAuth', 'Placeholder action')} />
      <TextInput
        value={instagramToken}
        onChangeText={setInstagramToken}
        placeholder="Paste Instagram access token"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />

      <Button title="Connect TikTok (OAuth placeholder)" onPress={() => Alert.alert('TikTok OAuth', 'Placeholder action')} />
      <TextInput
        value={tiktokToken}
        onChangeText={setTiktokToken}
        placeholder="Paste TikTok access token"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />

      <View style={{ marginTop: 8 }}>
        <Button title="Save tokens" onPress={onSaveTokens} />
      </View>
    </ScrollView>
  );
};
