import clamp from "@/utils/clamp";
import { withSpring, withTiming } from "react-native-reanimated";

// const clamp = (val: number, min: number, max: number) =>
//   Math.min(Math.max(val, min), max);

const useMoveImage = (
  translationX: { value: number },
  translationY: { value: number },
  maxTranslateX: number,
  maxTranslateY: number,
  setInputX,
  setInputY
) => {
  const handleMoveImage = (inputX, inputY) => {
    let x = parseFloat(inputX) || 0;
    let y = parseFloat(inputY) || 0;
    x = clamp(x, -maxTranslateX, maxTranslateX);
    y = clamp(y, -maxTranslateY, maxTranslateY);

    translationX.value = withSpring(x);
    translationY.value = withSpring(y);

    setInputX(x.toFixed(2));
    setInputY(y.toFixed(2));
  };

  const moveX50 = () => {
    const newX = translationX.value + 50;
    (translationX.value = clamp(newX, -maxTranslateX, maxTranslateX)),
      setInputX(translationX.value.toFixed(2));
  };

  const moveY50 = () => {
    const newY = translationY.value + 50;
    translationY.value = clamp(newY, -maxTranslateY, maxTranslateY);
    setInputY(translationY.value.toFixed(2));
  };

  const glideX50 = () => {
    const newX = translationX.value + 50;
    translationX.value = withTiming(
      clamp(newX, -maxTranslateX, maxTranslateX),
      {
        duration: 500,
      }
    );
    setInputX(translationX.value.toFixed(2));
  };

  const glideY50 = () => {
    const newY = translationY.value + 50;
    translationY.value = withTiming(
      clamp(newY, -maxTranslateY, maxTranslateY),
      {
        duration: 500,
      }
    );
    setInputY(translationY.value.toFixed(2));
  };

  const reset = () => {
    translationX.value = withTiming(0, { duration: 500 });
    translationY.value = withTiming(0, { duration: 500 });
    setInputX(0);
    setInputY(0);
  };

  return { handleMoveImage, moveX50, moveY50, glideX50, glideY50, reset };
};

export default useMoveImage;
