import { notify } from "@kyvg/vue3-notification";

export function displaySuccess(message) {
  notify({
    type: "success",
    text: message,
    duration: 3000,
    position: "bottom",
  });
}

export function displayError(message) {
  notify({
    type: "error",
    text: message,
    duration: 5000,
    position: "bottom",
  });
}

export function displayInfo(message) {
  notify({
    type: "info",
    text: message,
    duration: 3000,
    position: "bottom",
  });
}

export function displayWarning(message) {
  notify({
    type: "warn",
    text: message,
    duration: 5000,
    position: "bottom",
  });
}
