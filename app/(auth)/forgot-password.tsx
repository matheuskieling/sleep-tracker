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
import { resetPassword } from "../../src/services/auth";

export default function ForgotPasswordScreen() {
  const router = useRouter();
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
        setError("Email inválido.");
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
                  Email de recuperação enviado! Verifique sua caixa de entrada.
                </Text>
              </View>
            )}

            <Text className="text-indigo-200 text-sm mb-2 ml-1">Email</Text>
            <TextInput
              className="bg-primary-900 border border-indigo-700 text-white rounded-xl p-4 mb-6"
              placeholder="seu@email.com"
              placeholderTextColor="#6366f1"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
            />

            <TouchableOpacity
              className="bg-indigo-600 rounded-xl p-4 items-center mb-6"
              onPress={handleResetPassword}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#e0e7ff" />
              ) : (
                <Text className="text-indigo-100 font-semibold text-base">
                  Enviar Email de Recuperação
                </Text>
              )}
            </TouchableOpacity>

            <View className="flex-row justify-center items-center">
              <Text className="text-indigo-300 text-sm">
                Lembrou a senha?{" "}
              </Text>
              <Link
                href="/(auth)/login"
                style={{ color: "#818cf8", fontWeight: "600", fontSize: 14 }}
              >
                Voltar ao login
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
