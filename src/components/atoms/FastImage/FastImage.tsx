import { Image, ImageProps, ImageStyle } from 'react-native';

interface FastImageProps extends Omit<ImageProps, 'source'> {
  source: { uri: string } | number;
  style?: ImageStyle;
  width?: number;
  height?: number;
  borderRadius?: number;
}

export const FastImage = ({
  source,
  style,
  width,
  height,
  borderRadius,
  ...props
}: FastImageProps) => {
  const imageStyle: ImageStyle[] = [];

  if (style) imageStyle.push(style);
  if (width || height) {
    imageStyle.push({
      width: width || 'auto',
      height: height || 'auto',
    });
  }
  if (borderRadius) {
    imageStyle.push({ borderRadius });
  }

  return <Image source={source} style={imageStyle} {...props} />;
};
