import { Text, TextProps, TextStyle } from 'react-native';
import { styles } from './Typography.styles';

interface TypographyProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'button';
  color?: string;
  align?: 'left' | 'center' | 'right';
  weight?: 'normal' | 'bold' | '500' | '600' | '700';
  fontFamily?: string;
  lineHeight?: number;
  size?: number;
}

export const Typography = ({
  variant = 'body',
  color,
  align = 'left',
  weight,
  style,
  children,
  fontFamily,
  lineHeight,
  size,
  ...props
}: TypographyProps) => {
  const textStyle: TextStyle[] = [styles[variant]];

  if (color) textStyle.push({ color });
  if (align) textStyle.push({ textAlign: align });
  if (weight) textStyle.push({ fontWeight: weight });
  if (fontFamily) textStyle.push({ fontFamily });
  if (lineHeight) textStyle.push({ lineHeight });
  if (size) textStyle.push({ fontSize: size });
  if (style) textStyle.push(style as TextStyle);

  return (
    <Text style={textStyle} {...props}>
      {children}
    </Text>
  );
};
