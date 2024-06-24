import React, { useEffect, useState } from "react";
import { StyleSheet } from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { GestureDetector } from "react-native-gesture-handler";
import CustomImage from "@/components/CustomImage";
import usePanGesture from "@/hooks/usePanGesture";
import useMoveImage from "@/hooks/useMoveImage";
import useRotateImage from "@/hooks/useRotateImage";
import DialogBox from "@/components/DialogBox";

interface DraggableImageProps {
  img: { id: number; uri: string };
  actions: { value: string }[];
  isPlaying: boolean;
  maxTranslateX: number;
  maxTranslateY: number;
  onPositionChange: (id: string, x: string, y: string) => void;
}

const DraggableImage: React.FC<DraggableImageProps> = ({
  img,
  actions,
  isPlaying,
  maxTranslateX,
  maxTranslateY,
  onPositionChange,
}) => {
  const [inputX, setInputX] = useState(`${maxTranslateX.toFixed(2)}`);
  const [inputY, setInputY] = useState(`${maxTranslateY.toFixed(2)}`);
  const [showMessage, setShowMessage] = useState(false);
  const [think, setThink] = useState(false);

  useEffect(() => {
    onPositionChange(img.id, inputX, inputY);
  }, [inputX, inputY]);

  const { pan, translationX, translationY } = usePanGesture(
    maxTranslateX,
    maxTranslateY,
    setInputX,
    setInputY
  );

  const { handleMoveImage, moveX50, moveY50, glideX50, glideY50, reset } =
    useMoveImage(
      translationX,
      translationY,
      maxTranslateX,
      maxTranslateY,
      setInputX,
      setInputY
    );

  const { rotation, rotate360, rotateClockwise15, rotateCounterClockwise15 } =
    useRotateImage();

  const animatedStyles = useAnimatedStyle(() => ({
    transform: [
      { translateX: translationX.value },
      { translateY: translationY.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));
  const showMessageAndHide = (think?: string) => {
    think ? setThink(true) : setThink(false);
    setShowMessage(true);
    setTimeout(() => {
      setShowMessage(false);
    }, 3000);
  };

  const executeAction = (action: { value: string }) => {
    switch (action.value) {
      case "moveX50":
        moveX50();
        break;
      case "moveY50":
        moveY50();
        break;
      case "glideX50":
        glideX50();
        break;
      case "glideY50":
        glideY50();
        break;
      case "rotate360":
        rotate360();
        break;
      case "rotateClockwise15":
        rotateClockwise15();
        break;
      case "rotateCounterClockwise15":
        rotateCounterClockwise15();
        break;
      case "sayHello":
        showMessageAndHide();
        break;
      case "thinkHmm":
        showMessageAndHide("think");
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (isPlaying) {
      const executeActions = (actionsToExecute: { value: string }[]) => {
        actionsToExecute.forEach((action, index) => {
          setTimeout(() => {
            if (action.value === "repeatOnce") {
              const precedingActions = actionsToExecute.slice(0, index);
              executeActions(precedingActions);
            } else {
              executeAction(action);
            }
          }, index * 1000);
        });
      };

      executeActions(actions);
    }
  }, [isPlaying, actions]);
  return (
    <GestureDetector gesture={pan}>
      <Animated.View style={[animatedStyles, styles.box]}>
        <DialogBox visible={showMessage} think={think} />
        <CustomImage source={img.uri} />
      </Animated.View>
    </GestureDetector>
  );
};

const styles = StyleSheet.create({
  box: {
    width: "20%",
    height: "10%",
  },
});

export default DraggableImage;
