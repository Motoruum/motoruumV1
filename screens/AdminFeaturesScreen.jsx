import { MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { __ } from "../language/stringPicker";
import { routes } from "../navigation/routes";
import { useStateValue } from "../StateProvider";
import { COLORS } from "../variables/color";
import { configuration } from "../configuration/configuration";

const AdminFeaturesScreen = ({ navigation }) => {
  const [{ user, auth_token, config, ios, appSettings, rtl_support }] =
    useStateValue();
  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };
  const onAllListingsClick = () => {
    navigation.navigate(routes.allListingsSCreen);
  };
  const onAllPaymentsClick = () => {
    navigation.navigate(routes.allPaymentsSCreen);
  };
  return (
    <View style={styles.container}>
      <View style={styles.optionWrapper}>
        <Pressable onPress={onAllListingsClick}>
          <View style={[styles.optionButtonWrap, rtlView]}>
            <View style={styles.iconWrap}>
              <MaterialIcons name="list-alt" size={18} color={COLORS.white} />
            </View>
            <View style={styles.btnTxtWrap}>
              <Text style={[styles.btnTxt, rtlText]}>
                {__("adminFeaturesScreenTexts.allAds", appSettings.lng)}
              </Text>
            </View>
          </View>
        </Pressable>
        {(!config.iap_disabled ||
          config.iap_disabled !== configuration.currentVersion) && (
          <Pressable onPress={onAllPaymentsClick}>
            <View style={[styles.optionButtonWrap, rtlView]}>
              <View style={styles.iconWrap}>
                <FontAwesome5
                  name={"file-invoice-dollar"}
                  size={18}
                  color={COLORS.white}
                />
              </View>
              <View style={styles.btnTxtWrap}>
                <Text style={[styles.btnTxt, rtlText]}>
                  {__("adminFeaturesScreenTexts.allPayments", appSettings.lng)}
                </Text>
              </View>
            </View>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: "3%",
    paddingVertical: 10,
  },
  optionButtonWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    backgroundColor: COLORS.button.active,
    justifyContent: "center",
    marginVertical: 10,
    borderRadius: 6,
  },
  btnTxtWrap: {
    paddingHorizontal: 5,
  },
  btnTxt: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: "bold",
  },
});

export default AdminFeaturesScreen;
