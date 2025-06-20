import i18n from "@/plugins/i18n";

export function translationFormatter(messageId) {
  return i18n.global.t(messageId).toString();
}
