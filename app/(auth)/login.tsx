import { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter, Link } from "expo-router";
import { signIn } from "../../src/services/auth";

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError("Preencha todos os campos.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Usuário não encontrado.");
      } else if (err.code === "auth/wrong-password") {
        setError("Senha incorreta.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email inválido.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setError("Erro ao entrar. Tente novamente.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <View className="flex-1 bg-primary-950">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
        >
          <View className="flex-1 justify-center px-8">
            <Text className="text-4xl font-bold text-indigo-100 text-center mb-2">
              Sleep Tracker
            </Text>
            <Text className="text-indigo-300 text-center mb-10 text-base">
              Acompanhe a qualidade do seu sono
            </Text>

            {error !== "" && (
              <View className="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-4">
                <Text className="text-red-300 text-center text-sm">
                  {error}
                </Text>
              </View>
            )}

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
              className="bg-primary-900 border border-indigo-700 text-white rounded-xl p-4 mb-6"
              placeholder="Sua senha"
              placeholderTextColor="#6366f1"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
            />

            <TouchableOpacity
              className="bg-indigo-600 rounded-xl p-4 items-center mb-4"
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#e0e7ff" />
              ) : (
                <Text className="text-indigo-100 font-semibold text-base">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <Link
              href="/(auth)/forgot-password"
              style={{ color: "#818cf8", textAlign: "center", fontSize: 14, marginBottom: 24 }}
            >
              Esqueceu sua senha?
            </Link>

            <View className="flex-row justify-center items-center">
              <Text className="text-indigo-300 text-sm">
                Não tem uma conta?{" "}
              </Text>
              <Link
                href="/(auth)/register"
                style={{ color: "#818cf8", fontWeight: "600", fontSize: 14 }}
              >
                Criar conta
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
