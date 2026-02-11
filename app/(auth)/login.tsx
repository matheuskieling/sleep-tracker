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
    <View className="flex-1 bg-surface">
      <KeyboardAwareScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: insets.bottom + 20 }}>
          <View className="flex-1 justify-center px-8">
            <Text className="text-heading-xl text-text text-center mb-2">
              Sleep Tracker
            </Text>
            <Text className="text-text-muted text-center mb-10 text-body">
              Acompanhe a qualidade do seu sono
            </Text>

            {error !== "" && (
              <View className="bg-danger-light border border-danger rounded-card p-4 mb-4">
                <Text className="text-danger-dark text-center text-sm">
                  {error}
                </Text>
              </View>
            )}

            <Text className="text-text-secondary text-sm mb-2 ml-1">Email</Text>
            <TextInput
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
              className="bg-surface-card border border-border text-text rounded-card p-4 mb-6"
              placeholder="Sua senha"
              placeholderTextColor="#A09389"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoComplete="password"
              returnKeyType="done"
              onSubmitEditing={handleSignIn}
            />

            <TouchableOpacity
              className="bg-accent rounded-button p-4 items-center mb-4"
              onPress={handleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              {loading ? (
                <ActivityIndicator color="#FFFFFF" />
              ) : (
                <Text className="text-text-inverse font-semibold text-body">
                  Entrar
                </Text>
              )}
            </TouchableOpacity>

            <Link
              href="/(auth)/forgot-password"
              style={{ color: "#652D07", textAlign: "center", fontSize: 14, marginBottom: 24 }}
            >
              Esqueceu sua senha?
            </Link>

            <View className="flex-row justify-center items-center">
              <Text className="text-text-muted text-sm">
                Nao tem uma conta?{" "}
              </Text>
              <Link
                href="/(auth)/register"
                style={{ color: "#652D07", fontWeight: "600", fontSize: 14 }}
              >
                Criar conta
              </Link>
            </View>
          </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
