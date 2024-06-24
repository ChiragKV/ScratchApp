import { Image } from "expo-image";
import { memo } from "react";
import { StyleSheet, View } from "react-native";

interface CustomImageProps {
  width?: number;
  height?: number;
  source: string | null | false | undefined;
}

const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

const CustomImage: React.FC<CustomImageProps> = ({ width, height, source }) => {
  return (
    <View style={[styles.container, { width, height }]}>
      <Image
        style={styles.image}
        source={
          source !== "false" && source !== null && source !== false
            ? { uri: source }
            : require("../assets/images/scratchCat.png")
        }
        placeholder={{ blurhash }}
        contentFit="contain"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: "100%",
    width: "100%",
  },
});
export default memo(CustomImage);
