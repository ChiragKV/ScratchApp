import { useSharedValue } from "react-native-reanimated";
import { Gesture } from "react-native-gesture-handler";
import clamp from "@/utils/clamp";

// const clamp = (val, min, max) => Math.min(Math.max(val, min), max);

const usePanGesture = (
  maxTranslateX: number,
  maxTranslateY: number,
  setInputX: (value: string) => void,
  setInputY: (value: string) => void
) => {
  const translationX = useSharedValue(0);
  const translationY = useSharedValue(0);
  const prevTranslationX = useSharedValue(0);
  const prevTranslationY = useSharedValue(0);

  const pan = Gesture.Pan()
    .minDistance(1)
    .onStart(() => {
      prevTranslationX.value = translationX.value;
      prevTranslationY.value = translationY.value;
    })
    .onUpdate((event) => {
      translationX.value = clamp(
        prevTranslationX.value + event.translationX,
        -maxTranslateX,
        maxTranslateX
      );
      translationY.value = clamp(
        prevTranslationY.value + event.translationY,
        -maxTranslateY,
        maxTranslateY
      );
    })
    .onEnd(() => {
      setInputX(translationX.value.toFixed(2));
      setInputY(translationY.value.toFixed(2));
    })
    .runOnJS(true);

  return { pan, translationX, translationY };
};

export default usePanGesture;
