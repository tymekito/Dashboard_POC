import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import "vuetify/styles";

const vuetify = createVuetify({
  components,
  icons: {
    defaultSet: "mdi",
    aliases,
    sets: {
      mdi,
    },
  },
});

export { vuetify };
