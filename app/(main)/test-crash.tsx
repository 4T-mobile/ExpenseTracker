import { View, Button, Text } from "react-native";

export default function TestCrash() {
  return (
    <View style={{ marginTop: 100, padding: 20 }}>
      <Text style={{ marginBottom: 20, fontSize: 18 }}>Sentry Test Screen</Text>

      <Button
        title="Trigger Error"
        onPress={() => {
          throw new Error("Test Sentry Error From Expo App!");
        }}
      />
    </View>
  );
}
