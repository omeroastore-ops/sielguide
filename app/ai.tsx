import { Feather } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { KeyboardAvoidingView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { PlaceCard } from "@/components/PlaceCard";
import { useColors } from "@/hooks/useColors";
import { PLACES } from "@/services/mockData";
import { generateLocalRecommendation } from "@/services/ai/sielguideAI";
import type { ChatMessage, Place } from "@/types/models";

const QUICK_CHIPS = [
  { icon: "coffee" as const, label: "Wo essen?" },
  { icon: "coffee" as const, label: "Ruhiges Café" },
  { icon: "compass" as const, label: "Aktivitäten" },
  { icon: "home" as const, label: "Hotels" },
  { icon: "heart" as const, label: "Romantisch" },
  { icon: "calendar" as const, label: "Tag planen" },
  { icon: "trending-up" as const, label: "Beliebt heute" },
  { icon: "cloud-rain" as const, label: "Bei Regen" },
];

const WELCOME: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Hallo! Ich bin dein persönlicher Guide für Carolinensiel. Ich helfe dir, die besten Orte, Restaurants, Aktivitäten und Veranstaltungen zu finden.",
  createdAt: Date.now(),
};

function makeId() {
  return Date.now().toString() + Math.random().toString(36).slice(2, 9);
}

function timeOf(ts: number) {
  const d = new Date(ts);
  return `${d.getHours().toString().padStart(2, "0")}:${d.getMinutes().toString().padStart(2, "0")}`;
}

