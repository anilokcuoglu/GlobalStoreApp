import React from 'react';
import { View, ViewStyle } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

interface GradientViewProps {
  colors: string[];
  start?: { x: number; y: number };
  end?: { x: number; y: number };
  style?: ViewStyle;
  children?: React.ReactNode;
  fallbackColor?: string;
}

export const GradientView: React.FC<GradientViewProps> = ({
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  style,
  children,
  fallbackColor = colors[0],
}) => {
  try {
    return (
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        style={style}
      >
        {children}
      </LinearGradient>
    );
  } catch (error) {
    console.warn('LinearGradient failed, using fallback color:', error);
    // Fallback to solid color if LinearGradient fails
    return (
      <View style={[style, { backgroundColor: fallbackColor }]}>
        {children}
      </View>
    );
  }
};
