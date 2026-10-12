import { Alert, AlertButton, Platform } from "react-native";

// Same as Alert.alert, but also works in the browser.
// On web, react-native's Alert.alert does nothing, so we use the
// browser's own boxes instead:
//   - no choice to make -> window.alert ("OK" box)
//   - a Cancel + action -> window.confirm ("OK / Cancel" box)
export function showAlert(title: string, message?: string, buttons?: AlertButton[]) {
  if (Platform.OS !== "web") {
    Alert.alert(title, message, buttons);
    return;
  }

  const text = message ? `${title}\n\n${message}` : title;
  const cancelButton = buttons?.find((b) => b.style === "cancel");
  const actionButtons = buttons?.filter((b) => b.style !== "cancel") ?? [];

  // Only one way forward: show the message, then run that button (if any)
  if (!cancelButton || actionButtons.length === 0) {
    window.alert(text);
    actionButtons[0]?.onPress?.();
    return;
  }

  // OK = the action button (e.g. "Yes, Cancel"), Cancel = the cancel button
  if (window.confirm(text)) {
    actionButtons[actionButtons.length - 1].onPress?.();
  } else {
    cancelButton.onPress?.();
  }
}
