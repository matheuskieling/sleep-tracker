import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import * as Clipboard from "expo-clipboard";

interface ReportViewProps {
  report: string;
}

const mdStyles = {
  body: { color: "#f1f5f9", fontSize: 14, lineHeight: 22 },
  heading1: { color: "#e2e8f0", fontSize: 20, fontWeight: "bold" as const, marginBottom: 8, marginTop: 12 },
  heading2: { color: "#e2e8f0", fontSize: 17, fontWeight: "bold" as const, marginBottom: 6, marginTop: 10 },
  heading3: { color: "#e2e8f0", fontSize: 15, fontWeight: "600" as const, marginBottom: 4, marginTop: 8 },
  paragraph: { color: "#f1f5f9", marginBottom: 8 },
  strong: { color: "#f1f5f9", fontWeight: "bold" as const },
  em: { color: "#94a3b8", fontStyle: "italic" as const },
  bullet_list: { marginBottom: 8 },
  ordered_list: { marginBottom: 8 },
  list_item: { color: "#f1f5f9", marginBottom: 4 },
  bullet_list_icon: { color: "#6366f1", marginRight: 8 },
  ordered_list_icon: { color: "#6366f1", marginRight: 8 },
  hr: { backgroundColor: "#334155", height: 1, marginVertical: 12 },
  blockquote: { backgroundColor: "#1e293b", borderLeftColor: "#818cf8", borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 4, marginBottom: 8 },
};

export function ReportView({ report }: ReportViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View className="bg-base-800 rounded-2xl p-4 mt-4">
      <TouchableOpacity
        onPress={handleCopy}
        activeOpacity={0.7}
        className={`self-end rounded-xl px-3 py-1.5 mb-2 ${
          copied ? "bg-green-600/30" : "bg-accent-subtle"
        }`}
      >
        <Text className={`text-xs font-medium ${
          copied ? "text-green-400" : "text-accent-light"
        }`}>
          {copied ? "Copiado!" : "Copiar"}
        </Text>
      </TouchableOpacity>
      <Markdown style={mdStyles}>{report}</Markdown>
    </View>
  );
}
