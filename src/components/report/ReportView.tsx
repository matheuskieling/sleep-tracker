import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import * as Clipboard from "expo-clipboard";

interface ReportViewProps {
  report: string;
}

const mdStyles = {
  body: { color: "#292D32", fontSize: 14, lineHeight: 22 },
  heading1: { color: "#292D32", fontSize: 20, fontWeight: "bold" as const, marginBottom: 8, marginTop: 12 },
  heading2: { color: "#292D32", fontSize: 17, fontWeight: "bold" as const, marginBottom: 6, marginTop: 10 },
  heading3: { color: "#292D32", fontSize: 15, fontWeight: "600" as const, marginBottom: 4, marginTop: 8 },
  paragraph: { color: "#292D32", marginBottom: 8 },
  strong: { color: "#292D32", fontWeight: "bold" as const },
  em: { color: "#6B5E57", fontStyle: "italic" as const },
  bullet_list: { marginBottom: 8 },
  ordered_list: { marginBottom: 8 },
  list_item: { color: "#292D32", marginBottom: 4 },
  bullet_list_icon: { color: "#652D07", marginRight: 8 },
  ordered_list_icon: { color: "#652D07", marginRight: 8 },
  hr: { backgroundColor: "#E8DDD6", height: 1, marginVertical: 12 },
  blockquote: { backgroundColor: "#F8F2EF", borderLeftColor: "#652D07", borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 4, marginBottom: 8 },
};

export function ReportView({ report }: ReportViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View
      className="bg-surface-card rounded-card p-4 mt-4"
      style={{
        shadowColor: "#6B5E57",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.06,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <TouchableOpacity
        onPress={handleCopy}
        activeOpacity={0.7}
        className={`self-end rounded-button px-3 py-1.5 mb-2 ${
          copied ? "bg-success-light" : "bg-surface-input"
        }`}
      >
        <Text className={`text-caption font-medium ${
          copied ? "text-success-dark" : "text-secondary"
        }`}>
          {copied ? "Copiado!" : "Copiar"}
        </Text>
      </TouchableOpacity>
      <Markdown style={mdStyles}>{report}</Markdown>
    </View>
  );
}
