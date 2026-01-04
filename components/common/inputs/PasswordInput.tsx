import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TextInput } from "./TextInput";
import { Colors } from "@/constants/theme";

interface PasswordInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  containerStyle?: any;
  editable?: boolean;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  label = "Password",
  error,
  helperText,
  value,
  onChangeText,
  placeholder = "Enter password",
  containerStyle,
  editable = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <TextInput
      label={label}
      error={error}
      helperText={helperText}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      // REQUIRED: Explicit placeholder color for Android APK production builds
      // PasswordInput extends TextInput which handles this, but ensuring best practices
      secureTextEntry={!showPassword}
      autoCapitalize="none"
      autoCorrect={false}
      containerStyle={containerStyle}
      editable={editable}
      rightIcon={
        <TouchableOpacity
          onPress={() => setShowPassword(!showPassword)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons
            name={showPassword ? "eye-off-outline" : "eye-outline"}
            size={22}
            color={Colors.textSecondary}
          />
        </TouchableOpacity>
      }
    />
  );
};
