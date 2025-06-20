import { createI18n } from "vue-i18n";
import pl from "@/services/translations/translations/pl.json";

const i18n = createI18n({
  locale: "pl",
  fallbackLocale: "pl",
  legacy: false,
  messages: { pl },
});

export default i18n;
