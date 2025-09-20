import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Typography } from '../../components';
import { styles } from './CartScreen.styles';

export const CartScreen = () => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Typography variant="h1" style={styles.title}>
          Sepetim
        </Typography>
        <Typography variant="body" style={styles.subtitle}>
          Sepetiniz şu anda boş
        </Typography>
        <Typography variant="caption" style={styles.description}>
          Ürünleri keşfetmeye başlayın ve favorilerinizi sepetinize ekleyin.
        </Typography>
      </View>
    </SafeAreaView>
  );
};
