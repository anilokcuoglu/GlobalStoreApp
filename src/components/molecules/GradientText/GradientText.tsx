import React from 'react';
import { StyleProp, Text, TextStyle } from 'react-native';
import MaskedView from '@react-native-masked-view/masked-view';
import LinearGradient from 'react-native-linear-gradient';

interface GradientTextProps {
  colors: string[];
  start: { x: number; y: number };
  end: { x: number; y: number };
  locations: number[];
  style: StyleProp<TextStyle>;
  children: React.ReactNode;
}

const GradientText = ({ colors, start, end, locations, children, ...props }: GradientTextProps) => {
  return (
    <MaskedView maskElement={<Text {...props}>{children}</Text>}>
      <LinearGradient
        colors={colors}
        start={start}
        end={end}
        locations={locations}
      >
        <Text
          {...props}
          style={[props.style, { opacity: 0 }]}
        >
          {children}
        </Text>
      </LinearGradient>
    </MaskedView>
  );
};

export default GradientText;
