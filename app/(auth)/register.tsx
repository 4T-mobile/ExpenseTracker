import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { AxiosError } from "axios";
import { RegisterInput, RegisterSchema } from "@/src/schemas/auth.schema";
import { useRegisterMutation } from "@/src/hooks/useAuthMutation";
import { Colors } from "@/constants/theme";

export default function RegisterScreen() {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: { username: "", email: "", password: "" },
  });

  const mutation = useRegisterMutation();

  const onSubmit = (data: RegisterInput) => {
    mutation.mutate(data);
  };

  return (
    <View style={[styles.container, { backgroundColor: Colors.white }]}>
      <Text style={[styles.title, { color: Colors.textPrimary }]}>
        Create Account
      </Text>

      {/* Username Field */}
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors.border,
                color: Colors.textPrimary,
              },
            ]}
            placeholder="Username"
            placeholderTextColor={Colors.textSecondary}
            autoCapitalize="none"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.username && (
        <Text style={styles.error}>{errors.username.message}</Text>
      )}

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors.border,
                color: Colors.textPrimary,
              },
            ]}
            placeholder="Email"
            placeholderTextColor={Colors.textSecondary}
            autoCapitalize="none"
            keyboardType="email-address"
            onBlur={onBlur}
            onChangeText={onChange}
            value={value}
          />
        )}
      />
      {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

      {/* Password Field */}
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={[
              styles.input,
              {
                borderColor: Colors.border,
                color: Colors.textPrimary,
              },
            ]}
            placeholder="Password"
            placeholderTextColor={Colors.textSecondary}
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
            {(mutation.error as AxiosError<{ message: string }>)?.response?.data
              ?.message || "Registration failed. Please try again."}
          </Text>
        </View>
      )}

      <Button
        title={mutation.isPending ? "Creating..." : "Register"}
        onPress={handleSubmit(onSubmit)}
        disabled={mutation.isPending}
      />

      <View style={styles.footer}>
        <Text style={styles.link} onPress={() => router.push("/(auth)/login")}>
          Already have an account? Login
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
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
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
  link: { fontSize: 15 },
});
