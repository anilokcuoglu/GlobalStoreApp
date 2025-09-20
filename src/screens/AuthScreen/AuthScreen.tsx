import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  TouchableOpacity,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTranslation } from 'react-i18next';
import { Typography } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/theme';
import { styles } from './AuthScreen.styles';
import PrimaryButton from '../../components/molecules/PrimaryButton/PrimaryButton';
import GradientText from '../../components/molecules/GradientText/GradientText';
import SegmentedControl from '../../components/molecules/SegmentedControl/SegmentedControl';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export const AuthScreen = () => {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loginData, setLoginData] = useState({
    username: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    id: 0,
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { login, register, error, isLoginLoading, isRegisterLoading } =
    useAuth();

  useEffect(() => {}, [loginData.username, loginData.password]);

  const mockUsers = [
    { username: 'donero', password: 'ewedon', name: 'Test User 3' },
  ];

  const handleMockLogin = (user: (typeof mockUsers)[0]) => {
    setLoginData({
      username: user.username,
      password: user.password,
    });
    Alert.alert(t('auth.autoFill'), `${user.name} ${t('auth.autoFillMessage')}`);
  };

  const handleLogin = async () => {
    if (!loginData.username.trim() || !loginData.password.trim()) {
      Alert.alert(t('common.error'), t('auth.loginError'));
      return;
    }

    try {
      await login({
        username: loginData.username.trim(),
        password: loginData.password.trim(),
      });
      // Navigation will be handled by the navigation logic
    } catch (err: any) {
      Alert.alert(
        t('auth.loginFailed'),
        err.message || t('auth.loginFailedMessage'),
      );
    }
  };

  const handleRegister = async () => {
    if (!registerData.username.trim() || !registerData.password.trim()) {
      Alert.alert(t('common.error'), t('auth.registerError'));
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert(t('common.error'), t('auth.passwordMismatch'));
      return;
    }

    if (registerData.password.length < 6) {
      Alert.alert(t('common.error'), t('auth.passwordMinError'));
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(registerData.email)) {
      Alert.alert(t('common.error'), t('auth.emailInvalid'));
      return;
    }

    try {
      await register({
        id: registerData.id,
        email: registerData.email.trim(),
        username: registerData.username.trim(),
        password: registerData.password.trim(),
      });

      // Register başarılı olduğunda login tab'ına geç
      Alert.alert(
        t('auth.registerSuccess'),
        t('auth.registerSuccessMessage'),
        [
          {
            text: t('auth.ok'),
            onPress: () => {
              setActiveTab('login');
              setRegisterData({
                id: 0,
                email: '',
                username: '',
                password: '',
                confirmPassword: '',
              });
            },
          },
        ],
      );
    } catch (err: any) {
      Alert.alert(
        t('auth.registerFailed'),
        err.message || t('auth.registerFailedMessage'),
      );
    }
  };

  return (
    <ImageBackground
      source={{
        uri: 'https://images.unsplash.com/photo-1556742111-a301076d9d18?w=800&h=600&fit=crop&q=80',
      }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <LinearGradient
          colors={['transparent', 'rgba(0,0,0,0.99)']}
          locations={[0.4, 1.0]}
          style={styles.gradientOverlay}
        />

        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={[
              styles.scrollContainer,
              { paddingBottom: insets.bottom },
            ]}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <GradientText
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 1]}
                style={styles.appName}
              >
                {t('auth.appName')}
              </GradientText>
              <GradientText
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 1]}
                style={styles.appSubtitle}
              >
                {t('auth.appSubtitle')}
              </GradientText>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.tabContainer}>
                <SegmentedControl
                  options={[t('auth.login'), t('auth.register')]}
                  onValueChange={(value, index) => {
                    setActiveTab(index === 0 ? 'login' : 'register');
                  }}
                  initialIndex={activeTab === 'login' ? 0 : 1}
                />
              </View>

              <Typography variant="h2" style={styles.formTitle}>
                {activeTab === 'login' ? t('auth.welcome') : t('auth.createAccount')}
              </Typography>

              {activeTab === 'login' && (
                <View style={styles.mockLoginContainer}>
                  <Typography variant="body" style={styles.mockLoginTitle}>
                    {t('auth.directLogin')}
                  </Typography>
                  {mockUsers.map((user: any, index: any) => (
                    <TouchableOpacity
                      key={index}
                      style={styles.mockLoginButton}
                      onPress={() => handleMockLogin(user)}
                    >
                      <Typography
                        variant="body"
                        style={styles.mockLoginButtonText}
                      >
                        {user.name} ({user.username})
                      </Typography>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {activeTab === 'login' ? (
                <>
                  {/* Login Form */}
                  {/* Username Input */}
                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      {t('auth.username')}
                    </Typography>

                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'username' && styles.inputFocused,
                        error && styles.inputError,
                      ]}
                      value={loginData.username}
                      onChangeText={text =>
                        setLoginData(prev => ({ ...prev, username: text }))
                      }
                      onFocus={() => setFocusedInput('username')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder={t('auth.usernamePlaceholder')}
                      placeholderTextColor={colors.neutral[400]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoginLoading}
                    />
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      {t('auth.password')}
                    </Typography>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'password' && styles.inputFocused,
                        error && styles.inputError,
                      ]}
                      value={loginData.password}
                      onChangeText={text =>
                        setLoginData(prev => ({ ...prev, password: text }))
                      }
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder={t('auth.passwordPlaceholder')}
                      placeholderTextColor={colors.neutral[400]}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoginLoading}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(prev => !prev)}
                    >
                      <Typography
                        variant="body"
                        style={styles.passwordToggleText}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </Typography>
                    </TouchableOpacity>
                    {error && (
                      <Typography variant="caption" style={styles.errorText}>
                        {error}
                      </Typography>
                    )}
                  </View>
                </>
              ) : (
                <>
                  {/* Register Form */}
                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      {t('auth.username')} {t('auth.required')}
                    </Typography>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'registerUsername' &&
                          styles.inputFocused,
                      ]}
                      value={registerData.username}
                      onChangeText={text =>
                        setRegisterData(prev => ({ ...prev, username: text }))
                      }
                      onFocus={() => setFocusedInput('registerUsername')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder={t('auth.usernamePlaceholder')}
                      placeholderTextColor={colors.neutral[400]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isRegisterLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      {t('auth.email')}
                    </Typography>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'email' && styles.inputFocused,
                        error && styles.inputError,
                      ]}
                      value={registerData.email}
                      onChangeText={text =>
                        setRegisterData(prev => ({ ...prev, email: text }))
                      }
                      onFocus={() => setFocusedInput('email')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder={t('auth.emailPlaceholder')}
                      placeholderTextColor={colors.neutral[400]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoginLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      {t('auth.password')} {t('auth.required')}
                    </Typography>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'registerPassword' &&
                          styles.inputFocused,
                      ]}
                      value={registerData.password}
                      onChangeText={text =>
                        setRegisterData(prev => ({ ...prev, password: text }))
                      }
                      onFocus={() => setFocusedInput('registerPassword')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder={t('auth.passwordMinLength')}
                      placeholderTextColor={colors.neutral[400]}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isRegisterLoading}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(prev => !prev)}
                    >
                      <Typography
                        variant="body"
                        style={styles.passwordToggleText}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </Typography>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      {t('auth.confirmPassword')} {t('auth.required')}
                    </Typography>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'confirmPassword' &&
                          styles.inputFocused,
                        registerData.password !==
                          registerData.confirmPassword &&
                          registerData.confirmPassword.length > 0 &&
                          styles.inputError,
                      ]}
                      value={registerData.confirmPassword}
                      onChangeText={text =>
                        setRegisterData(prev => ({
                          ...prev,
                          confirmPassword: text,
                        }))
                      }
                      onFocus={() => setFocusedInput('confirmPassword')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder={t('auth.confirmPasswordPlaceholder')}
                      placeholderTextColor={colors.neutral[400]}
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isRegisterLoading}
                    />
                    <TouchableOpacity
                      style={styles.passwordToggle}
                      onPress={() => setShowPassword(prev => !prev)}
                    >
                      <Typography
                        variant="body"
                        style={styles.passwordToggleText}
                      >
                        {showPassword ? '🙈' : '👁️'}
                      </Typography>
                    </TouchableOpacity>
                    {registerData.password !== registerData.confirmPassword &&
                      registerData.confirmPassword.length > 0 && (
                        <Typography variant="caption" style={styles.errorText}>
                          {t('auth.passwordMismatch')}
                        </Typography>
                      )}
                  </View>

                  {error && (
                    <Typography variant="caption" style={styles.errorText}>
                      {error}
                    </Typography>
                  )}
                </>
              )}

              <PrimaryButton
                title={activeTab === 'login' ? t('auth.login') : t('auth.createAccountButton')}
                disabled={
                  activeTab === 'login'
                    ? isLoginLoading ||
                      !loginData.username.trim() ||
                      !loginData.password.trim()
                    : isRegisterLoading ||
                      !registerData.username.trim() ||
                      !registerData.password.trim() ||
                      registerData.password !== registerData.confirmPassword
                }
                loading={
                  activeTab === 'login' ? isLoginLoading : isRegisterLoading
                }
                onPress={activeTab === 'login' ? handleLogin : handleRegister}
                style={styles.button}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </ImageBackground>
  );
};
