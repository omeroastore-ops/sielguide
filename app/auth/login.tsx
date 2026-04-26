import { Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";

import { ScreenHeader } from "@/components/ScreenHeader";
import { useAuth } from "@/contexts/AuthContext";
import { useColors } from "@/hooks/useColors";

export default function LoginScreen() {
  const colors = useColors();
  const router = useRouter();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Bitte E-Mail und Passwort eingeben.");
      return;
    }
    setLoading(true);
    try {
      await login(email, password);
      router.back();
    } catch {
      setError("Anmeldung fehlgeschlagen. Bitte versuche es erneut.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Anmelden" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.iconWrap, { backgroundColor: "rgba(34,211,238,0.18)" }]}>
            <Feather name="log-in" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>
            Willkommen zurück
          </Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Melde dich an, um deine Favoriten und Tagespläne zu speichern.
          </Text>

          <Field
            icon="mail"
            placeholder="E-Mail"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            colors={colors}
          />
          <Field
            icon="lock"
            placeholder="Passwort"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            colors={colors}
          />

          {error && <Text style={[styles.error, { color: colors.destructive }]}>{error}</Text>}

          <Pressable
            onPress={submit}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitBtn,
              {
                backgroundColor: colors.primary,
                borderRadius: colors.radius,
                opacity: loading ? 0.7 : pressed ? 0.85 : 1,
              },
            ]}
          >
            <Text style={[styles.submitText, { color: colors.primaryForeground }]}>
              {loading ? "Wird angemeldet..." : "Anmelden"}
            </Text>
          </Pressable>

          <Pressable onPress={() => router.replace("/auth/register" as never)} style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Noch kein Konto? Jetzt registrieren
            </Text>
          </Pressable>

          <Pressable onPress={() => router.back()} style={styles.linkBtn}>
            <Text style={[styles.linkSub, { color: colors.mutedForeground }]}>
              Weiter ohne Konto
            </Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function Field({
  icon,
  colors,
  ...rest
}: React.ComponentProps<typeof TextInput> & {
  icon: keyof typeof Feather.glyphMap;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View
      style={[
        styles.field,
        { backgroundColor: colors.card, borderColor: colors.border, borderRadius: colors.radius },
      ]}
    >
      <Feather name={icon} size={16} color={colors.mutedForeground} />
      <TextInput
        {...rest}
        placeholderTextColor={colors.mutedForeground}
        style={[styles.input, { color: colors.foreground }]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  iconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignSelf: "center",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", textAlign: "center" },
  sub: { fontSize: 13, textAlign: "center", lineHeight: 18, marginBottom: 14 },
  field: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", padding: 0 },
  error: { fontSize: 13, textAlign: "center" },
  submitBtn: {
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
  },
  submitText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  linkBtn: { alignItems: "center", paddingVertical: 8 },
  linkText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  linkSub: { fontSize: 13, fontFamily: "Inter_500Medium" },
});
