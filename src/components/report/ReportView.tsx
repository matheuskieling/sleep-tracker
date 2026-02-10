import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Markdown from "react-native-markdown-display";
import * as Clipboard from "expo-clipboard";

interface ReportViewProps {
  report: string;
}

const mdStyles = {
  body: { color: "#e0e7ff", fontSize: 14, lineHeight: 22 },
  heading1: { color: "#c7d2fe", fontSize: 20, fontWeight: "bold" as const, marginBottom: 8, marginTop: 12 },
  heading2: { color: "#c7d2fe", fontSize: 17, fontWeight: "bold" as const, marginBottom: 6, marginTop: 10 },
  heading3: { color: "#c7d2fe", fontSize: 15, fontWeight: "600" as const, marginBottom: 4, marginTop: 8 },
  paragraph: { color: "#e0e7ff", marginBottom: 8 },
  strong: { color: "#e0e7ff", fontWeight: "bold" as const },
  em: { color: "#a5b4fc", fontStyle: "italic" as const },
  bullet_list: { marginBottom: 8 },
  ordered_list: { marginBottom: 8 },
  list_item: { color: "#e0e7ff", marginBottom: 4 },
  bullet_list_icon: { color: "#818cf8", marginRight: 8 },
  ordered_list_icon: { color: "#818cf8", marginRight: 8 },
  hr: { backgroundColor: "#4338ca", height: 1, marginVertical: 12 },
  blockquote: { backgroundColor: "#312e81", borderLeftColor: "#818cf8", borderLeftWidth: 3, paddingLeft: 12, paddingVertical: 4, marginBottom: 8 },
};

export function ReportView({ report }: ReportViewProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await Clipboard.setStringAsync(report);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <View className="bg-primary-900 rounded-2xl p-4 mt-4">
      <TouchableOpacity
        onPress={handleCopy}
        activeOpacity={0.7}
        className={`self-end rounded-xl px-3 py-1.5 mb-2 ${
          copied ? "bg-green-600/30" : "bg-indigo-500/20"
        }`}
      >
        <Text className={`text-xs font-medium ${
          copied ? "text-green-400" : "text-indigo-300"
        }`}>
          {copied ? "Copiado!" : "Copiar"}
        </Text>
      </TouchableOpacity>
      <Markdown style={mdStyles}>{report}</Markdown>
    </View>
  );
}
