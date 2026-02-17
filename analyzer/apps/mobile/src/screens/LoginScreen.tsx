import { Alert, Button, ScrollView, Text, TextInput, View } from 'react-native';
import { useState } from 'react';
import { api } from '../services/api';

const uuidHint = '00000000-0000-0000-0000-000000000000';

export const LoginScreen = () => {
  const [userId, setUserId] = useState('');
  const [instagramAccountId, setInstagramAccountId] = useState('');
  const [instagramUsername, setInstagramUsername] = useState('');
  const [instagramToken, setInstagramToken] = useState('');
  const [tiktokAccountId, setTiktokAccountId] = useState('');
  const [tiktokUsername, setTiktokUsername] = useState('');
  const [tiktokToken, setTiktokToken] = useState('');
  const [saving, setSaving] = useState(false);

  const onSaveTokens = async () => {
    if (!userId.trim()) {
      Alert.alert('Missing user ID', 'Please paste a valid user UUID before saving tokens.');
      return;
    }

    const tasks: Array<Promise<unknown>> = [];

    if (instagramAccountId.trim() || instagramToken.trim()) {
      tasks.push(
        api.createAccount({
          user_id: userId.trim(),
          platform: 'instagram',
          platform_account_id: instagramAccountId.trim() || instagramUsername.trim() || `ig-${Date.now()}`,
          username: instagramUsername.trim() || undefined,
          access_token: instagramToken.trim() || undefined
        })
      );
    }

    if (tiktokAccountId.trim() || tiktokToken.trim()) {
      tasks.push(
        api.createAccount({
          user_id: userId.trim(),
          platform: 'tiktok',
          platform_account_id: tiktokAccountId.trim() || tiktokUsername.trim() || `tt-${Date.now()}`,
          username: tiktokUsername.trim() || undefined,
          access_token: tiktokToken.trim() || undefined
        })
      );
    }

    if (tasks.length === 0) {
      Alert.alert('Nothing to save', 'Enter at least one account ID or token.');
      return;
    }

    setSaving(true);
    try {
      await Promise.all(tasks);
      Alert.alert('Accounts saved', 'Account records were created successfully.');
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to save account tokens.';
      Alert.alert('Save failed', message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={{ padding: 16, gap: 12 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>Connect accounts</Text>
      <Text style={{ color: '#6B7280' }}>Use OAuth placeholders for now, then paste access tokens manually for MVP testing.</Text>

      <TextInput
        value={userId}
        onChangeText={setUserId}
        placeholder={`User UUID (${uuidHint})`}
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />

      <Button title="Connect Instagram (OAuth placeholder)" onPress={() => Alert.alert('Instagram OAuth', 'Placeholder action')} />
      <TextInput
        value={instagramAccountId}
        onChangeText={setInstagramAccountId}
        placeholder="Instagram account ID"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />
      <TextInput
        value={instagramUsername}
        onChangeText={setInstagramUsername}
        placeholder="Instagram username (optional)"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />
      <TextInput
        value={instagramToken}
        onChangeText={setInstagramToken}
        placeholder="Paste Instagram access token"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />

      <Button title="Connect TikTok (OAuth placeholder)" onPress={() => Alert.alert('TikTok OAuth', 'Placeholder action')} />
      <TextInput
        value={tiktokAccountId}
        onChangeText={setTiktokAccountId}
        placeholder="TikTok account ID"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />
      <TextInput
        value={tiktokUsername}
        onChangeText={setTiktokUsername}
        placeholder="TikTok username (optional)"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />
      <TextInput
        value={tiktokToken}
        onChangeText={setTiktokToken}
        placeholder="Paste TikTok access token"
        autoCapitalize="none"
        style={{ borderWidth: 1, borderColor: '#D1D5DB', borderRadius: 8, padding: 12 }}
      />

      <View style={{ marginTop: 8 }}>
        <Button title={saving ? 'Saving...' : 'Save tokens'} disabled={saving} onPress={() => void onSaveTokens()} />
      </View>
    </ScrollView>
  );
};
