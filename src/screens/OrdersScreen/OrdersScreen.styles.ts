import { StyleSheet } from 'react-native';
import { colors } from '../../constants/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.neutral[50],
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: colors.neutral[50],
    borderBottomWidth: 1,
    borderBottomColor: colors.neutral[200],
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.neutral[100],
  },
  backIcon: {
    fontSize: 20,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  headerSpacer: {
    width: 40,
  },
  listContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  emptyListContainer: {
    flexGrow: 1,
  },
  orderCard: {
    backgroundColor: colors.neutral.white,
    borderRadius: 16,
    marginBottom: 16,
    padding: 20,
    elevation: 2,
    shadowColor: colors.neutral[800],
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  orderNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.neutral[800],
    marginBottom: 4,
  },
  orderDate: {
    fontSize: 14,
    color: colors.neutral[500],
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  summaryContainer: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: colors.neutral[50],
    borderRadius: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.neutral[600],
  },
  summaryValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: colors.neutral[800],
  },
  orderFooter: {
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: colors.neutral[200],
  },
  paymentMethod: {
    fontSize: 12,
    color: colors.neutral[500],
    textAlign: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 80,
  },
  emptyIcon: {
    fontSize: 80,
    lineHeight: 120,
    marginBottom: 24,
    opacity: 0.8,
  },
  emptyTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.neutral[800],
    marginBottom: 12,
    textAlign: 'center',
    lineHeight: 28,
  },
  emptySubtitle: {
    fontSize: 16,
    color: colors.neutral[500],
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 280,
  },
});
