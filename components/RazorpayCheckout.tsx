import React from "react";
import { Modal, View, StyleSheet, TouchableOpacity, Text, Alert, Linking } from "react-native";
import { WebView } from "react-native-webview";

type RazorpaySuccess = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
};

type Props = {
  visible: boolean;
  keyId: string;
  razorpayOrderId: string;
  amount: number; // in paise, same value the backend returned
  name: string;
  email: string;
  onSuccess: (data: RazorpaySuccess) => void;
  onClose: () => void;
};

export default function RazorpayCheckout({
  visible,
  keyId,
  razorpayOrderId,
  amount,
  name,
  email,
  onSuccess,
  onClose,
}: Props) {
  // This is a tiny standalone webpage — not part of your app's UI.
  // Its only job is to open Razorpay's payment widget and post the result back.
  const html = `
    <!DOCTYPE html>
    <html>
      <head><meta name="viewport" content="width=device-width, initial-scale=1.0" /></head>
      <body>
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script>
          var options = {
            key: "${keyId}",
            amount: "${amount}",
            currency: "INR",
            order_id: "${razorpayOrderId}",
            name: "Myntra Clone",
            prefill: { name: "${name}", email: "${email}" },
            method: {
              netbanking: false,
              card: false,
              wallet: true,
              upi: true,
            },
            handler: function (response) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                status: "success",
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }));
            },
            modal: {
              ondismiss: function () {
                window.ReactNativeWebView.postMessage(JSON.stringify({ status: "cancelled" }));
              },
            },
          };
          var rzp = new Razorpay(options);
          // Fires when a payment attempt fails (e.g. a wallet declines it).
          // Razorpay keeps its sheet open so the user can retry another method.
          rzp.on("payment.failed", function (response) {
            window.ReactNativeWebView.postMessage(JSON.stringify({
              status: "failed",
              reason: response.error && response.error.description,
            }));
          });
          rzp.open();
        </script>
      </body>
    </html>
  `;

  const handleMessage = (event: any) => {
    let data;
    try {
      data = JSON.parse(event.nativeEvent.data);
    } catch {
      return;
    }
    if (data.status === "success") {
      onSuccess(data);
    } else if (data.status === "failed") {
      Alert.alert("Payment failed", data.reason || "Please try another payment method.");
    } else {
      onClose();
    }
  };

  // Some wallets (PhonePe, Amazon Pay, etc.) hand off to their own app using
  // links like "phonepe://..." that a WebView can't open. Pass those to the phone.
  const handleNavigation = (request: { url: string }) => {
    const { url } = request;
    if (/^(https?|about|data|blob):/i.test(url)) return true;
    Linking.openURL(url).catch(() =>
      Alert.alert("App not found", "That wallet app isn't installed on this phone.")
    );
    return false;
  };

  return (
    <Modal visible={visible} animationType="slide">
      <View style={styles.container}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <Text style={styles.closeText}>Cancel</Text>
        </TouchableOpacity>
        <WebView
          originWhitelist={["*"]}
          source={{ html }}
          onMessage={handleMessage}
          onShouldStartLoadWithRequest={handleNavigation}
          // Wallet login pages open as pop-up windows; load them in this same view
          javaScriptCanOpenWindowsAutomatically
          setSupportMultipleWindows={false}
          style={styles.webview}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  webview: { flex: 1 },
  closeButton: { padding: 16, alignItems: "flex-end" },
  closeText: { color: "#ff3f6c", fontWeight: "700" },
});
