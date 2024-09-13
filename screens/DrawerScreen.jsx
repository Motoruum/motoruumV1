import { Feather } from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  TouchableWithoutFeedback,
} from "react-native";
import { COLORS } from "../variables/color";
import { getDrawerOptionsData, __ } from "../language/stringPicker";
import { useStateValue } from "../StateProvider";
import DrawerOption from "../components/DrawerOption";
import { DrawerContentScrollView } from "@react-navigation/drawer";
import { miscConfig } from "../app/services/miscConfig";
import DrawerShareOption from "../components/DrawerShareOption";

const { width: wWidth } = Dimensions.get("window");

const DrawerScreen = (props) => {
  const [{ appSettings, user, rtl_support }] = useStateValue();
  const [drawerOptions, setDrawerOptions] = useState(
    getDrawerOptionsData(appSettings.lng)
  );
  useEffect(() => {
    setDrawerOptions(getDrawerOptionsData(appSettings.lng));
  }, [appSettings.lng]);

  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };
  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };
  return (
    <View style={styles.container}>
      <View
        style={[
          {
            alignItems: "center",
            backgroundColor: COLORS.primary,
            height: wWidth * 0.2,
          },
          rtlView,
        ]}
      >
        <View
          style={{
            position: "absolute",
            left: "5%",
            top: "50%",
            transform: [{ translateY: -15 }],
            zIndex: 5,
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => {
              props.navigation.closeDrawer();
            }}
          >
            <Feather name="x" size={30} color={COLORS.white} />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={{
            height: wWidth * 0.2,
            paddingHorizontal: "20%",
            width: "100%",
          }}
        >
          <Image
            source={require("../assets/newlogo_header.png")}
            style={{ height: "100%", width: "100%", resizeMode: "contain" }}
          />
        </View>
      </View>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContentWrap}>
          {drawerOptions.map((item, index) => {
            if (item?.id === "share") {
              if (!miscConfig?.enableAppSharing) {
                return null;
              } else {
                return (
                  <DrawerShareOption
                    item={item}
                    key={`${index}`}
                    isLast={drawerOptions.length - 1 == index}
                  />
                );
              }
            }
            return (
              <DrawerOption
                item={item}
                key={`${index}`}
                isLast={drawerOptions.length - 1 == index}
                navigation={props.navigation}
              />
            );
          })}
        </View>
      </DrawerContentScrollView>
      <View style={styles.footerSectionWrap}>
        <Text style={[styles.copyrightText, rtlTextA]}>
          {__("drawerScreenTexts.copyrightText", appSettings.lng)}{" "}
          <Text style={styles.link}>
            {__("drawerScreenTexts.linkText", appSettings.lng)}
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  closeBtnWrap: {
    position: "absolute",
    top: "6%",
    left: "3%",
    zIndex: 1,
  },
  container: { flex: 1 },
  copyrightText: {
    color: COLORS.gray,
  },
  drawerContentWrap: {
    paddingHorizontal: wWidth * 0.03,
    paddingVertical: 10,
  },
  footerSectionWrap: {
    paddingHorizontal: "3%",
    position: "absolute",
    bottom: 0,
    paddingBottom: 15,
    width: "100%",
  },
  headerBg: {
    width: "100%",
    resizeMode: "contain",
    // height: wWidth * 0.35,
  },
  headerBgWrap: {
    width: "100%",
    backgroundColor: COLORS.primary,
    height: wWidth * 0.35,
    overflow: "hidden",
    alignItems: "center",
    // justifyContent: "center",
  },
  link: {
    color: COLORS.primary,
    fontWeight: "bold",
  },
  sectionBottom: {
    height: 1,
    backgroundColor: COLORS.border_light,
    marginVertical: 10,
  },
  sectionTitleWrap: {
    paddingTop: 20,
  },
});

export default DrawerScreen;
