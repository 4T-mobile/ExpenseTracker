import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';

interface RowProps {
  children: ReactNode;
  style?: ViewStyle;
  align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
  justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
  gap?: number;
  wrap?: boolean;
}

export const Row: React.FC<RowProps> = ({
  children,
  style,
  align = 'center',
  justify = 'flex-start',
  gap = 0,
  wrap = false,
}) => {
  return (
    <View
      style={[
        styles.row,
        { alignItems: align, justifyContent: justify, gap },
        wrap && styles.wrap,
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
  },
  wrap: {
    flexWrap: 'wrap',
  },
});
