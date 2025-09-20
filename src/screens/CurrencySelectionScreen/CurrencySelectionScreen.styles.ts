import { StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: colors.neutral.white,
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backIcon: {
    fontSize: 24,
    color: colors.primary,
    fontWeight: 'bold',
  },
  headerTitle: {
    color: colors.primary,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  subtitle: {
    color: colors.neutral[600],
    marginBottom: 24,
    textAlign: 'center',
  },
  currencyList: {
    gap: 12,
  },
  currencyOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    backgroundColor: colors.primary + '10',
    borderColor: colors.primary,
  },
  currencyInfo: {
    flex: 1,
  },
  currencyCode: {
    color: colors.neutral[900],
    fontWeight: '600',
    marginBottom: 4,
  },
  currencyName: {
    color: colors.neutral[600],
  },
  currencySymbol: {
    marginRight: 12,
  },
  symbol: {
    color: colors.primary,
    fontWeight: 'bold',
  },
  selectedIndicator: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkmark: {
    color: colors.neutral.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    marginTop: 32,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  saveButtonText: {
    color: colors.neutral.white,
    fontWeight: '600',
    fontSize: 16,
  },
});
