import { colors } from "@/constants/colors";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface DialogBoxProps {
  visible: boolean;
  think: boolean;
}

const DialogBox: React.FC<DialogBoxProps> = ({ visible, think }) => {
  return (
    visible &&
    (think ? (
      <View style={[styles.thinkContainer, { flexDirection: "row" }]}>
        <View style={styles.thinkBubble1} />
        <View style={styles.thinkBubble2} />
        <View style={styles.thinkBubble3} />
        <Text style={styles.thinkText}>Hmm...</Text>
      </View>
    ) : (
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>Hello!</Text>
      </View>
    ))
  );
};

const styles = StyleSheet.create({
  messageContainer: {
    position: "absolute",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 5,
    borderRadius: 5,
    zIndex: 10,
    top: -40,
  },
  thinkContainer: {
    position: "absolute",
    padding: 5,
    borderRadius: 5,
    zIndex: 10,
    top: -40,
  },
  thinkBubble1: {
    backgroundColor: colors.white2,
    width: 30,
    height: 30,
    borderBottomLeftRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 20,
    borderBottomRightRadius: 20,
  },
  thinkBubble2: {
    backgroundColor: colors.white2,
    width: 30,
    height: 30,
    borderBottomLeftRadius: 10,
    left: -10,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10,
  },
  thinkBubble3: {
    backgroundColor: colors.white2,
    width: 30,
    height: 30,
    borderBottomLeftRadius: 20,
    left: -20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 15,
    borderBottomRightRadius: 15,
  },
  messageText: {
    color: "white",
    fontSize: 18,
  },
  thinkText: {
    color: "black",
    left: -79,
    top: 2,
    fontSize: 16,
  },
});

export default DialogBox;
