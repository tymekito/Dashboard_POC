// services/notification-service.js
import { notify } from "@kyvg/vue3-notification";

export function displaySuccess(message, title = "Success") {
  notify({
    type: "success",
    title,
    text: message,
    duration: 3000,
    position: "bottom",
  });
}

export function displayError(message, title = "Error") {
  notify({
    type: "error",
    title,
    text: message,
    duration: 5000,
    position: "bottom",
  });
}

export function displayInfo(message, title = "Info") {
  notify({
    type: "info",
    title,
    text: message,
    duration: 3000,
    position: "bottom",
  });
}

export function displayWarning(message, title = "Warning") {
  notify({
    type: "warn",
    title,
    text: message,
    duration: 4000,
    position: "bottom",
  });
}
