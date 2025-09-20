import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, LayoutChangeEvent } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Typography } from '../../atoms';
import { colors } from '../../../constants/theme';
import { styles } from './SegmentedControl.styles';

interface SegmentedControlProps {
  options: string[];
  onValueChange: (value: string, index: number) => void;
  initialIndex?: number;
}

interface TabLayout {
  x: number;
  width: number;
}

const SegmentedControl = ({
  options,
  onValueChange,
  initialIndex = 0,
}: SegmentedControlProps) => {
  const [selectedIndex, setSelectedIndex] = useState(initialIndex);
  const [tabLayouts, setTabLayouts] = useState<TabLayout[]>([]);
  const selectedTabPosition = useSharedValue(0);
  const selectedTabWidth = useSharedValue(0);

  useEffect(() => {
    if (tabLayouts[selectedIndex]) {
      selectedTabPosition.value = withSpring(tabLayouts[selectedIndex].x, {
        damping: 25,
        stiffness: 100,
      });
      selectedTabWidth.value = withSpring(tabLayouts[selectedIndex].width, {
        damping: 25,
        stiffness: 100,
      });
    }
  }, [selectedIndex, tabLayouts, selectedTabPosition, selectedTabWidth]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    if (onValueChange) {
      onValueChange(options[index], index);
    }
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: selectedTabPosition.value }],
      width: selectedTabWidth.value,
    };
  });

  const onTabLayout = (event: LayoutChangeEvent, index: number) => {
    const { x, width } = event.nativeEvent.layout;
    setTabLayouts(prev => {
      const newLayouts = [...prev];
      newLayouts[index] = { x, width };
      return newLayouts;
    });
  };

  return (
    <View style={styles.container}>
      {tabLayouts.length === options.length && (
        <Animated.View style={[styles.selectedTab, animatedStyle]} />
      )}
      {options.map((option, index: number) => {
        const isSelected = selectedIndex === index;
        return (
          <TouchableOpacity
            key={index}
            style={styles.tab}
            onPress={() => handleSelect(index)}
            onLayout={event => onTabLayout(event, index)}
          >
            <Typography
              size={16}
              weight="600"
              lineHeight={20}
              align="center"
              style={{ letterSpacing: -0.32 }}
              color={isSelected ? '#FF760E' : colors.neutral[800]}
            >
              {option}
            </Typography>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default SegmentedControl;
