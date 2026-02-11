import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter, Link } from "expo-router";
import { signUp } from "../../src/services/auth";
import { useAuth } from "../../src/hooks/useAuth";

export default function RegisterScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { refreshUserName } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas nao coincidem.");
      return;
    }

    if (password.length < 6) {
      setError("A senha deve ter pelo menos 6 caracteres.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signUp(email.trim(), password, name.trim());
      await refreshUserName();
    } catch (err: any) {
      if (err.code === "auth/email-already-in-use") {
        setError("Este email ja esta em uso.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalido.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha e muito fraca. Use pelo menos 6 caracteres.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-surface">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}>
          <View className="flex-1 justify-center px-8">
            <Text className="text-heading-xl text-text text-center mb-2">
              Sleep Tracker
            </Text>
            <Text className="text-text-muted text-center mb-10 text-body">
              Crie sua conta
            </Text>

            {error !== "" && (
              <View className="bg-danger-light border border-danger rounded-card p-4 mb-4">
                <Text className="text-danger-dark text-center text-sm">
                  {error}
                </Text>
              </View>
            )}

            <Text className="text-text-secondary text-sm mb-2 ml-1">Nome</Text>
            <TextInput
              className="bg-surface-card border border-border text-text rounded-card p-4 mb-4"
              placeholder="Seu nome"
              placeholderTextColor="#A09389"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
            />

            <Text className="text-text-secondary text-sm mb-2 ml-1">Email</Text>
            <TextInput
              ref={emailRef}
              className="bg-surface-card border border-border text-text rounded-card p-4 mb-4"
              placeholder="seu@email.com"
              placeholderTextColor="#A09389"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <Text className="text-text-secondary text-sm mb-2 ml-1">Senha</Text>
            <TextInput
              ref={passwordRef}
              className="bg-surface-card border border-border text-text rounded-card p-4 mb-4"
              placeholder="Minimo 6 caracteres"
              placeholderTextColor="#A09389"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
              returnKeyType="next"
              onSubmitEditing={() => confirmRef.current?.focus()}
            />

            <Text className="text-text-secondary text-sm mb-2 ml-1">
              Confirmar Senha
            </Text>
            <TextInput
              ref={confirmRef}
              className="bg-surface-card border border-border text-text rounded-card p-4 mb-6"
              placeholder="Repita a senha"
              placeholderTextColor="#A09389"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
              returnKeyType="done"
              onSubmitEditing={handleSignUp}
            />

            <TouchableOpacity
              className="bg-accent rounded-button p-4 items-center mb-6"
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-text-inverse font-semibold text-body">
                  Criar Conta
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
              <Text className="text-text-muted text-sm">
                Ja tem uma conta?{" "}
              </Text>
              <Link
                href="/(auth)/login"
                style={{ color: "#652D07", fontWeight: "600", fontSize: 14 }}
              >
                Entrar
              </Link>
            </View>
          </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
