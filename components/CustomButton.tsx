import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface CustomButtonProps {
  onPress: () => void;
  title: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  titleStyle?: TextStyle;
}

const CustomButton: React.FC<CustomButtonProps> = ({
  onPress,
  title,
  disabled,
  containerStyle,
  titleStyle,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, containerStyle]}
      onPress={onPress}
      disabled={disabled}
    >
      {title === "Play" ? (
        <Feather
          name="play"
          size={18}
          color={colors.darkGrey2}
          style={styles.iconStyle}
        />
      ) : (
        <Ionicons name="reload-outline" size={18} color={colors.blue} />
      )}
      <Text style={[styles.text, titleStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    flexDirection: "row",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  iconStyle: {
    top: 1,
  },
});

export default CustomButton;
