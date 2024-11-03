import React from "react";
import {
  Dimensions,
  View,
  Text,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from "react-native";

// Vector Fonts
import {
  FontAwesome5,
  FontAwesome,
  AntDesign,
  MaterialIcons,
} from "@expo/vector-icons";

// Custom Components & Constants
import { decodeString, getPrice } from "../helper/helper";
import { COLORS } from "../variables/color";
import { useStateValue } from "../StateProvider";
import Badge from "./Badge";
import { __ } from "../language/stringPicker";
import ListAdComponent from "./ListAdComponent";
import { admobConfig } from "../app/services/adMobConfig";
import moment from "moment";
import { miscConfig } from "../app/services/miscConfig";

const { width: screenWidth } = Dimensions.get("screen");

const listingCardFallbackImageUrl = require("../assets/100x100.png");

const ListingCard = ({ onPress, item }) => {
  const [{ config, ios, appSettings, rtl_support }] = useStateValue();

  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  const rtlTextA = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };

  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };
  const getTexonomy = (items) => {
    if (!items?.length) return false;
    return decodeString(items[items.length - 1].name);
  };

  return item?.listAd && admobConfig?.admobEnabled ? (
    <ListAdComponent dummy={item.dummy} />
  ) : (
    <View
      style={{
        shadowColor: "#000",
        shadowRadius: 4,
        shadowOpacity: 0.2,
        shadowOffset: {
          height: 2,
          width: 2,
        },
      }}
    >
      <TouchableWithoutFeedback onPress={onPress}>
        <View
          style={[
            styles.itemWrap,
            {
              backgroundColor: COLORS.white,
              flex: 1,
            },
          ]}
        >
          {item?.badges?.includes("is-bump-up") &&
            config?.badges?.bump_up?.listing && (
              <View
                style={[
                  {
                    position: "absolute",
                    zIndex: 5,
                    height: 20,
                    width: 20,
                    backgroundColor:
                      config?.badges?.bump_up?.color?.bg ||
                      COLORS.promotions.bg._bump_up,
                    alignItems: "center",
                    justifyContent: "center",
                    top: 0,
                  },
                  rtl_support
                    ? { left: 0, borderBottomRightRadius: 3 }
                    : { right: 0, borderBottomLeftRadius: 3 },
                ]}
              >
                <FontAwesome
                  name="clock-o"
                  size={15}
                  color={
                    config?.badges?.bump_up?.color?.text ||
                    COLORS.promotions.text._bump_up
                  }
                />
              </View>
            )}
          {item?.badges?.includes("is-sold") && (
            <View
              style={[
                styles.soldOutBadge,
                {
                  top: ios ? "8%" : "6%",
                  width: ios ? "60%" : "60%",
                  // transform: [{ rotate: "45deg" }],
                  transform: [{ rotate: rtl_support ? "-45deg" : "45deg" }],
                },
                rtl_support
                  ? { right: ios ? "54%" : "56%" }
                  : { left: ios ? "54%" : "56%" },
              ]}
            >
              <Text allowFontScaling={false} style={styles.soldOutBadgeMessage}>
                {__("listingCardTexts.soldOutBadgeMessage", appSettings.lng)}
              </Text>
            </View>
          )}
          {item?.badges?.includes("is-featured") &&
            config?.badges?.featured?.listing && (
              <View
                style={[
                  {
                    position: "absolute",
                    zIndex: 5,
                    top: "5%",
                    flexDirection: rtl_support ? "row-reverse" : "row",
                    alignItems: "center",
                  },
                  rtl_support ? { right: 0 } : { left: 0 },
                ]}
              >
                <View
                  style={{
                    height: 24,
                    justifyContent: "center",
                    backgroundColor:
                      config?.badges?.featured?.color?.bg ||
                      COLORS.promotions.bg.featured,
                  }}
                >
                  <Text
                    allowFontScaling={false}
                    style={[
                      {
                        paddingHorizontal: 5,
                        fontWeight: "bold",
                        color:
                          config?.badges?.featured?.color?.text ||
                          COLORS.promotions.text.featured,
                        fontSize: 14,
                      },
                      rtlTextA,
                    ]}
                  >
                    {config?.badges?.featured?.label ||
                      config?.promotions?.featured ||
                      "Featured"}
                  </Text>
                </View>
                <View
                  style={[
                    {
                      height: 0,
                      width: 0,
                      borderTopWidth: 12,
                      borderTopColor: "transparent",
                      borderBottomColor: "transparent",
                      borderBottomWidth: 12,
                    },
                    rtl_support
                      ? {
                          borderRightWidth: 12,
                          borderRightColor:
                            config?.badges?.featured?.color?.bg ||
                            COLORS.promotions.bg.featured,
                        }
                      : {
                          borderLeftWidth: 12,
                          borderLeftColor:
                            config?.badges?.featured?.color?.bg ||
                            COLORS.promotions.bg.featured,
                        },
                  ]}
                />
              </View>
            )}
          {item?.badges?.includes("is-top") && config?.badges?.top?.listing && (
            <View
              style={[
                {
                  position: "absolute",
                  zIndex: 5,
                  top: item?.badges?.includes("is-featured") ? "20%" : "5%",
                  flexDirection: rtl_support ? "row-reverse" : "row",
                  alignItems: "center",
                },
                rtl_support ? { right: 0 } : { left: 0 },
              ]}
            >
              <View
                style={{
                  height: 24,
                  justifyContent: "center",
                  backgroundColor:
                    config?.badges?.top?.color?.bg || COLORS.promotions.bg._top,
                }}
              >
                <Text
                  allowFontScaling={false}
                  style={[
                    {
                      fontSize: 14,
                      fontWeight: "bold",
                      color:
                        config?.badges?.top?.color?.text ||
                        COLORS.promotions.text._top,
                      paddingHorizontal: 5,
                    },
                    rtlTextA,
                  ]}
                >
                  {config?.badges?.top?.label ||
                    config?.promotions?._top ||
                    "Top"}
                </Text>
              </View>
              <View
                style={[
                  {
                    height: 0,
                    width: 0,
                    borderTopWidth: 12,
                    borderTopColor: "transparent",
                    borderBottomColor: "transparent",
                    borderBottomWidth: 12,
                  },
                  rtl_support
                    ? {
                        borderRightWidth: 12,
                        borderRightColor:
                          config?.badges?.top?.color?.bg ||
                          COLORS.promotions.bg._top,
                      }
                    : {
                        borderLeftWidth: 12,
                        borderLeftColor:
                          config?.badges?.top?.color?.bg ||
                          COLORS.promotions.bg._top,
                      },
                ]}
              />
            </View>
          )}

          <View style={styles.itemImageWrap}>
            <Image
              style={styles.itemImage}
              source={
                item?.images?.length
                  ? {
                      uri: item.images[0].sizes.thumbnail.src,
                    }
                  : listingCardFallbackImageUrl
              }
              resizeMode="contain"
            />
          </View>
          <View
            style={[
              styles.itemDetailWrap,
              {
                alignItems: rtl_support ? "flex-end" : "flex-start",
                paddingHorizontal: ios ? 12 : 10,
              },
            ]}
          >
            <View style={styles.view}>
              <Text
                style={[
                  styles.itemTitle,
                  { paddingBottom: ios ? 3 : 1 },
                  rtlTextA,
                ]}
                numberOfLines={2}
              >
                {decodeString(item.title)}
              </Text>

              <View
                style={[
                  styles.itemLocationWrap,
                  { paddingBottom: ios ? 5 : 3 },
                  rtlView,
                ]}
              >
                <AntDesign name="tagso" size={12} color={COLORS.text_gray} />
                <Text style={[styles.itemLocation, rtlTextA]} numberOfLines={1}>
                  {getTexonomy(item.categories) || ""}
                </Text>
              </View>

              {(!!item?.contact?.locations?.length ||
                !!item?.contact?.geo_address) && (
                <>
                  {config.location_type === "local" ? (
                    <>
                      {!!item?.contact?.locations?.length && (
                        <View
                          style={[
                            styles.itemLocationWrap,
                            { paddingBottom: ios ? 5 : 3 },
                            rtlView,
                          ]}
                        >
                          <FontAwesome5
                            name="map-marker-alt"
                            size={10}
                            color={COLORS.text_gray}
                          />
                          <Text style={[styles.itemLocation, rtlTextA]}>
                            {getTexonomy(item.contact.locations)}
                          </Text>
                        </View>
                      )}
                    </>
                  ) : (
                    <>
                      {!!item?.contact?.geo_address && (
                        <View
                          style={[
                            styles.itemLocationWrap,
                            { paddingBottom: ios ? 5 : 3 },
                            rtlView,
                          ]}
                        >
                          <FontAwesome5
                            name="map-marker-alt"
                            size={10}
                            color={COLORS.text_gray}
                          />
                          <Text
                            style={[styles.itemLocation, rtlTextA]}
                            numberOfLines={1}
                          >
                            {decodeString(item.contact.geo_address)}
                          </Text>
                        </View>
                      )}
                    </>
                  )}
                </>
              )}
              {config?.available_fields?.listing.includes("date") && (
                <View
                  style={[
                    styles.itemLocationWrap,
                    { paddingBottom: ios ? 5 : 3 },
                    rtlView,
                  ]}
                >
                  <AntDesign
                    name="clockcircleo"
                    size={12}
                    color={COLORS.text_gray}
                  />
                  <Text
                    style={[styles.itemLocation, rtlTextA]}
                    numberOfLines={1}
                  >
                    {moment
                      .parseZone(
                        item?.created_at + (config?.timezone?.timezone || "")
                      )
                      .fromNow()}
                  </Text>
                </View>
              )}
              {miscConfig?.enableViewCounts &&
                config?.available_fields?.listing.includes("views") && (
                  <View
                    style={[
                      styles.itemLocationWrap,
                      { paddingBottom: ios ? 5 : 3 },
                      rtlView,
                    ]}
                  >
                    <FontAwesome5
                      name="eye"
                      size={12}
                      color={COLORS.text_gray}
                    />

                    <Text
                      style={[styles.itemLocation, rtlTextA]}
                      numberOfLines={1}
                    >
                      {__("myAdsListItemTexts.viewsText", appSettings.lng)}{" "}
                      {item?.view_count || "0"}
                    </Text>
                  </View>
                )}
            </View>
            {item?.author?.seller_verified && !!config?.seller_verification && (
              <View
                style={{
                  flexDirection: rtl_support ? "row-reverse" : "row",
                  alignItems: "center",
                  // paddingTop: 5,
                }}
              >
                <MaterialIcons
                  name="verified"
                  size={13}
                  color={config?.seller_verification?.badge_color || "green"}
                />
                <View style={{ paddingHorizontal: 5 }}>
                  <Text
                    style={[
                      {
                        fontSize: 12,
                        color:
                          config?.seller_verification?.badge_color || "green",
                      },
                      rtlText,
                    ]}
                  >
                    {__("listingDetailScreenTexts.verified", appSettings.lng)}
                  </Text>
                </View>
              </View>
            )}
            {config?.available_fields?.listing.includes("price") && (
              <Text style={[styles.itemPrice, rtlText]} numberOfLines={1}>
                {getPrice(
                  item?.currency
                    ? {
                        ...config.currency,
                        ...item.currency,
                      }
                    : config.currency,
                  {
                    pricing_type: item.pricing_type,
                    price_type: config?.available_fields?.listing.includes(
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
  );
};
const styles = StyleSheet.create({
  badgeSection: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    margin: 2,
  },
  badgeStyle: {
    padding: 3,
    elevation: 5,
  },
  badgeTextStyle: {
    color: COLORS.white,
    fontSize: 12,
  },
  bumpUpBadge: {
    height: 20,
    width: 20,
    backgroundColor: COLORS.badges["is-bump-up"],
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
  },
  container: {},
  featuredListingTop: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: "3%",

    marginVertical: 10,
  },
  itemCategory: {
    fontSize: 12,
    color: COLORS.text_gray,
  },
  itemDetailWrap: {
    paddingVertical: 10,
    overflow: "hidden",
    justifyContent: "space-between",
    flex: 1,
  },
  itemImage: {
    height: "100%",
    width: "100%",
    resizeMode: "cover",
  },
  itemImageWrap: {
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    width: "100%",
    height: (screenWidth * 0.455 * 2) / 3,
  },
  itemLocation: {
    color: COLORS.text_gray,
    fontSize: 12,
    paddingHorizontal: 5,
  },
  itemLocationWrap: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 2,
  },
  itemPrice: {
    color: COLORS.primary,
    fontSize: 15.5,
    fontWeight: "bold",
  },
  itemTitle: {
    fontSize: 13.5,
    fontWeight: "bold",
    color: COLORS.text_dark,
  },
  itemWrap: {
    marginHorizontal: screenWidth * 0.015,
    overflow: "hidden",
    borderRadius: 3,
    marginBottom: screenWidth * 0.03,
    width: screenWidth * 0.455,
    elevation: 4,
  },
  soldOutBadge: {
    position: "absolute",
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 3,

    flex: 1,
    elevation: 7,
    zIndex: 20,
    shadowColor: "#000",
    shadowRadius: 4,
    shadowOpacity: 0.2,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
  soldOutBadgeMessage: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: "bold",
    textTransform: "uppercase",
  },
});

export default ListingCard;