export default function AIScreen() {
  const colors = useColors();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [typing, setTyping] = useState(false);
  const [micOpen, setMicOpen] = useState(false);
  const listRef = useRef<FlatList>(null);

  const send = useCallback((text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (Platform.OS !== "web") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
    const userMsg: ChatMessage = {
      id: makeId(),
      role: "user",
      text: trimmed,
      createdAt: Date.now(),
    };
    setMessages((prev) => [userMsg, ...prev]);
    setInput("");
    setTyping(true);
    setTimeout(() => {
      const reply = generateLocalRecommendation(trimmed, PLACES);
      const assistantMsg: ChatMessage =
        reply.kind === "recommendation"
          ? {
              id: makeId(),
              role: "assistant",
              text: reply.text,
              places: reply.places,
              createdAt: Date.now(),
            }
          : {
              id: makeId(),
              role: "assistant",
              text: reply.text,
              createdAt: Date.now(),
            };
      setMessages((prev) => [assistantMsg, ...prev]);
      setTyping(false);
    }, 700);
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => {
      const isUser = item.role === "user";
      return (
        <View style={[styles.msgRow, isUser ? styles.userRow : styles.botRow]}>
          {!isUser && (
            <View style={[styles.botAvatar, { backgroundColor: colors.secondary }]}>
              <Image
                source={require("@/assets/images/ai-avatar.png")}
                style={{ width: 32, height: 32, borderRadius: 16 }}
                contentFit="cover"
              />
            </View>
          )}
          <View style={{ flex: 1, maxWidth: isUser ? "85%" : "100%" }}>
            <View
              style={[
                styles.bubble,
                isUser
                  ? { backgroundColor: colors.primary, alignSelf: "flex-end" }
                  : { backgroundColor: colors.card, borderColor: colors.border, borderWidth: StyleSheet.hairlineWidth },
              ]}
            >
              <Text
                style={[
                  styles.bubbleText,
                  { color: isUser ? colors.primaryForeground : colors.foreground },
                ]}
              >
                {item.text}
              </Text>
              <Text
                style={[
                  styles.timeText,
                  {
                    color: isUser
                      ? "rgba(4,18,30,0.6)"
                      : colors.mutedForeground,
                    textAlign: isUser ? "right" : "left",
                  },
                ]}
              >
                {timeOf(item.createdAt)}
              </Text>
            </View>

            {item.role === "assistant" && item.places && item.places.length > 0 && (
              <View style={styles.recommendList}>
                {item.places.map((p: Place, i: number) => (
                  <View key={p.id} style={{ flexDirection: "row", gap: 8 }}>
                    <Text style={[styles.recIndex, { color: colors.mutedForeground }]}>
                      {i + 1}.
                    </Text>
                    <View style={{ flex: 1 }}>
                      <PlaceCard place={p} variant="wide" />
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      );
    },
    [colors],
  );

  return (
    <View style={[styles.root, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Pressable
          onPress={() => router.back()}
          style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
          hitSlop={10}
        >
          <Feather name="chevron-left" size={20} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1, alignItems: "center" }}>
          <Text style={[styles.headerTitle, { color: colors.foreground }]}>SielGuide AI</Text>
          <Text style={[styles.headerSub, { color: colors.primary }]}>
            Dein persönlicher Guide
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/ai-history" as never)}
          style={[styles.iconBtn, { backgroundColor: colors.secondary }]}
          hitSlop={10}
        >
          <Feather name="clock" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior="padding"
        keyboardVerticalOffset={0}
      >
        <FlatList
          ref={listRef}
          data={messages}
          inverted
          keyExtractor={(m) => m.id}
          renderItem={renderItem}
          contentContainerStyle={{ padding: 16, gap: 12 }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="interactive"
          ListHeaderComponent={
            typing ? (
              <View style={[styles.msgRow, styles.botRow]}>
                <View style={[styles.botAvatar, { backgroundColor: colors.secondary }]}>
                  <Image
                    source={require("@/assets/images/ai-avatar.png")}
                    style={{ width: 32, height: 32, borderRadius: 16 }}
                    contentFit="cover"
                  />
                </View>
                <View
                  style={[
                    styles.bubble,
                    {
                      backgroundColor: colors.card,
                      borderColor: colors.border,
                      borderWidth: StyleSheet.hairlineWidth,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 4,
                    },
                  ]}
                >
                  <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
                  <View style={[styles.typingDot, { backgroundColor: colors.mutedForeground }]} />
                </View>
              </View>
            ) : null
          }
        />

        {/* Quick chips — wrapped, smaller, aligned */}
        <View style={styles.chipsWrap}>
          {QUICK_CHIPS.map((c) => (
            <Pressable
              key={c.label}
              onPress={() => send(c.label)}
              style={({ pressed }) => [
                styles.chip,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.7 : 1,
                },
              ]}
            >
              <Feather name={c.icon} size={12} color={colors.primary} />
              <Text style={[styles.chipText, { color: colors.foreground }]}>{c.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Input */}
        <View
          style={[
            styles.inputRow,
            {
              borderTopColor: colors.border,
              backgroundColor: colors.background,
              paddingBottom: Math.max(insets.bottom, 12),
            },
          ]}
        >
          <View
            style={[
              styles.inputWrap,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Frag mich etwas über Carolinensiel..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.input, { color: colors.foreground }]}
              multiline
              maxLength={500}
              onSubmitEditing={() => send(input)}
            />
            <Pressable
              onPress={() => setMicOpen(true)}
              hitSlop={8}
              style={styles.micBtn}
            >
              <Feather name="mic" size={18} color={colors.mutedForeground} />
            </Pressable>
          </View>
          <Pressable
            onPress={() => send(input)}
            disabled={!input.trim()}
            style={({ pressed }) => [
              styles.sendBtn,
              {
                backgroundColor: input.trim() ? colors.primary : colors.muted,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Feather
              name="send"
              size={18}
              color={input.trim() ? colors.primaryForeground : colors.mutedForeground}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>

      {/* Mic / Coming-soon modal */}
      <Modal
        visible={micOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setMicOpen(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setMicOpen(false)}>
          <Pressable
            onPress={() => {}}
            style={[
              styles.modalCard,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderRadius: colors.radius,
              },
            ]}
          >
            <View style={[styles.modalIcon, { backgroundColor: colors.secondary }]}>
              <Feather name="mic" size={26} color={colors.primary} />
            </View>
            <Text style={[styles.modalTitle, { color: colors.foreground }]}>
              Sprachaufnahme kommt bald.
            </Text>
            <Text style={[styles.modalSub, { color: colors.mutedForeground }]}>
              Diese Funktion ist noch in Entwicklung.
            </Text>
            <Pressable
              onPress={() => setMicOpen(false)}
              style={({ pressed }) => [
                styles.modalBtn,
                {
                  backgroundColor: colors.primary,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <Text style={[styles.modalBtnText, { color: colors.primaryForeground }]}>
                Verstanden
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 12,
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  headerSub: { fontSize: 11, fontFamily: "Inter_500Medium", marginTop: 2 },

  msgRow: { flexDirection: "row", alignItems: "flex-start", gap: 8 },
  userRow: { justifyContent: "flex-end" },
  botRow: { justifyContent: "flex-start" },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
  },
  bubble: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 18,
    minWidth: 80,
  },
  bubbleText: { fontSize: 14, lineHeight: 19, fontFamily: "Inter_400Regular" },
  timeText: { fontSize: 10, marginTop: 4, fontFamily: "Inter_400Regular" },
  typingDot: { width: 6, height: 6, borderRadius: 3, marginHorizontal: 2 },

  recommendList: { marginTop: 10, gap: 8 },
  recIndex: { fontSize: 13, fontFamily: "Inter_700Bold", paddingTop: 4 },

  chipsWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 12,
    paddingVertical: 8,
    gap: 6,
    alignItems: "flex-start",
  },
  chip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: StyleSheet.hairlineWidth,
    alignSelf: "flex-start",
  },
  chipText: { fontSize: 11, fontFamily: "Inter_500Medium" },

  inputRow: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 8,
    paddingHorizontal: 12,
    paddingTop: 8,
    borderTopWidth: StyleSheet.hairlineWidth,
  },
  inputWrap: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 24,
    paddingHorizontal: 14,
    minHeight: 44,
    borderWidth: StyleSheet.hairlineWidth,
  },
  input: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 14,
    fontFamily: "Inter_400Regular",
    maxHeight: 100,
  },
  micBtn: { padding: 4 },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
  },

  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    alignItems: "center",
    justifyContent: "center",
    padding: 32,
  },
  modalCard: {
    width: "100%",
    maxWidth: 320,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  modalIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  modalTitle: { fontSize: 16, fontFamily: "Inter_600SemiBold", textAlign: "center" },
  modalSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  modalBtn: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 999,
    marginTop: 8,
  },
  modalBtnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
