import React from 'react';
import {
  TouchableOpacity,
  ActivityIndicator,
  TouchableOpacityProps,
  TextStyle,
  StyleProp,
  ViewStyle,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { Typography } from '../../atoms';
import { styles } from './PrimaryButton.styles';

interface PrimaryButtonProps extends TouchableOpacityProps {
  title: string;
  disabled?: boolean;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
}

const PrimaryButton = ({
  title,
  disabled,
  loading,
  style,
  textStyle,
  onPress,
  ...props
}: PrimaryButtonProps) => {
  const gradientColors = disabled
    ? ['#EFEFEF', '#EFEFEF']
    : ['#FFCE08', '#FF760E'];

  const buttonTextColor = disabled ? '#A9A9A9' : '#000000';

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[styles.container, style]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <LinearGradient
        colors={gradientColors}
        style={styles.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
      >
        {loading ? (
          <ActivityIndicator color={buttonTextColor} />
        ) : (
          <Typography
            lineHeight={20}
            variant="button"
            color={'#000000'}
            style={textStyle}
            size={16}
          >
            {title}
          </Typography>
        )}
      </LinearGradient>
    </TouchableOpacity>
  );
};

export default PrimaryButton;

