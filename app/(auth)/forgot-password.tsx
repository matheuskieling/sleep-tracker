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
import { resetPassword } from "../../src/services/auth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleResetPassword() {
    if (!email.trim()) {
      setError("Preencha o campo de email.");
      return;
    }

    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      await resetPassword(email.trim());
      setSuccess(true);
    } catch (err: any) {
      if (err.code === "auth/user-not-found") {
        setError("Nenhuma conta encontrada com este email.");
      } else if (err.code === "auth/invalid-email") {
        setError("Email invalido.");
      } else if (err.code === "auth/too-many-requests") {
        setError("Muitas tentativas. Tente novamente mais tarde.");
      } else {
        setError("Erro ao enviar email. Tente novamente.");
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
              Recuperar senha
            </Text>

            {error !== "" && (
              <View className="bg-red-900/50 border border-red-500 rounded-xl p-4 mb-4">
                <Text className="text-red-300 text-center text-sm">
                  {error}
                </Text>
              </View>
            )}

            {success && (
              <View className="bg-emerald-900/50 border border-emerald-500 rounded-xl p-4 mb-4">
                <Text className="text-emerald-300 text-center text-sm">
                  Email de recuperacao enviado! Verifique sua caixa de entrada.
                </Text>
              </View>
            )}

            <Text className="text-base-300 text-sm mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-base-800 border border-base-700 text-base-100 rounded-xl p-4 mb-6"
              placeholder="seu@email.com"
              placeholderTextColor="#64748b"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              returnKeyType="done"
              onSubmitEditing={handleResetPassword}
            />

            <TouchableOpacity
              className="bg-accent-dark rounded-xl p-4 items-center mb-6"
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#f1f5f9" />
              ) : (
                <Text className="text-white font-semibold text-base">
                  Enviar Email de Recuperacao
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
              <Text className="text-base-400 text-sm">
                Lembrou a senha?{" "}
              </Text>
              <Link
                href="/(auth)/login"
                style={{ color: "#6366f1", fontWeight: "600", fontSize: 14 }}
              >
                Voltar ao login
              </Link>
            </View>
          </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
