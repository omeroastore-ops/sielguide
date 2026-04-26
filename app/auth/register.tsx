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

export default function RegisterScreen() {
  const colors = useColors();
  const router = useRouter();
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async () => {
    setError(null);
    if (!email.trim() || !password) {
      setError("Bitte alle Felder ausfüllen.");
      return;
    }
    if (password.length < 6) {
      setError("Das Passwort muss mindestens 6 Zeichen lang sein.");
      return;
    }
    setLoading(true);
    try {
      await register(name, email, password);
      router.back();
    } catch {
      setError("Registrierung fehlgeschlagen.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      <ScreenHeader title="Registrieren" />
      <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 100, gap: 16 }}
          keyboardShouldPersistTaps="handled"
        >
          <View style={[styles.iconWrap, { backgroundColor: "rgba(34,211,238,0.18)" }]}>
            <Feather name="user-plus" size={28} color={colors.primary} />
          </View>
          <Text style={[styles.title, { color: colors.foreground }]}>Konto erstellen</Text>
          <Text style={[styles.sub, { color: colors.mutedForeground }]}>
            Speichere Favoriten, Routen und persönliche Tagespläne.
          </Text>

          <Field icon="user" placeholder="Name" value={name} onChangeText={setName} colors={colors} />
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
            placeholder="Passwort (min. 6 Zeichen)"
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
              {loading ? "Wird erstellt..." : "Konto erstellen"}
            </Text>
          </Pressable>

          <Text style={[styles.terms, { color: colors.mutedForeground }]}>
            Mit der Registrierung akzeptierst du unsere AGB und unsere Datenschutzerklärung.
          </Text>

          <Pressable onPress={() => router.replace("/auth/login" as never)} style={styles.linkBtn}>
            <Text style={[styles.linkText, { color: colors.primary }]}>
              Bereits ein Konto? Anmelden
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
  submitBtn: { paddingVertical: 14, alignItems: "center", marginTop: 8 },
  submitText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  terms: { fontSize: 11, textAlign: "center", lineHeight: 15, paddingHorizontal: 8 },
  linkBtn: { alignItems: "center", paddingVertical: 8 },
  linkText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});
