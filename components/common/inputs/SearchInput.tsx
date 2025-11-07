import React from 'react';
import { TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TextInput } from './TextInput';
import { Colors } from '@/constants/theme';

interface SearchInputProps {
  value?: string;
  onChangeText?: (text: string) => void;
  placeholder?: string;
  containerStyle?: any;
  onClear?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  containerStyle,
  onClear,
}) => {
  const handleClear = () => {
    onChangeText?.('');
    onClear?.();
  };

  return (
    <TextInput
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      containerStyle={containerStyle}
      autoCapitalize="none"
      autoCorrect={false}
      returnKeyType="search"
      leftIcon={
        <Ionicons
          name="search-outline"
          size={20}
          color={Colors.textSecondary}
        />
      }
      rightIcon={
        value ? (
          <TouchableOpacity
            onPress={handleClear}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons
              name="close-circle"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        ) : undefined
      }
    />
  );
};
