import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AxiosError } from "axios";
import { LoginInput, LoginSchema } from "@/src/schemas/auth.schema";
import { useLoginMutation } from "@/src/hooks/useAuthMutation";

export default function LoginScreen() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(LoginSchema),
    defaultValues: { emailOrUsername: "", password: "" },
  });

  const mutation = useLoginMutation();

  const onSubmit = (data: LoginInput) => {
    mutation.mutate(data);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

      {/* Email or Username Field */}
      <Controller
        control={control}
        name="emailOrUsername"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Email or Username"
            keyboardType="default"
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.emailOrUsername && <Text style={styles.error}>{errors.emailOrUsername.message}</Text>}

      {/* Password Field */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            placeholder="Password"
            secureTextEntry
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.password && (
        <Text style={styles.error}>{errors.password.message}</Text>
      )}

      {mutation.error && (
        <View style={styles.apiErrorContainer}>
          <Text style={styles.apiError}>
            {(mutation.error as AxiosError<{ message: string }>)?.response?.data?.message ||
             "Login failed. Please try again."}
          </Text>
        </View>
      )}

      <Button
        title={mutation.isPending ? "Logging in..." : "Login"}
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
      />

      <View style={styles.footer}>
        <Text
          style={styles.link}
          onPress={() => router.push("/(auth)/register")}
        >
          Don’t have an account? Register
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 8,
  },
  error: { color: "red", fontSize: 13, marginBottom: 8 },
  apiErrorContainer: {
    backgroundColor: "#fee",
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#fcc",
  },
  apiError: {
    color: "#c00",
    fontSize: 14,
    textAlign: "center",
  },
  footer: { marginTop: 20, alignItems: "center" },
  link: { color: "#007AFF", fontSize: 15 },
});
