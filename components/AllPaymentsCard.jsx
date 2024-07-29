import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
// Vector Icons
import {
  AntDesign,
  FontAwesome5,
  Entypo,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
// Custom Components & Constants
import { COLORS } from "../variables/color";
import { getPrice, decodeString } from "../helper/helper";
import { useStateValue } from "../StateProvider";
import { __ } from "../language/stringPicker";
import AdmobBanner from "./AdmobBanner";
import { miscConfig } from "../app/services/miscConfig";
import moment from "moment";

const AllPaymentsCard = ({ onClick, item, onAction, onActionTouch }) => {
  const [{ config, ios, appSettings, rtl_support }] = useStateValue();

  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };

  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };

  const getStatus = () => {
    return (
      __(
        `allPaymentsSCreenTexts.statusMenuButtons.rtcl-${item.status}`,
        appSettings.lng
      ) ||
      item.status ||
      ""
    );
  };
  const getId = () => {
    return (
      __("allPaymentsSCreenTexts.orderId", appSettings.lng) + "#" + item.id ||
      ""
    );
  };
  return item.admob ? (
    <View
      style={{
        marginHorizontal: "3%",
        alignItems: "center",
        marginVertical: 5,
      }}
    >
      <AdmobBanner />
    </View>
  ) : (
    <TouchableWithoutFeedback onPress={onClick}>
      <View style={styles.container}>
        <View style={[styles.details, rtlView]}>
          <View
            style={[
              styles.detailsLeft,
              {
                alignItems: rtl_support ? "flex-end" : "flex-start",
                paddingLeft: rtl_support ? 0 : "4%",
                paddingRight: rtl_support ? "4%" : 0,
              },
            ]}
          >
            <Text
              style={[styles.title, { marginBottom: ios ? 3 : 2 }, rtlText]}
              numberOfLines={2}
            >
              {getId()}
            </Text>
            <View style={[styles.detailsLeftRow, rtlView]}>
              <Text
                style={[styles.detailsLeftRowText, rtlText]}
                numberOfLines={1}
              >
                {__("allPaymentsSCreenTexts.paymentMethod", appSettings.lng)}
              </Text>
              <Text
                style={[styles.detailsLeftRowText, rtlText]}
                numberOfLines={1}
              >
                {item?.method || ""}
              </Text>
            </View>
            <View style={[styles.detailsLeftRow, rtlView]}>
              <Text
                style={[styles.detailsLeftRowText, rtlText]}
                numberOfLines={1}
              >
                {__("allPaymentsSCreenTexts.paymentDate", appSettings.lng)}
              </Text>
              <Text
                style={[styles.detailsLeftRowText, rtlText]}
                numberOfLines={1}
              >
                {moment(
                  item?.paid_date || item?.created_date,
                  "YYYY-MM-DD H-mm-ss"
                ).format("Do MMM YYYY | h:mm a")}
              </Text>
            </View>

            <View
              style={[
                styles.detailsLeftRow,
                {
                  paddingRight: 20,
                },
              ]}
            >
              <Text style={[styles.price, rtlText]} numberOfLines={1}>
                {getPrice(
                  config.payment_currency,
                  {
                    pricing_type: "price",
                    price_type: "",
                    price:
                      config?.coupon && item?.coupon?.discount
                        ? item?.coupon?.original
                        : item.price,
                    max_price: 0,
                  },
                  appSettings.lng
                )}
              </Text>
            </View>
          </View>
          <View
            style={[
              styles.detailsRight,
              { alignItems: rtl_support ? "flex-start" : "flex-end" },
            ]}
          >
            <View style={styles.statusWrap}>
              <Text style={styles.status}>{getStatus()}</Text>
            </View>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
                paddingHorizontal: 10,
              }}
            >
              <TouchableOpacity
                style={{ zIndex: 2 }}
                onPress={(e) => {
                  onActionTouch(e);
                  onAction();
                }}
              >
                <Entypo name="dots-three-vertical" size={20} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  status: {
    fontSize: 12,
    color: COLORS.text_light,
  },
  statusWrap: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: COLORS.border_light,
    marginHorizontal: 10,
  },
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
  detailsLeft: {
    flex: 1,
  },
  detailsLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 2,
  },
  detailsLeftRowText: {
    fontSize: 12,
    color: COLORS.text_gray,
  },
  detailsRight: {},
  iconWrap: {
    width: 20,
    alignItems: "center",
  },

  price: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  container: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.bg_dark,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 5,
    elevation: 3,
    marginHorizontal: "3%",
    shadowColor: COLORS.black,
    shadowRadius: 3,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
});

export default AllPaymentsCard;
