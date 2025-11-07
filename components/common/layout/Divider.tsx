import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Colors } from '../../../constants/theme';

interface DividerProps {
  color?: string;
  thickness?: number;
  marginVertical?: number;
}

export const Divider: React.FC<DividerProps> = ({
  color = Colors.border,
  thickness = 1,
  marginVertical = 0,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical,
        },
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
