// plugins/notification-plugin.js
import Notifications from "@kyvg/vue3-notification";

export function registerNotifications(app) {
  app.use(Notifications);
}
