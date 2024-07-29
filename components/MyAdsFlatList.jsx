import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from "react-native";
//  External Libraries
import moment from "moment";
// Vector Icons
import { AntDesign, FontAwesome5, Entypo } from "@expo/vector-icons";
// Custom Components & Constants
import { COLORS } from "../variables/color";
import { getPrice, decodeString } from "../helper/helper";
import { useStateValue } from "../StateProvider";
import { __ } from "../language/stringPicker";
import AdmobBanner from "./AdmobBanner";
import { miscConfig } from "../app/services/miscConfig";
const myAdsListItemFallbackImageUrl = require("../assets/200X150.png");
const MyAdsFlatList = ({ onClick, item, onAction, onActionTouch }) => {
  const [{ config, ios, appSettings, rtl_support }] = useStateValue();
  const [badgeDim, setBadgeDim] = useState(0);

  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };

  const getImageURL = () => {
    if (item.images && !!item.images.length) {
      return item.images[0].sizes.thumbnail.src;
    }
  };
  const getTaxonomy = (data) => {
    if (data) {
      return decodeString(data);
    } else {
      return "";
    }
  };

  const handleHeaderLayout = (e) => {
    setBadgeDim(e.nativeEvent.layout);
  };

  const getStatus = () => {
    if ("pending" === item?.status) {
      return __("listingStatus.pending", appSettings.lng);
    }
    if ("rtcl-expired" === item?.status) {
      return __("listingStatus.expired", appSettings.lng);
    }
    if ("publish" === item?.status) {
      return __("listingStatus.publish", appSettings.lng);
    }
    if ("draft" === item?.status) {
      return __("listingStatus.draft", appSettings.lng);
    }
    if ("rtcl-reviewed" === item?.status) {
      return __("listingStatus.reviewed", appSettings.lng);
    }
  };
  const getTexonomy = (items) => {
    if (!items?.length) return false;
    return decodeString(items[items.length - 1].name);
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
    <View style={[styles.listAd]}>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "space-between",
            padding: 10,
            alignItems: "center",
            overflow: "hidden",
          },
          rtlView,
        ]}
      >
        {item?.badges?.includes("is-sold") && rtl_support && (
          <>
            {badgeDim ? (
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 50,
                  paddingVertical: ios ? 4 : 2,
                  right: -50,
                  top: (badgeDim.width - 100) / 2 - badgeDim.height / 2 || 0,
                  transform: [{ rotate: "-45deg" }],
                }}
              >
                <Text style={styles.soldOutText}>
                  {__("listingCardTexts.soldOutBadgeMessage", appSettings.lng)}
                </Text>
              </View>
            ) : (
              <View
                onLayout={(event) => handleHeaderLayout(event)}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: COLORS.primary,
                  paddingVertical: ios ? 3 : 1.5,
                  paddingHorizontal: 50,
                  right: -48,
                  top: 18,
                  transform: [{ rotate: "-45deg" }],
                }}
              >
                <Text style={styles.soldOutText}>
                  {__("listingCardTexts.soldOutBadgeMessage", appSettings.lng)}
                </Text>
              </View>
            )}
          </>
        )}
        {item?.badges?.includes("is-sold") && !rtl_support && (
          <>
            {badgeDim ? (
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: COLORS.primary,
                  paddingHorizontal: 50,
                  paddingVertical: ios ? 4 : 2,
                  right: -50,
                  top: (badgeDim.width - 100) / 2 - badgeDim.height / 2 || 0,
                  transform: [{ rotate: "45deg" }],
                }}
              >
                <Text style={styles.soldOutText}>
                  {__("listingCardTexts.soldOutBadgeMessage", appSettings.lng)}
                </Text>
              </View>
            ) : (
              <View
                onLayout={(event) => handleHeaderLayout(event)}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  backgroundColor: COLORS.primary,
                  paddingVertical: ios ? 3 : 1.5,
                  paddingHorizontal: 50,
                  right: -48,
                  top: 18,
                  transform: [{ rotate: "45deg" }],
                }}
              >
                <Text style={styles.soldOutText}>
                  {__("listingCardTexts.soldOutBadgeMessage", appSettings.lng)}
                </Text>
              </View>
            )}
          </>
        )}
        <TouchableWithoutFeedback onPress={onClick}>
          <View style={styles.imageWrap}>
            <Image
              style={styles.image}
              source={
                item.images && !!item.images.length
                  ? {
                      uri: getImageURL(),
                    }
                  : myAdsListItemFallbackImageUrl
              }
            />
          </View>
        </TouchableWithoutFeedback>
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
            <TouchableWithoutFeedback onPress={onClick}>
              <View
                style={{
                  flex: 1,
                  justifyContent: "flex-start",
                  alignItems: rtl_support ? "flex-end" : "flex-start",
                }}
              >
                <Text
                  style={[styles.title, { marginBottom: ios ? 3 : 2 }, rtlText]}
                  numberOfLines={2}
                >
                  {getTaxonomy(item.title)}
                </Text>
                <View style={[styles.detailsLeftRow, rtlView]}>
                  <View style={[styles.iconWrap]}>
                    <AntDesign
                      name="tagso"
                      size={15}
                      color={COLORS.text_gray}
                    />
                  </View>
                  <Text
                    style={[styles.detailsLeftRowText, rtlText]}
                    numberOfLines={1}
                  >
                    {getTexonomy(item.categories)}
                  </Text>
                </View>

                {config?.available_fields?.listing.includes("date") && (
                  <View style={[styles.detailsLeftRow, rtlView]}>
                    <View style={[styles.iconWrap]}>
                      <AntDesign
                        name="clockcircleo"
                        size={12}
                        color={COLORS.text_gray}
                      />
                    </View>
                    <Text style={[styles.detailsLeftRowText, rtlText]}>
                      {/* {moment(item.created_at).fromNow()} */}
                      {moment
                        .parseZone(item.created_at + config.timezone.timezone)
                        .fromNow()}
                    </Text>
                  </View>
                )}
                {miscConfig?.enableViewCounts &&
                  config?.available_fields?.listing.includes("views") && (
                    <View style={[styles.detailsLeftRow, rtlView]}>
                      <View style={styles.iconWrap}>
                        <FontAwesome5
                          name="eye"
                          size={12}
                          color={COLORS.text_gray}
                        />
                      </View>
                      <Text style={[styles.detailsLeftRowText, rtlText]}>
                        {__("myAdsListItemTexts.viewsText", appSettings.lng)}{" "}
                        {item?.view_count || "0"}
                      </Text>
                    </View>
                  )}
                <View
                  style={[
                    styles.detailsLeftRow,
                    {
                      paddingRight: 20,
                    },
                  ]}
                >
                  {config?.available_fields?.listing.includes("price") && (
                    <Text style={[styles.price, rtlText]} numberOfLines={1}>
                      {getPrice(
                        item?.currency
                          ? {
                              ...config.currency,
                              ...item.currency,
                            }
                          : config.currency,
                        {
                          pricing_type: item.pricing_type,
                          price_type:
                            config?.available_fields?.listing.includes(
                              "price_type"
                            )
                              ? item?.price_type || null
                              : null,
                          price: item.price,
                          max_price: item.max_price,
                          price_unit: item.price_unit,
                          price_units: item.price_units,
                        },
                        appSettings.lng
                      )}
                    </Text>
                  )}
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.detailsRight}>
            <View
              style={{
                flex: 1,
                justifyContent: "flex-end",
              }}
            >
              <View style={styles.buttonWrap}>
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
      </View>
      {!!item?.status && (
        <View style={{ alignItems: "flex-start", marginBottom: 8 }}>
          <View style={[styles.statusWrap]}>
            <Text style={styles.status}>{getStatus()}</Text>
          </View>
        </View>
      )}
    </View>
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
  buttonText: {},
  buttonWrap: {},
  details: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
  },
  detailsLeft: {
    flex: 1,
    width: "100%",
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
  image: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  imageWrap: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    height: 120,
    width: 120,
    overflow: "hidden",
  },
  price: {
    fontWeight: "bold",
    color: COLORS.primary,
  },
  listAd: {
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
  soldOutText: {
    fontSize: 11.5,
    color: COLORS.white,
    fontWeight: "bold",
  },
  title: {
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default MyAdsFlatList;
