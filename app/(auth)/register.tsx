import { useState } from "react";
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

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password.trim() || !confirmPassword.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    if (password !== confirmPassword) {
      setError("As senhas não coincidem.");
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
        setError("Este email já está em uso.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido.");
      } else if (err.code === "auth/weak-password") {
        setError("A senha é muito fraca. Use pelo menos 6 caracteres.");
      } else {
        setError("Erro ao criar conta. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-primary-950">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}>
          <View className="flex-1 justify-center px-8">
            <Text className="text-4xl font-bold text-indigo-100 text-center mb-2">
              Sleep Tracker
            </Text>
            <Text className="text-indigo-300 text-center mb-10 text-base">
              Crie sua conta
            </Text>

            {error !== "" && (
              <View className="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-4">
                <Text className="text-red-300 text-center text-sm">
                  {error}
                </Text>
              </View>
            )}

            <Text className="text-indigo-200 text-sm mb-2 ml-1">Nome</Text>
            <TextInput
              className="bg-primary-900 border border-indigo-700 text-white rounded-xl p-4 mb-4"
              placeholder="Seu nome"
              placeholderTextColor="#6366f1"
              value={name}
              onChangeText={setName}
              autoCapitalize="words"
              autoComplete="name"
            />

            <Text className="text-indigo-200 text-sm mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-primary-900 border border-indigo-700 text-white rounded-xl p-4 mb-4"
              placeholder="seu@email.com"
              placeholderTextColor="#6366f1"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <Text className="text-indigo-200 text-sm mb-2 ml-1">Senha</Text>
            <TextInput
              className="bg-primary-900 border border-indigo-700 text-white rounded-xl p-4 mb-4"
              placeholder="Mínimo 6 caracteres"
              placeholderTextColor="#6366f1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            <Text className="text-indigo-200 text-sm mb-2 ml-1">
              Confirmar Senha
            </Text>
            <TextInput
              className="bg-primary-900 border border-indigo-700 text-white rounded-xl p-4 mb-6"
              placeholder="Repita a senha"
              placeholderTextColor="#6366f1"
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              secureTextEntry
              autoComplete="new-password"
            />

            <TouchableOpacity
              className="bg-indigo-600 rounded-xl p-4 items-center mb-6"
              onPress={handleSignUp}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#e0e7ff" />
              ) : (
                <Text className="text-indigo-100 font-semibold text-base">
                  Criar Conta
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
              <Text className="text-indigo-300 text-sm">
                Já tem uma conta?{" "}
              </Text>
              <Link
                href="/(auth)/login"
                style={{ color: "#818cf8", fontWeight: "600", fontSize: 14 }}
              >
                Entrar
              </Link>
            </View>
          </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
