import React, { useCallback, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Share } from "react-native";
import { useStateValue } from "../StateProvider";
import { COLORS } from "../variables/color";
import ChevronRightIcon from "./svgComponents/ChevronRightIcon";
import { Feather } from "@expo/vector-icons";
import { miscConfig } from "../app/services/miscConfig";
import { debounce } from "lodash";

const DrawerShareOption = ({ item, isLast, navigation }) => {
  const [{ rtl_support, ios }] = useStateValue();
  const [disabled, setDisabled] = useState(false);

  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };
  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };
  const flipHorizontally = rtl_support && {
    transform: [{ scaleX: -1 }],
  };
  const onShare = () => {
    setDisabled(true);
    onDrawerOptionClick();
  };
  const onDrawerOptionClick = useCallback(
    debounce(async () => {
      const tempShare = ios
        ? { url: miscConfig.appSharingLinks.iOS }
        : { message: miscConfig.appSharingLinks.android };
      try {
        const result = await Share.share(tempShare);
        if (result.action === Share.sharedAction) {
          setDisabled(false);
          // if (result.activityType) {
          // } else {
          // }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
          setDisabled(false);
        }
      } catch (error) {
        alert(error.message);
        setDisabled(false);
      }
      return;
    }, 400),
    []
  );
  return (
    <TouchableOpacity onPress={onShare} disabled={disabled}>
      <View
        style={[
          styles.container,
          !isLast && {
            borderBottomColor: "#e3e3e3",
            borderBottomWidth: 1,
          },
          rtlView,
        ]}
      >
        <Feather name="share-2" color={COLORS.primary} size={18} />
        <View style={{ flex: 1, paddingHorizontal: 10 }}>
          <Text
            style={[
              {
                textAlign: "left",
                fontWeight: "bold",
              },
              rtlTextA,
            ]}
          >
            {item.title}
          </Text>
        </View>
        <View style={[flipHorizontally]}>
          <ChevronRightIcon fillColor={COLORS.gray} />
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
});

export default DrawerShareOption;
