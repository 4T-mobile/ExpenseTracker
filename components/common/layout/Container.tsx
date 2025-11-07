import React, { ReactNode } from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { Layout } from '../../../constants/theme';

interface ContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: number;
  paddingHorizontal?: number;
  paddingVertical?: number;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  style,
  padding,
  paddingHorizontal,
  paddingVertical,
}) => {
  return (
    <View
      style={[
        styles.container,
        padding !== undefined && { padding },
        paddingHorizontal !== undefined && { paddingHorizontal },
        paddingVertical !== undefined && { paddingVertical },
        style,
      ]}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Layout.screenPadding,
  },
});
