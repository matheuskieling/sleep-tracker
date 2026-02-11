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
import { signIn } from "../../src/services/auth";

export default function LoginScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRef = useRef<TextInput>(null);

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
        setError("Usuario nao encontrado.");
      } else if (err.code === "auth/wrong-password") {
        setError("Senha incorreta.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalido.");
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
    <View className="flex-1 bg-base-900">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}>
          <View className="flex-1 justify-center px-8">
            <Text className="text-4xl font-bold text-base-100 text-center mb-2">
              Sleep Tracker
            </Text>
            <Text className="text-base-400 text-center mb-10 text-base">
              Acompanhe a qualidade do seu sono
            </Text>

            {error !== "" && (
              <View className="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-4">
                <Text className="text-red-300 text-center text-sm">
                  {error}
                </Text>
              </View>
            )}

            <Text className="text-base-300 text-sm mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-base-800 border border-base-700 text-base-100 rounded-xl p-4 mb-4"
              placeholder="seu@email.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
            />

            <Text className="text-base-300 text-sm mb-2 ml-1">Senha</Text>
            <TextInput
              ref={passwordRef}
              className="bg-base-800 border border-base-700 text-base-100 rounded-xl p-4 mb-6"
              placeholder="Sua senha"
              placeholderTextColor="#64748b"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />

            <TouchableOpacity
              className="bg-accent-dark rounded-xl p-4 items-center mb-4"
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#f1f5f9" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <Link
              href="/(auth)/forgot-password"
              style={{ color: "#6366f1", textAlign: "center", fontSize: 14, marginBottom: 24 }}
            >
              Esqueceu sua senha?
            </Link>

            <View className="flex-row justify-center items-center">
              <Text className="text-base-400 text-sm">
                Nao tem uma conta?{" "}
              </Text>
              <Link
                href="/(auth)/register"
                style={{ color: "#6366f1", fontWeight: "600", fontSize: 14 }}
              >
                Criar conta
              </Link>
            </View>
          </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
