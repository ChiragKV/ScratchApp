import CustomImage from "@/components/CustomImage";
import DraggableList from "@/components/DraggableList";
import { actionOptions } from "@/constants/actionOptions";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import * as ImagePicker from "expo-image-picker";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SelectDropdown from "react-native-select-dropdown";
import uuid from "react-native-uuid";
import { router } from "expo-router";
import { colors } from "@/constants/colors";

const AddActions = () => {
  const [imageActions, setImageActions] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  const params = useLocalSearchParams();
  const { imagesArray } = params;

  useEffect(() => {
    if (imagesArray && imagesArray.length > 0) {
      const parsedImages = JSON.parse(imagesArray);
      const firstImage = parsedImages[0];
      setImageActions(parsedImages);
      firstImage && setSelectedImage(firstImage.id);
    }
  }, [imagesArray]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImageAction = {
        id: uuid.v4(),
        uri: result.assets[0].uri,
        actions: [],
        posX: null,
        posY: null,
      };

      setImageActions([...imageActions, newImageAction]);
    }
  };
  const navigateGoBack = () => {
    router.back();
  };

  const handleSelectAction = (action: string) => {
    if (selectedImage !== null && selectedImage !== undefined) {
      const updatedActions = [...imageActions];
      const selectedActionIndex = updatedActions.findIndex(
        (item) => item.id === selectedImage
      );
      if (selectedActionIndex !== -1) {
        const selectedAction = { ...updatedActions[selectedActionIndex] };

        if (!Array.isArray(selectedAction.actions)) {
          selectedAction.actions = [];
        }
        selectedAction.actions = [...selectedAction.actions, action];

        updatedActions[selectedActionIndex] = selectedAction;

        setImageActions(updatedActions);
      } else {
        console.error(`No action found for selectedImage id ${selectedImage}`);
      }
    } else {
      console.error("No image selected.");
    }
  };

  const handleRemoveAction = (actionIndex: number) => {
    if (selectedImage !== null && selectedImage !== undefined) {
      const updatedActions = imageActions.map((image) =>
        image.id === selectedImage
          ? {
              ...image,
              actions: image.actions.filter(
                (_, index) => index !== actionIndex
              ),
            }
          : image
      );

      setImageActions(updatedActions);
    } else {
      console.error("No image selected.");
    }
  };

  const handleSelectImage = (id: string) => {
    setSelectedImage(id);
  };

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.headerContainerStyle}>
        <View style={styles.headerSubContainerStyle}>
          <TouchableOpacity
            onPress={navigateGoBack}
            style={{
              width: 25,
              justifyContent: "center",
              flexDirection: "row",
              bottom: 1,
            }}
          >
            <Text style={styles.backButtonStyle}>{"<"}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTextStyle}>Object Actions</Text>
        </View>
        <Link
          href={{
            pathname: "/",
            params: {
              imagesArray: JSON.stringify(
                imageActions.map((item) => ({
                  ...item,
                  uri: item.uri !== null && encodeURIComponent(item.uri),
                }))
              ),
            },
          }}
        >
          <Text style={styles.confirmTextStyle}>Confirm</Text>
        </Link>
      </View>
      <View style={styles.imageContainer}>
        {imageActions.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[
              styles.imageItem,
              selectedImage === item.id && styles.selectedImage,
            ]}
            onPress={() => handleSelectImage(item.id)}
          >
            <CustomImage source={item.uri} />
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={styles.addIconContainer} onPress={pickImage}>
          <Text style={[styles.text, { fontSize: 20 }]}>+</Text>
        </TouchableOpacity>
      </View>
      <SelectDropdown
        data={actionOptions}
        onSelect={(selectedItem, index) => {
          handleSelectAction(selectedItem);
        }}
        renderButton={(selectedItem, isOpened) => {
          return (
            <View style={styles.addActionContainerStyle}>
              <Text style={styles.addActionTextStyle}>+</Text>
            </View>
          );
        }}
        renderItem={(item, index, isSelected) => {
          return (
            <View
              style={{
                ...styles.dropdownItemStyle,
              }}
            >
              <Text style={styles.dropdownItemTextStyle}>{item.label}</Text>
            </View>
          );
        }}
        showsVerticalScrollIndicator={true}
        dropdownStyle={styles.dropdownMenuStyle}
      />
      <View style={styles.container}>
        <Text style={styles.subHeaderTextStyle}>Actions</Text>
        <GestureHandlerRootView style={{ height: "70%" }}>
          {selectedImage !== null && selectedImage !== undefined && (
            <DraggableList
              data={[imageActions.find((item) => item.id === selectedImage)]}
              setData={(newActions) => {
                const updatedActions = [...imageActions];
                const selectedAction = updatedActions.find(
                  (item) => item.id === selectedImage
                );

                selectedAction.actions = newActions;
                setImageActions(updatedActions);
              }}
              onDelete={handleRemoveAction}
            />
          )}
        </GestureHandlerRootView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.backgroundColor,
    paddingHorizontal: 20,
    paddingVertical: 40,
  },
  addActionContainerStyle: {
    marginBottom: 20,
    width: "100%",
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    height: 48,
    justifyContent: "center",
    alignItems: "center",
  },
  dropdownItemStyle: {
    borderBottomWidth: 1,
    borderBottomColor: colors.grey,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dropdownMenuStyle: {
    backgroundColor: colors.darkGrey,
    borderWidth: 1,
    borderRadius: 20,
  },
  dropdownItemTextStyle: {
    color: colors.white2,
  },
  addActionTextStyle: {
    color: colors.white2,
    fontSize: 20,
    fontWeight: "500",
  },
  container: {
    height: "100%",
  },
  subHeaderTextStyle: { color: colors.white2, fontSize: 20, fontWeight: "500" },
  confirmTextStyle: {
    color: colors.blue,
    fontSize: 16,
  },
  headerTextStyle: {
    color: colors.white2,
    fontWeight: "700",
    fontSize: 20,
  },
  backButtonStyle: {
    color: colors.white2,
    fontSize: 24,
    fontWeight: "900",
  },
  headerContainerStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerSubContainerStyle: {
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
    marginVertical: 20,
  },
  imageItem: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    padding: 5,
    opacity: 0.8,
    width: 73,
    height: 73,
  },
  selectedImage: {
    borderColor: colors.blue,
  },
  addIconContainer: {
    borderColor: colors.grey,
    width: 73,
    height: 73,
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: colors.white2, alignSelf: "center" },
});

export default AddActions;
