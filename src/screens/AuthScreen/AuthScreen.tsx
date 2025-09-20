import React, { useState, useEffect } from 'react';
import {
  View,
  ScrollView,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import { Typography } from '../../components';
import { useAuth } from '../../hooks/useAuth';
import { colors } from '../../constants/theme';
import { styles } from './AuthScreen.styles';
import PrimaryButton from '../../components/molecules/PrimaryButton/PrimaryButton';
import GradientText from '../../components/molecules/GradientText/GradientText';
import SegmentedControl from '../../components/molecules/SegmentedControl/SegmentedControl';

export const AuthScreen = () => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);
  const [_showPassword, _setShowPassword] = useState(false);

  // Login form state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  // Register form state
  const [registerData, setRegisterData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const { login, register, error, isLoginLoading, isRegisterLoading } =
    useAuth();

  // Clear error when inputs change - TanStack Query otomatik handle eder
  useEffect(() => {
    // Error otomatik temizlenir yeni mutation başladığında
  }, [username, password]);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Hata', 'Lütfen kullanıcı adı ve şifrenizi giriniz.');
      return;
    }

    try {
      await login({ username: username.trim(), password: password.trim() });
      // Navigation will be handled by the navigation logic
    } catch (err: any) {
      Alert.alert(
        'Giriş Başarısız',
        err.message || 'Kullanıcı adı veya şifre hatalı.',
      );
    }
  };

  const handleRegister = async () => {
    // Basit validasyon
    if (!registerData.username.trim() || !registerData.password.trim()) {
      Alert.alert('Hata', 'Lütfen tüm zorunlu alanları doldurunuz.');
      return;
    }

    if (registerData.password !== registerData.confirmPassword) {
      Alert.alert('Hata', 'Şifreler eşleşmiyor.');
      return;
    }

    if (registerData.password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalıdır.');
      return;
    }

    try {
      await register({
        username: registerData.username.trim(),
        password: registerData.password.trim(),
      });
    } catch (err: any) {
      Alert.alert(
        'Kayıt Başarısız',
        err.message || 'Kayıt işlemi sırasında bir hata oluştu.',
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
      <SafeAreaView
        style={[styles.container, { backgroundColor: 'rgba(0,0,0,0.15)' }]}
      >
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
            contentContainerStyle={styles.scrollContainer}
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
                Global Store
              </GradientText>
              <GradientText
                colors={[colors.primary, colors.secondary]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                locations={[0, 1]}
                style={styles.appSubtitle}
              >
                Discover amazing products worldwide
              </GradientText>
            </View>

            <View style={styles.formContainer}>
              <View style={styles.tabContainer}>
                <SegmentedControl
                  options={['Giriş Yap', 'Kayıt Ol']}
                  onValueChange={(value, index) => {
                    setActiveTab(index === 0 ? 'login' : 'register');
                  }}
                  initialIndex={activeTab === 'login' ? 0 : 1}
                />
              </View>

              <Typography variant="h2" style={styles.formTitle}>
                {activeTab === 'login' ? 'Hoş Geldiniz' : 'Hesap Oluşturun'}
              </Typography>

              {activeTab === 'login' ? (
                <>
                  {/* Login Form */}
                  {/* Username Input */}
                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      Kullanıcı Adı
                    </Typography>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'username' && styles.inputFocused,
                        error && styles.inputError,
                      ]}
                      value={username}
                      onChangeText={setUsername}
                      onFocus={() => setFocusedInput('username')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Kullanıcı adınızı giriniz"
                      placeholderTextColor={colors.neutral[400]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoginLoading}
                    />
                  </View>

                  {/* Password Input */}
                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      Şifre
                    </Typography>
                    <TextInput
                      style={[
                        styles.input,
                        focusedInput === 'password' && styles.inputFocused,
                        error && styles.inputError,
                      ]}
                      value={password}
                      onChangeText={setPassword}
                      onFocus={() => setFocusedInput('password')}
                      onBlur={() => setFocusedInput(null)}
                      placeholder="Şifrenizi giriniz"
                      placeholderTextColor={colors.neutral[400]}
                      secureTextEntry={!_showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isLoginLoading}
                    />
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
                      Kullanıcı Adı *
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
                      placeholder="Kullanıcı adınızı giriniz"
                      placeholderTextColor={colors.neutral[400]}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isRegisterLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      Şifre *
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
                      placeholder="Şifrenizi giriniz (min 6 karakter)"
                      placeholderTextColor={colors.neutral[400]}
                      secureTextEntry={!_showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isRegisterLoading}
                    />
                  </View>

                  <View style={styles.inputContainer}>
                    <Typography variant="body" style={styles.inputLabel}>
                      Şifre Tekrarı *
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
                      placeholder="Şifrenizi tekrar giriniz"
                      placeholderTextColor={colors.neutral[400]}
                      secureTextEntry={!_showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      editable={!isRegisterLoading}
                    />
                    {registerData.password !== registerData.confirmPassword &&
                      registerData.confirmPassword.length > 0 && (
                        <Typography variant="caption" style={styles.errorText}>
                          Şifreler eşleşmiyor
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
                title={activeTab === 'login' ? 'Giriş Yap' : 'Hesap Oluştur'}
                disabled={
                  activeTab === 'login'
                    ? isLoginLoading || !username.trim() || !password.trim()
                    : isRegisterLoading ||
                      !registerData.username.trim() ||
                      !registerData.password.trim() ||
                      registerData.password !== registerData.confirmPassword
                }
                loading={
                  activeTab === 'login' ? isLoginLoading : isRegisterLoading
                }
                onPress={activeTab === 'login' ? handleLogin : handleRegister}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </ImageBackground>
  );
};
