import { StyleSheet } from "react-native";
import { borderRadius, colors, spacing } from "../../../constants/theme";

export const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      backgroundColor: '#EFEFEF',
      borderRadius: borderRadius.xl,
      borderWidth: 1,
      borderColor: '#E8E8E8',
      padding: spacing.sm,
    },
    tab: {
      flex: 1,
      flexDirection: 'row',
      gap: spacing.sm,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: borderRadius.md,
      padding: spacing.sm,
      zIndex: 1,
    },
    selectedTab: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: colors.neutral.white,
      borderRadius: borderRadius.full,
      marginVertical: spacing.sm,
      shadowColor: 'rgba(0, 0, 0, 0.05)',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 1,
      shadowRadius: 2,
      elevation: 2,
    },
  });