import React from "react";
import { StyleSheet } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import DraggableItem from "./DraggableItem";

interface DraggableListProps {
  data: { actions: any[] }[];
  setData: React.Dispatch<React.SetStateAction<any[]>>;
  onDelete: (index: number) => void;
}
const DraggableList: React.FC<DraggableListProps> = ({
  data,
  setData,
  onDelete,
}) => {
  return (
    <DraggableFlatList
      data={data[0]?.actions || []}
      renderItem={({ item, drag, isActive, getIndex }) => (
        <DraggableItem
          item={item}
          drag={drag}
          // isActive={isActive}
          onDelete={() => onDelete(getIndex())}
        />
      )}
      keyExtractor={(item, index) => item?.value + index.toString()}
      onDragEnd={({ data }) => setData(data)}
      contentContainerStyle={styles.list}
      scrollEnabled={true}
    />
  );
};

const styles = StyleSheet.create({
  list: {
    width: "100%",
  },
});

export default DraggableList;
