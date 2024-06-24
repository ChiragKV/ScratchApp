import { useSharedValue, withTiming } from "react-native-reanimated";

const useRotateImage = () => {
  const rotation = useSharedValue(0);

  const rotate360 = () => {
    rotation.value = withTiming(rotation.value + 360, { duration: 1000 });
  };
  const rotateClockwise15 = () => {
    rotation.value = withTiming(rotation.value + 15, { duration: 500 });
  };

  const rotateCounterClockwise15 = () => {
    rotation.value = withTiming(rotation.value - 15, { duration: 500 });
  };

  return { rotate360, rotation, rotateClockwise15, rotateCounterClockwise15 };
};

export default useRotateImage;
