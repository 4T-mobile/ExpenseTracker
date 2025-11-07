import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface ColumnProps {
  children: ReactNode;
  style?: ViewStyle;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number;
}

export const Column: React.FC<ColumnProps> = ({
  children,
  style,
  align = 'stretch',
  justify = 'flex-start',
  gap = 0,
}) => {
  return (
    <View
      style={[
        styles.column,
        { alignItems: align, justifyContent: justify, gap },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    flexDirection: 'column',
  },
});
