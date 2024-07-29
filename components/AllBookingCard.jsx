import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { useStateValue } from "../StateProvider";
import { COLORS } from "../variables/color";
import { decodeString } from "../helper/helper";
import { __ } from "../language/stringPicker";
const fallbackImageUrl = require("../assets/200X150.png");

const { width: screenWidth } = Dimensions.get("screen");
const AllBookingCard = ({
  item,
  onApproveRequest,
  onRejectRequest,
  onCancelRequest,
  onDeleteRequest,
  onTitlePress,
}) => {
  const [{ appSettings, config, rtl_support }] = useStateValue();
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

  const getStatus = () => {
    if (item.status) {
      if (item.status == "approved") {
        return __("myBookingScreenTexts.statusList.approved", appSettings.lng);
      }
      if (item.status == "pending") {
        return __("myBookingScreenTexts.statusList.pending", appSettings.lng);
      }
      if (["canceled", "cancelled"].includes(item.status)) {
        return __("myBookingScreenTexts.statusList.cancelled", appSettings.lng);
      }
      if (item.status == "rejected") {
        return __("myBookingScreenTexts.statusList.rejected", appSettings.lng);
      }
      if (item.status == "deleted") {
        return __("myBookingScreenTexts.statusList.deleted", appSettings.lng);
      }
    } else {
      return "";
    }
  };
  const getType = () => {
    if (item.meta.rtcl_listing_booking_type) {
      if (item.meta.rtcl_listing_booking_type == "event") {
        return __("myBookingScreenTexts.types.event", appSettings.lng);
      }
      if (item.meta.rtcl_listing_booking_type == "services") {
        return __("myBookingScreenTexts.types.services", appSettings.lng);
      }
      if (item.meta.rtcl_listing_booking_type == "rent") {
        return __("myBookingScreenTexts.types.rent", appSettings.lng);
      }
      if (item.meta.rtcl_listing_booking_type == "pre_order") {
        return __("myBookingScreenTexts.types.pre_order", appSettings.lng);
      }
    } else {
      return "";
    }
  };
  const getCustomerInfo = () => {
    let detail = "";
    if (item.details) {
      if (item.details.name) {
        detail = item.details.name;
      }
      if (item.details.email) {
        detail = detail + " | " + item.details.email;
      }
      if (item.details.phone) {
        detail = detail + " | " + item.details.phone;
      }
      return decodeString(detail) || "";
    } else {
      return "";
    }
  };
  const getBookingDate = () => {
    if (item.meta.rtcl_listing_booking_type == "rent") {
      const start = item.booking_date.split(" - ")[0];
      const end = item.booking_date.split(" - ")[1];
      const endDate = new Date(start);
      const startDate = new Date(end);
      const diffTime = Math.abs(endDate - startDate);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return (
        item.booking_date +
          " (" +
          diffDays +
          __("myBookingScreenTexts.days", appSettings.lng) +
          ")" || ""
      );
    }
    if (item.meta.rtcl_listing_booking_type == "services") {
      return item.booking_date + " " + item.time_slot || "";
    }
    return "";
  };

  const onCancel = () => {
    onCancelRequest(item.id);
  };
  const onDelete = () => {
    onDeleteRequest(item.id);
  };
  const onApprove = () => {
    onApproveRequest(item.id);
  };
  const onReject = () => {
    onRejectRequest(item.id);
  };
  return (
    <View style={styles.container}>
      <View style={[styles.contentWrap, rtlView]}>
        <View style={styles.imgWrap}>
          {item?.listing?.images?.length ? (
            <Image
              source={{ uri: item.listing.images[0].sizes.thumbnail.src }}
              style={{ height: "100%", width: "100%", resizeMode: "contain" }}
            />
          ) : (
            <Image source={fallbackImageUrl} />
          )}
        </View>
        <View
          style={[
            styles.infoWrap,
            {
              paddingLeft: rtl_support ? 0 : 10,
              paddingRight: rtl_support ? 10 : 0,
            },
          ]}
        >
          <View style={[styles.infoRow, rtlView]}>
            <View style={styles.titleWrap}>
              <Text
                style={[styles.title, rtlText]}
                numberOfLines={2}
                onPress={onTitlePress}
              >
                {decodeString(item?.listing?.title || "")}
              </Text>
            </View>
          </View>
          <View style={[styles.infoRow, rtlView]}>
            <View style={styles.infoTitleWrap}>
              <Text style={[styles.infoTitle, rtlText]} numberOfLines={1}>
                {__("myBookingScreenTexts.status", appSettings.lng)}
              </Text>
            </View>
            <View style={styles.statusWrap}>
              <Text style={[styles.status, rtlText]} numberOfLines={1}>
                {getStatus()}
              </Text>
            </View>
          </View>
          <View style={[styles.infoRow, rtlView]}>
            <View style={styles.infoTitleWrap}>
              <Text style={[styles.infoTitle, rtlText]} numberOfLines={1}>
                {__("myBookingScreenTexts.type", appSettings.lng)}
              </Text>
            </View>
            <View style={styles.infoValueWrap}>
              <Text
                style={[
                  styles.infoValue,
                  rtlText,
                  {
                    paddingLeft: rtl_support ? 0 : 10,
                    paddingRight: rtl_support ? 10 : 0,
                  },
                ]}
                numberOfLines={1}
              >
                {getType()}
              </Text>
            </View>
          </View>

          <View style={[styles.infoRow, rtlView]}>
            <View style={styles.infoTitleWrap}>
              <Text style={[styles.infoTitle, rtlText]} numberOfLines={1}>
                {__(
                  item.meta.rtcl_listing_booking_type == "pre_order"
                    ? "myBookingScreenTexts.orderVolume"
                    : "myBookingScreenTexts.guest",
                  appSettings.lng
                )}
              </Text>
            </View>
            <View style={styles.infoValueWrap}>
              <Text
                style={[
                  styles.infoValue,
                  rtlText,
                  {
                    paddingLeft: rtl_support ? 0 : 10,
                    paddingRight: rtl_support ? 10 : 0,
                  },
                ]}
                numberOfLines={1}
              >
                {item.quantity || 0}
              </Text>
            </View>
          </View>
          <View style={[styles.infoRow, rtlView]}>
            <View style={styles.infoTitleWrap}>
              <Text style={[styles.infoTitle, rtlText]} numberOfLines={1}>
                {__("myBookingScreenTexts.customer", appSettings.lng)}
              </Text>
            </View>
            <View style={styles.infoValueWrap}>
              <Text
                style={[
                  styles.infoValue,
                  rtlText,
                  {
                    paddingLeft: rtl_support ? 0 : 10,
                    paddingRight: rtl_support ? 10 : 0,
                  },
                ]}
                numberOfLines={2}
              >
                {getCustomerInfo()}
              </Text>
            </View>
          </View>
          {["rent", "services"].includes(
            item.meta.rtcl_listing_booking_type
          ) && (
            <View style={[styles.infoRow, rtlView]}>
              <View style={styles.infoTitleWrap}>
                <Text style={[styles.infoTitle, rtlText]} numberOfLines={1}>
                  {__("myBookingScreenTexts.bookingDate", appSettings.lng)}
                </Text>
              </View>
              <View style={styles.infoValueWrap}>
                <Text
                  style={[
                    styles.infoValue,
                    rtlText,
                    {
                      paddingLeft: rtl_support ? 0 : 10,
                      paddingRight: rtl_support ? 10 : 0,
                    },
                  ]}
                  numberOfLines={2}
                >
                  {getBookingDate()}
                </Text>
              </View>
            </View>
          )}
          <View style={[styles.infoRow, rtlView]}>
            <View style={styles.infoTitleWrap}>
              <Text style={[styles.infoTitle, rtlText]}>
                {__("myBookingScreenTexts.requestedAt", appSettings.lng)}
              </Text>
            </View>
            <View style={styles.infoValueWrap}>
              <Text
                style={[
                  styles.infoValue,
                  rtlText,
                  {
                    paddingLeft: rtl_support ? 0 : 10,
                    paddingRight: rtl_support ? 10 : 0,
                  },
                ]}
              >
                {item.requested_at || ""}
              </Text>
            </View>
          </View>
          {item.meta.rtcl_listing_booking_type === "pre_order" && (
            <View style={[styles.infoRow, rtlView]}>
              <View style={styles.infoTitleWrap}>
                <Text style={[styles.infoTitle, rtlText]}>
                  {__("myBookingScreenTexts.availableFrom", appSettings.lng)}
                </Text>
              </View>
              <View style={styles.infoValueWrap}>
                <Text
                  style={[
                    styles.infoValue,
                    rtlText,
                    {
                      paddingLeft: rtl_support ? 0 : 10,
                      paddingRight: rtl_support ? 10 : 0,
                    },
                  ]}
                >
                  {item?.meta?._rtcl_booking_pre_order_available_date || ""}
                </Text>
              </View>
            </View>
          )}
          {!!item?.details?.message && (
            <View style={[styles.infoRow, rtlView]}>
              <View style={styles.infoTitleWrap}>
                <Text style={[styles.infoTitle, rtlText]} numberOfLines={1}>
                  {__("myBookingScreenTexts.message", appSettings.lng)}
                </Text>
              </View>
              <View style={styles.infoValueWrap}>
                <Text
                  style={[
                    styles.infoValue,
                    rtlText,
                    {
                      paddingLeft: rtl_support ? 0 : 10,
                      paddingRight: rtl_support ? 10 : 0,
                    },
                  ]}
                >
                  {decodeString(item.details.message) || ""}
                </Text>
              </View>
            </View>
          )}
        </View>
      </View>
      <View style={[styles.btnRow, rtlView]}>
        {item.status === "approved" && (
          <Pressable style={styles.btn} onPress={onCancel}>
            <Text style={styles.btnTitle}>
              {__("myBookingScreenTexts.cancelBtn", appSettings.lng)}
            </Text>
          </Pressable>
        )}
        {item.status === "pending" && (
          <>
            <Pressable style={styles.btn} onPress={onApprove}>
              <Text style={styles.btnTitle}>
                {__("myBookingScreenTexts.approveBtn", appSettings.lng)}
              </Text>
            </Pressable>
            <Pressable style={styles.btn} onPress={onReject}>
              <Text style={styles.btnTitle}>
                {__("myBookingScreenTexts.rejectBtn", appSettings.lng)}
              </Text>
            </Pressable>
          </>
        )}
        {["canceled", "cancelled", "rejected"].includes(item.status) && (
          <Pressable style={styles.btn} onPress={onDelete}>
            <Text style={styles.btnTitle}>
              {__("myBookingScreenTexts.deleteBtn", appSettings.lng)}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  btnTitle: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  btn: {
    backgroundColor: COLORS.button.active,
    marginHorizontal: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginTop: 10,
  },
  btnRow: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  infoValueWrap: {
    flex: 1,
  },
  status: {
    fontSize: 13,
    color: COLORS.white,
    fontWeight: "bold",
  },
  infoTitle: {
    color: COLORS.text_light,
    fontWeight: "bold",
  },
  statusWrap: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    backgroundColor: COLORS.primary_soft,
    marginHorizontal: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginVertical: 5,
    width: "100%",
  },
  infoWrap: {
    flex: 1,
  },
  imgWrap: {
    width: "30%",
    height: 150,
  },
  container: {
    backgroundColor: COLORS.white,
    marginHorizontal: screenWidth * 0.03,
    marginVertical: "2%",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    shadowColor: COLORS.black,
    shadowOpacity: 0.2,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 3,
    width: screenWidth * 0.94,
  },
  contentWrap: {
    flexDirection: "row",
    width: screenWidth * 0.94 - 30,
  },
});

export default AllBookingCard;
