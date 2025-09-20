import { StyleSheet } from 'react-native';
import {
  colors,
  shadows,
  spacing,
  borderRadius,
  typography,
} from '../../constants/theme';

export const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: 'transparent', // ImageBackground için transparent
  },
  gradientBackground: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xxl,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: spacing.xxl,
  },
  logo: {
    width: 80,
    height: 80,
    borderRadius: borderRadius.xl,
    backgroundColor: colors.neutral.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.medium,
  },
  logoText: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.darkMode.primary[500],
  },
  appName: {
    fontSize: typography.fontSize.xxxxl,
    fontWeight: typography.fontWeight.black,
    color: colors.neutral.white,
    textAlign: 'center',
    marginBottom: spacing.sm,
  },
  appSubtitle: {
    fontSize: typography.fontSize.xl,
    color: colors.neutral.white,
    fontWeight: typography.fontWeight.medium,
    textAlign: 'center',
    opacity: 0.9,
  },
  themeButton: {
    marginTop: spacing.lg,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  themeButtonText: {
    color: colors.neutral.white,
    textAlign: 'center',
    fontWeight: typography.fontWeight.medium,
  },
  formContainer: {
    backgroundColor: colors.neutral.white,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    ...shadows.large,
  },
  tabContainer: {
    marginBottom: spacing.md,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
  },
  activeTab: {
    backgroundColor: colors.neutral.white,
    ...shadows.small,
  },
  tabText: {
    fontSize: typography.fontSize.md,
    color: colors.neutral[600],
    fontWeight: typography.fontWeight.medium,
  },
  activeTabText: {
    color: colors.darkMode.primary[500],
    fontWeight: typography.fontWeight.semibold,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  halfInput: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
  formTitle: {
    fontSize: typography.fontSize.xxl,
    fontWeight: typography.fontWeight.bold,
    color: colors.neutral[800],
    textAlign: 'center',
    marginBottom: spacing.lg,
  },
  inputContainer: {
    marginBottom: spacing.lg,
  },
  inputLabel: {
    fontSize: typography.fontSize.md,
    fontWeight: typography.fontWeight.medium,
    color: colors.neutral[700],
    marginBottom: spacing.sm,
  },
  input: {
    borderWidth: 2,
    borderColor: colors.neutral[200],
    borderRadius: borderRadius.md,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    fontSize: typography.fontSize.md,
    color: colors.neutral[800],
    backgroundColor: colors.neutral.white,
  },
  inputFocused: {
    borderColor: colors.darkMode.primary[500],
    ...shadows.small,
  },
  inputError: {
    borderColor: colors.semantic.error,
  },
  errorText: {
    fontSize: typography.fontSize.sm,
    color: colors.semantic.error,
    marginTop: spacing.xs,
    marginLeft: spacing.xs,
  },
  loginButton: {
    borderRadius: borderRadius.md,
    paddingVertical: spacing.lg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.lg,
    ...shadows.medium,
  },
  loginButtonDisabled: {
    opacity: 0.6,
  },
  loginButtonText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral.white,
    marginLeft: spacing.sm,
  },
  forgotPasswordContainer: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  forgotPasswordText: {
    fontSize: typography.fontSize.md,
    color: colors.darkMode.primary[500],
    fontWeight: typography.fontWeight.medium,
  },
  footerContainer: {
    alignItems: 'center',
    marginTop: spacing.xxl,
  },
  footerText: {
    fontSize: typography.fontSize.sm,
    color: colors.neutral.white,
    textAlign: 'center',
    opacity: 0.8,
  },
  demoCredentials: {
    backgroundColor: colors.neutral[100],
    borderRadius: borderRadius.sm,
    padding: spacing.md,
    marginTop: spacing.lg,
    borderLeftWidth: 4,
    borderLeftColor: colors.darkMode.primary[500],
  },
  demoTitle: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.semibold,
    color: colors.neutral[700],
    marginBottom: spacing.xs,
  },
  demoText: {
    fontSize: typography.fontSize.xs,
    color: colors.neutral[600],
    lineHeight: 16,
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
});
