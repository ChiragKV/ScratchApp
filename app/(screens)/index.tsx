import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Dimensions,
  View,
  Text,
  TouchableOpacity,
  FlatList,
} from "react-native";

import CustomButton from "@/components/CustomButton";
import CustomImage from "@/components/CustomImage";

import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Link, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import uuid from "react-native-uuid";

import DraggableImage from "@/components/DraggableImage";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Feather } from "@expo/vector-icons";
import { colors } from "@/constants/colors";

const { width, height } = Dimensions.get("screen");

const maxTranslateX = width * 0.6 - 20;
const maxTranslateY = height * 0.7 * 0.45 - 20;

interface ImageAction {
  id: string;
  uri: string | null;
  actions: [];
  posX: number | null;
  posY: number | null;
}

export default function HomeScreen() {
  const smallImageWidth = width * 0.16;
  const smallImageHeight = height * 0.077;

  const params = useLocalSearchParams();
  const { imagesArray } = params;

  const staticImage = {
    id: "static-image-id",
    uri: null,
    actions: [],
    posX: null,
    posY: null,
  };
  const [imageActions, setImageActions] = useState([staticImage]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [selectedImage, setSelectedImage] = useState(staticImage.id);

  const handleSelectImage = (id: string) => {
    setSelectedImage(id);
  };

  useEffect(() => {
    imagesArray &&
      (setImageActions(JSON.parse(imagesArray)),
      setSelectedImage(JSON.parse(imagesArray)[0].id));
  }, [imagesArray]);

  // useEffect(() => {
  //   console.log(imageActions, "acc");
  // }, [imageActions]);

  const executeActions = () => {
    setIsPlaying(true);
    setTimeout(() => {
      setIsPlaying(false);
    }, 1000);
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const newImage = {
        id: uuid.v4(),
        uri: result.assets[0].uri,
        actions: [],
        posX: null,
        posY: null,
      };

      const newImageActions = [...imageActions, newImage];
      setImageActions(newImageActions);
    }
  };

  const handleDeleteImage = (id: string) => {
    const updatedImageActions = imageActions.filter((item) => item.id !== id);
    setImageActions(updatedImageActions);
    if (selectedImage === id && updatedImageActions.length > 0) {
      setSelectedImage(updatedImageActions[0].id);
    }
  };

  const renderItem = ({ item }: { item: ImageAction }) => {
    return (
      <TouchableOpacity
        style={[
          styles.imageContainer,
          {
            width: smallImageWidth,
            height: smallImageHeight,
          },
          selectedImage === item.id && styles.selectedImage,
        ]}
        onPress={() => handleSelectImage(item.id)}
      >
        <TouchableOpacity
          style={styles.deleteButton}
          onPress={() => handleDeleteImage(item.id)}
        >
          <Feather name="trash-2" size={16} color={colors.white2} />
        </TouchableOpacity>
        <View style={[{ width: "100%", height: "100%" }]}>
          <CustomImage source={item.uri} />
        </View>
      </TouchableOpacity>
    );
  };

  const handleImageChange = (id: string, newX: string, newY: string) => {
    const updatedImageActions = imageActions.map((image) =>
      image.id === id
        ? { ...image, posX: parseFloat(newX), posY: parseFloat(newY) }
        : image
    );
    setImageActions(updatedImageActions);
  };

  const handleReset = () => {
    setImageActions([staticImage]);
    setSelectedImage(staticImage.id);
  };

  return (
    <View style={styles.root}>
      <View style={styles.subRoot}>
        <Text style={styles.headerTextStyle}>Playground</Text>
        <GestureHandlerRootView style={styles.playGroundContainer}>
          {imageActions.map((img, index) => (
            <DraggableImage
              key={img.id}
              img={img}
              actions={img.actions}
              maxTranslateX={maxTranslateX}
              maxTranslateY={maxTranslateY}
              imageActions={imageActions}
              setImageActions={setImageActions}
              onPositionChange={handleImageChange}
              isPlaying={isPlaying}
            />
          ))}
        </GestureHandlerRootView>
        <View style={styles.bottomContainer}>
          <View style={styles.textInputContainer}>
            <Link
              href={{
                pathname: "addActions",
                params: {
                  imagesArray: JSON.stringify(
                    imageActions.map((item) => ({
                      ...item,
                      uri: item.uri !== null && encodeURIComponent(item.uri),
                    }))
                  ),
                },
              }}
              style={styles.addActionsContainerStyles}
            >
              <MaterialCommunityIcons
                name="lightning-bolt-outline"
                size={18}
                color={colors.blue}
                style={styles.actionIconStyle}
              />
              <Text style={styles.resetTitleStyle}>Add Actions</Text>
            </Link>

            <View style={styles.input}>
              <Text style={styles.text}>X: </Text>

              <Text style={styles.text}>
                {selectedImage
                  ? imageActions
                      .find((img) => img.id === selectedImage)
                      ?.posX?.toString()
                  : ""}
              </Text>
            </View>
            <View style={styles.input}>
              <Text style={styles.text}>Y: </Text>

              <Text style={styles.text}>
                {selectedImage
                  ? imageActions
                      .find((img) => img.id === selectedImage)
                      ?.posY?.toString()
                  : ""}
              </Text>
            </View>
          </View>
          <View style={styles.imagesContainer}>
            <FlatList
              data={imageActions}
              renderItem={renderItem}
              keyExtractor={(item) => item.id.toString()}
              horizontal
              ListFooterComponent={
                <TouchableOpacity
                  style={[
                    styles.addIconContainer,
                    { width: smallImageWidth, height: smallImageHeight },
                  ]}
                  onPress={pickImage}
                >
                  <Text style={[styles.text, { fontSize: 20 }]}>+</Text>
                </TouchableOpacity>
              }
              contentContainerStyle={{
                gap: 10,
              }}
            />
          </View>
          <View style={styles.buttonsContainer}>
            <CustomButton
              title="Reset"
              onPress={handleReset}
              containerStyle={styles.resetButtonContainer}
              titleStyle={styles.resetTitleStyle}
            />
            <CustomButton
              title="Play"
              onPress={executeActions}
              containerStyle={styles.playButtonContainer}
              titleStyle={styles.playTitleStyle}
              disabled={isPlaying}
            />
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    paddingTop: 20,
    flex: 1,
    backgroundColor: colors.backgroundColor,
  },
  headerTextStyle: {
    color: colors.white2,
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 10,
    marginLeft: 20,
  },
  subRoot: {
    width: "95%",
    alignSelf: "center",
    justifyContent: "center",
  },

  playGroundContainer: {
    height: "67%",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: colors.darkGrey,
    flexDirection: "row",
  },
  playTitleStyle: {
    color: colors.darkGrey2,
  },
  resetTitleStyle: {
    color: colors.blue,
    fontSize: 16,
    fontWeight: "bold",
  },

  bottomContainer: {
    height: "29%",
    justifyContent: "space-evenly",
  },

  textInputContainer: {
    flexDirection: "row",
    height: "20%",
    justifyContent: "space-between",
  },

  imagesContainer: {
    flexDirection: "row",
  },
  imageContainer: {
    borderColor: colors.grey,
    borderWidth: 1,
    borderRadius: 20,
    padding: 10,
  },
  input: {
    width: "20%",
    borderRadius: 45,
    backgroundColor: colors.darkGrey,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  addIconContainer: {
    borderColor: colors.grey,
    width: "15%",
    borderWidth: 1,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  text: { color: colors.white2, alignSelf: "center" },
  buttonsContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  playButtonContainer: {
    width: "45%",
    backgroundColor: colors.blue,
  },

  resetButtonContainer: {
    width: "45%",
    backgroundColor: colors.backgroundColor,
    borderColor: colors.blue,
    borderWidth: 1,
  },

  selectedImage: {
    borderColor: colors.blue,
  },

  deleteButton: {
    position: "absolute",
    right: -4,
    top: 0,
    borderRadius: 10,
    backgroundColor: colors.darkGrey,
    zIndex: 1,
  },
  addActionsContainerStyles: {
    flexDirection: "row",
    width: "45%",
    textAlign: "center",
    textAlignVertical: "center",
    borderColor: colors.blue,
    shadowOpacity: 100,
    borderWidth: 1,
    borderRadius: 57,
  },
});
