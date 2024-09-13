import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";

// Vector Fonts
import { FontAwesome } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";

//  Custom Components & Variables
import { COLORS } from "../variables/color";
import { useNavigation } from "@react-navigation/native";
import { routes } from "../navigation/routes";
const headerLogoURL = require("../assets/newlogo_header.png");

const TabScreenHeader = ({
  right,
  onRightClick,
  style,
  left,
  onLeftClick,
  rightIcon,
  sideBar,
  rtl,
}) => {
  const navigation = useNavigation();

  const rtlView = rtl && {
    flexDirection: "row-reverse",
  };
  return (
    <View style={[styles.container, style, rtlView]}>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate(routes.homeScreen)}
      >
        <Image
          resizeMode="contain"
          source={headerLogoURL}
          style={{ height: 40, width: 160, resizeMode: "contain" }}
        />
      </TouchableWithoutFeedback>
      {right && (
        <TouchableOpacity style={styles.headerRight} onPress={onRightClick}>
          <FontAwesome name={rightIcon} size={20} color={COLORS.white} />
        </TouchableOpacity>
      )}
      {left && !sideBar && (
        <TouchableOpacity style={styles.headerLeft} onPress={onLeftClick}>
          <MaterialIcons
            name={rtl ? "arrow-forward" : "arrow-back"}
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
      )}
      {sideBar && (
        <TouchableOpacity
          style={styles.headerLeft}
          onPress={() => navigation.openDrawer()}
        >
          <MaterialIcons name="menu" size={24} color={COLORS.white} />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  headerLeft: {
    position: "absolute",
    left: "2%",
  },
  headerRight: {
    position: "absolute",
    right: "6%",
  },
});

export default TabScreenHeader;
