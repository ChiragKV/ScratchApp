import React from "react";
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Pressable,
  View,
} from "react-native";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

interface DraggableItemProps {
  item: { label: string };
  drag: () => void;
  onDelete: () => void;
}

const DraggableItem: React.FC<DraggableItemProps> = ({
  item,
  drag,
  onDelete,
}) => {
  return (
    <TouchableOpacity style={[styles.item]} onLongPress={drag}>
      <Text style={styles.itemText}>{item?.label}</Text>
      <View style={styles.subContainer}>
        <Pressable onPress={onDelete}>
          <MaterialIcons
            name="delete-outline"
            size={20}
            color="#E63946"
            style={styles.deleteIcon}
          />
        </Pressable>
        <Feather name="menu" size={24} color="#F9FAFCB2" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  item: {
    paddingHorizontal: 20,
    height: 48,
    marginVertical: 10,
    backgroundColor: colors.darkGrey,
    borderRadius: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  itemText: {
    color: colors.white2,
    fontSize: 16,
  },
  subContainer: { flexDirection: "row", gap: 10 },
  deleteIcon: { marginTop: 2 },
});

export default DraggableItem;
