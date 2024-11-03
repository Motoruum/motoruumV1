import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Pressable,
  TouchableOpacity,
  TextInput,
  FlatList,
  TouchableWithoutFeedback,
  Alert,
} from "react-native";
import api, { removeAuthToken, setAuthToken } from "../api/client";
import { paginationData } from "../app/pagination/paginationData";
import { COLORS } from "../variables/color.js";
import { useStateValue } from "../StateProvider";
import { __ } from "../language/stringPicker";
import { routes } from "../navigation/routes";
import { useRef } from "react";
import SearchIcon from "../components/svgComponents/SearchIcon";
import { Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import AdmobBanner from "../components/AdmobBanner";
import { admobConfig } from "../app/services/adMobConfig";
import AllAdsCard from "../components/AllAdsCard.jsx";
import PenIcon from "../components/svgComponents/PenIcon.jsx";
import DeleteIcon from "../components/svgComponents/DeleteIcon.jsx";
import { decodeString } from "../helper/helper.js";
import AppTextButton from "../components/AppTextButton";
import FlashNotification from "../components/FlashNotification";

const { height: windowHeight, width: windowWidth } = Dimensions.get("window");
const extraHeight = 50;

const AllListingsScreen = ({ navigation }) => {
  const [{ appSettings, rtl_support, auth_token, config }] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [listingsData, setListingsData] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(
    pagination.page || paginationData.allListings.page
  );
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [admobError, setAdmobError] = useState(false);
  const [actionItem, setActionItem] = useState();
  const [actionPosition, setActionPosition] = useState();
  const [actionMenuVisible, setActionMenuVisible] = useState(false);
  const [statusMenuVisible, setStatusMenuVisible] = useState(false);
  const [actionStatus, setActionStatus] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [flashNotificationMessage, setFlashNotificationMessage] = useState("");
  const [flashNotification, setFlashNotification] = useState(false);

  useEffect(() => {
    getAllListingsData(paginationData.allListings);
  }, []);

  // Refreshing get listings call
  useEffect(() => {
    if (!refreshing) return;
    setCurrentPage(1);
    setPagination({});
    const args = {
      ...paginationData.allListings,
      search: search,
      status: filter,
    };
    getAllListingsData(args);
  }, [refreshing]);

  // next page get listings call
  useEffect(() => {
    if (!moreLoading) return;
    const data = {
      per_page: paginationData.allListings.per_page,
      page: currentPage,
      search: search || null,
      status: filter || null,
    };
    getAllListingsData(data);
  }, [moreLoading]);

  const getAllListingsData = (args) => {
    setAuthToken(auth_token);
    api
      .get("my/manage/listings", { ...args })
      .then((res) => {
        if (res.ok) {
          if (refreshing) {
            setRefreshing(false);
          }
          if (moreLoading) {
            setListingsData((ListingsData) => [
              ...ListingsData,
              ...res.data.data,
            ]);
            setMoreLoading(false);
          } else {
            setListingsData(res.data.data);
          }
          setPagination(res.data.pagination ? res.data.pagination : {});

          setLoading(false);
        } else {
          // print error
          if (refreshing) {
            setRefreshing(false);
          }
          // TODO handle error
          if (moreLoading) {
            setMoreLoading(false);
          }
          setLoading(false);
        }
      })
      .finally(() => removeAuthToken());
  };

  const onView = (item) => {
    navigation.navigate(routes.listingDetailScreen, {
      listingId: item?.listing_id || item.id,
      from: "all_listing",
    });
  };
  const handleSetActionPosition = (urg) => {
    setActionPosition({
      actionX: urg.nativeEvent.pageX,
      actionY: urg.nativeEvent.pageY,
    });
  };

  const handleActionButtonPress = (listing) => {
    setActionItem(listing);
    setActionStatus(listing.status);
    setActionMenuVisible(true);
  };

  const renderListItem = useCallback(
    ({ item }) => (
      <AllAdsCard
        item={item}
        onClick={() => onView(item)}
        onAction={() => handleActionButtonPress(item)}
        onActionTouch={handleSetActionPosition}
      />
    ),
    [listingsData]
  );

  const keyExtractor = useCallback((item, index) => `${index}`, []);
  const EmptyListComponent = () => (
    <View
      style={{
        alignItems: "center",
        marginVertical: 20,
      }}
    >
      <Text
        style={{ fontSize: 16, fontWeight: "bold", color: COLORS.text_light }}
      >
        {__("allListingsSCreenTexts.noListingAvailable", appSettings.lng)}
      </Text>
    </View>
  );
  const listFooter = () => {
    if (pagination && pagination.total_pages > pagination.current_page) {
      return (
        <View style={styles.loadMoreWrap}>
          <ActivityIndicator size="small" color={COLORS.primary} />
        </View>
      );
    } else {
      return null;
    }
  };

  const onRefresh = () => {
    if (moreLoading) return;
    setRefreshing(true);
  };

  const handleNextPageLoading = () => {
    if (refreshing) return;
    if (pagination && pagination.total_pages > pagination.current_page) {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
      setMoreLoading(true);
    }
  };
  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };

  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };
  const searchRef = useRef(null);

  const handleSearch = (e) => {
    if (e?.nativeEvent?.text && e?.nativeEvent?.text?.trim()) {
      setLoading(true);
      setSearch(e.nativeEvent.text);
      const args = {
        ...paginationData,
        search: e.nativeEvent.text,
        status: filter || null,
      };
      getAllListingsData(args);
    } else {
      searchRef.current.clear();
    }
  };

  const handleClear = () => {
    searchRef.current.clear();
    if (search) {
      setSearch("");
      onRefresh();
    }
  };

  const onAdmobError = (error) => {
    setAdmobError(true);
  };

  const ListHeaderComponent = () => (
    <View
      style={{
        width: "100%",
        alignItems: "center",
        marginVertical: 10,
      }}
    >
      <AdmobBanner onError={onAdmobError} />
    </View>
  );

  const onPublish = () => {
    setLoading(true);
    setFilter("publish");
    const args = { ...paginationData, search: search, status: "publish" };
    getAllListingsData(args);
  };
  const onPending = () => {
    setLoading(true);
    setFilter("pending");
    const args = { ...paginationData, search: search, status: "pending" };
    getAllListingsData(args);
  };
  const onReviewed = () => {
    setLoading(true);
    setFilter("rtcl-reviewed");
    const args = { ...paginationData, search: search, status: "rtcl-reviewed" };
    getAllListingsData(args);
  };
  const onDraft = () => {
    setLoading(true);
    setFilter("draft");
    const args = { ...paginationData, search: search, status: "draft" };
    getAllListingsData(args);
  };
  const onExpired = () => {
    setLoading(true);
    setFilter("rtcl-expired");
    const args = { ...paginationData, search: search, status: "rtcl-expired" };
    getAllListingsData(args);
  };
  const onAll = () => {
    setLoading(true);
    setFilter("");
    const args = { ...paginationData, search: search, status: null };
    getAllListingsData(args);
  };

  const handleActionOverlayPress = () => {
    setActionMenuVisible(false);
    setActionItem();
    setActionStatus();
  };
  const handleStatusMenuOverlayPress = () => {
    setStatusMenuVisible(false);
    setActionItem();
  };

  const handleDeleteAlert = (listing) => {
    Alert.alert(
      "",
      `${__(
        "allListingsSCreenTexts.deletePromptMessage",
        appSettings.lng
      )} ${decodeString(listing.title)} ?`,
      [
        {
          text: __("allListingsSCreenTexts.cancelButtonTitle", appSettings.lng),
        },
        {
          text: __("allListingsSCreenTexts.deleteButtonTitle", appSettings.lng),
          onPress: () => handleDeleteListing(listing),
        },
      ],
      { cancelable: false }
    );
  };

  const handleDeleteListing = (listing) => {
    setActionMenuVisible(false);
    setDeleteLoading(true);
    setActionStatus();
    // return;

    setAuthToken(auth_token);
    api
      .delete("my/manage/listings", {
        listing_id: listing?.listing_id || listing.listing_id,
      })
      .then((res) => {
        if (res.ok) {
          const filtered = listingsData.filter(
            (item) => item.listing_id != listing.listing_id
          );
          setListingsData(filtered);
          removeAuthToken();
          setDeleteLoading(false);
          handleSuccess(
            __(
              "allListingsSCreenTexts.listingDeleteSuccessText",
              appSettings.lng
            )
          );
        } else {
          setDeleteLoading(false);
          removeAuthToken();
          handleError(
            res?.data?.error_message ||
              res?.data?.error ||
              res?.problem ||
              __(
                "allListingsSCreenTexts.listingDeleteErrorText",
                appSettings.lng
              )
          );
        }
      });
  };

  const handleStatusChangeReq = () => {
    setActionMenuVisible(false);
    setStatusMenuVisible(true);
  };
  const handleEditListing = (listing) => {
    setActionMenuVisible(false);
    setActionStatus();
    navigation.navigate(routes.editListingScreen, {
      item: listing,
      admin: true,
    });
  };

  const handleSuccess = (message) => {
    setFlashNotificationMessage(message);
    setTimeout(() => {
      setFlashNotification(true);
    }, 100);
    setTimeout(() => {
      setFlashNotification(false);
      setFlashNotificationMessage();
    }, 2500);
  };
  const handleError = (message) => {
    setFlashNotificationMessage(message);
    setTimeout(() => {
      setFlashNotification(true);
    }, 100);
    setTimeout(() => {
      setFlashNotification(false);
      setFlashNotificationMessage();
    }, 2500);
  };

  const onListingStatusStore = (selectedStatus) => {
    setActionStatus(selectedStatus);
  };
  const onStatusUpdate = () => {
    setStatusMenuVisible(false);
    setDeleteLoading(true);
    setAuthToken(auth_token);
    api
      .post("my/manage/listings/change-status", {
        id: actionItem.listing_id,
        status: actionStatus,
      })
      .then((res) => {
        if (res.ok) {
          const updatedData = listingsData.map((item) => {
            if (item.listing_id != res.data.listing_id) {
              return item;
            } else {
              return { ...item, status: actionStatus };
            }
          });
          setListingsData(updatedData);
          handleSuccess(
            __(
              "allListingsSCreenTexts.listingStatusUpdateText",
              appSettings.lng
            )
          );
        } else {
          handleError(
            res?.data?.error_message ||
              res?.data?.error ||
              res?.problem ||
              __(
                "allListingsSCreenTexts.listingDeleteErrorText",
                appSettings.lng
              )
          );
        }
      })
      .finally(() => {
        setActionItem();
        setActionStatus();
        setDeleteLoading(false);
        removeAuthToken();
      });
  };

  return (
    <>
      <View
        style={{
          height: 41,
          borderWidth: 1,
          borderRadius: 4,
          borderColor: COLORS.border_light,
          flexDirection: rtl_support ? "row-reverse" : "row",
          alignItems: "center",
          marginTop: 10,
          marginHorizontal: "3%",
        }}
      >
        <Pressable
          onPress={() => searchRef.current.focus()}
          disabled={deleteLoading}
        >
          <View
            style={{
              paddingHorizontal: 12,
            }}
          >
            <SearchIcon color={COLORS.gray} />
          </View>
        </Pressable>
        <TextInput
          ref={searchRef}
          style={{
            flex: 1,
            paddingRight: rtl_support ? 5 : 40,
            paddingLeft: rtl_support ? 40 : 5,
            height: "100%",
            writingDirection: rtl_support ? "rtl" : "ltr",
            textAlign: rtl_support ? "right" : "left",
          }}
          placeholder={__(
            "allListingsSCreenTexts.searchPlaceholder",
            appSettings.lng
          )}
          placeholderTextColor={COLORS.text_light}
          returnKeyType="search"
          onSubmitEditing={handleSearch}
        />
        <View
          style={{
            position: "absolute",
            right: 0,
            height: "100%",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Pressable onPress={handleClear} disabled={deleteLoading}>
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                width: 40,
              }}
            >
              <Feather name={"x"} size={20} color={COLORS.gray} />
            </View>
          </Pressable>
        </View>
      </View>
      {/* Action Menu Component */}
      {actionMenuVisible && (
        <TouchableWithoutFeedback onPress={handleActionOverlayPress}>
          <View style={styles.actionLoading}>
            <View
              style={
                windowHeight - actionPosition.actionY >= 150
                  ? [
                      styles.actionMenu,
                      rtl_support
                        ? {
                            left: "3%",
                            top: actionPosition.actionY - extraHeight,
                          }
                        : {
                            right: "3%",
                            top: actionPosition.actionY - extraHeight,
                          },
                    ]
                  : [
                      styles.actionMenu,
                      rtl_support
                        ? {
                            left: "3%",
                            bottom: windowHeight - actionPosition.actionY,
                          }
                        : {
                            right: "3%",
                            bottom: windowHeight - actionPosition.actionY,
                          },
                    ]
              }
            >
              {rtl_support ? (
                <View
                  style={[
                    {
                      height: 0,
                      width: 0,
                      borderRightWidth: 10,
                      borderLeftWidth: 10,
                      borderRightColor: "transparent",
                      borderLeftColor: "transparent",
                      position: "absolute",
                      marginLeft: windowWidth * 0.03,
                      left: 0,
                    },
                    windowHeight - actionPosition.actionY >= 150
                      ? {
                          top: -15,
                          borderBottomWidth: 15,
                          borderBottomColor: COLORS.white,
                        }
                      : {
                          bottom: -15,
                          borderTopWidth: 15,
                          borderTopColor: COLORS.white,
                        },
                  ]}
                />
              ) : (
                <View
                  style={[
                    {
                      height: 0,
                      width: 0,
                      borderRightWidth: 10,
                      borderLeftWidth: 10,
                      borderRightColor: "transparent",
                      borderLeftColor: "transparent",
                      position: "absolute",
                      marginRight: windowWidth * 0.03,
                      right: 0,
                    },
                    ,
                    windowHeight - actionPosition.actionY >= 150
                      ? {
                          top: -15,
                          borderBottomWidth: 15,
                          borderBottomColor: COLORS.white,
                        }
                      : {
                          bottom: -15,
                          borderTopWidth: 15,
                          borderTopColor: COLORS.white,
                        },
                  ]}
                />
              )}
              <TouchableOpacity
                style={[styles.iconButton, rtlView]}
                onPress={() => handleStatusChangeReq(actionItem)}
              >
                <View
                  style={[
                    styles.buttonIconWrap,
                    {
                      marginRight: rtl_support ? 0 : 5,
                      marginLeft: rtl_support ? 5 : 0,
                    },
                  ]}
                >
                  <MaterialCommunityIcons
                    name="list-status"
                    size={16}
                    color={COLORS.text_gray}
                  />
                </View>
                <Text style={[styles.buttonText, rtlText]}>
                  {__(
                    "allListingsSCreenTexts.actionMenuButtons.statusChange",
                    appSettings.lng
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.iconButton, rtlView]}
                onPress={() => handleEditListing(actionItem)}
              >
                <View
                  style={[
                    styles.buttonIconWrap,
                    {
                      marginRight: rtl_support ? 0 : 5,
                      marginLeft: rtl_support ? 5 : 0,
                    },
                  ]}
                >
                  <PenIcon fillColor={COLORS.text_gray} />
                </View>
                <Text style={[styles.buttonText, rtlText]}>
                  {__(
                    "allListingsSCreenTexts.actionMenuButtons.edit",
                    appSettings.lng
                  )}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  {
                    paddingHorizontal: 7,
                  },
                ]}
                onPress={() => handleDeleteAlert(actionItem)}
              >
                <View
                  style={[
                    {
                      backgroundColor: COLORS.bg_primary,
                      paddingHorizontal: 8,
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 5,
                      borderRadius: 5,
                    },
                    rtlView,
                  ]}
                >
                  <View
                    style={[
                      styles.buttonIconWrap,
                      {
                        marginRight: rtl_support ? 0 : 5,
                        marginLeft: rtl_support ? 5 : 0,
                      },
                    ]}
                  >
                    <DeleteIcon fillColor={COLORS.primary} />
                  </View>
                  <Text
                    style={[
                      styles.buttonText,
                      rtlText,
                      { color: COLORS.primary },
                    ]}
                  >
                    {__(
                      "allListingsSCreenTexts.actionMenuButtons.delete",
                      appSettings.lng
                    )}
                  </Text>
                </View>
              </TouchableOpacity>
              {/* {config?.mark_as_sold  && (
                    <TouchableOpacity
                      style={[styles.iconButton, rtlView]}
                      // onPress={() => handleSoldAlert(actionItem)}
                    >
                      <View
                        style={[
                          styles.buttonIconWrap,
                          {
                            marginRight: rtl_support ? 0 : 5,
                            marginLeft: rtl_support ? 5 : 0,
                          },
                        ]}
                      >
                        <SoldIcon fillColor={COLORS.text_gray} />
                      </View>
                      <Text style={[styles.buttonText, rtlText]}>
                        {actionItem.badges.includes("is-sold")
                          ? __(
                              "myListingsScreenTexts.actionMenuButtons.unsold",
                              appSettings.lng
                            )
                          : __(
                              "myListingsScreenTexts.actionMenuButtons.sold",
                              appSettings.lng
                            )}
                      </Text>
                    </TouchableOpacity>
                  )}
                  {config?.renew &&
                    "rtcl-expired" === actionItem?.status &&
                    actionItem?.renew && (
                      <TouchableOpacity
                        style={[styles.iconButton, rtlView]}
                        // onPress={() => itemRenewCofirmation(actionItem)}
                      >
                        <View
                          style={[
                            styles.buttonIconWrap,
                            {
                              marginRight: rtl_support ? 0 : 5,
                              marginLeft: rtl_support ? 5 : 0,
                            },
                          ]}
                        >
                          <RenewIcon fillColor={COLORS.text_gray} />
                        </View>
                        <Text style={[styles.buttonText, rtlText]}>
                          {__(
                            "myListingsScreenTexts.actionMenuButtons.renew",
                            appSettings.lng
                          )}
                        </Text>
                      </TouchableOpacity>
                    )} */}
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {/* Status Menu Component */}
      {statusMenuVisible && (
        <TouchableWithoutFeedback onPress={handleStatusMenuOverlayPress}>
          <View style={styles.actionLoading}>
            <View
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  backgroundColor: COLORS.white,
                  paddingHorizontal: 20,
                  paddingVertical: 15,
                  minWidth: "50%",
                  alignItems: "center",
                  justifyContent: "center",
                  marginHorizontal: 15,
                  marginVertical: 30,
                  borderRadius: 10,
                  elevation: 5,
                  zIndex: 10,
                }}
              >
                <View style={styles.view}>
                  <Text
                    style={[
                      { fontWeight: "bold", color: COLORS.text_gray },
                      rtlText,
                    ]}
                  >
                    {__(
                      "allListingsSCreenTexts.statusChangeTitle",
                      appSettings.lng
                    )}
                  </Text>
                </View>
                <View style={{ paddingVertical: 15 }}>
                  <TouchableOpacity
                    style={{
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: COLORS.primary,
                      paddingHorizontal: 15,
                      paddingVertical: 7,
                      backgroundColor:
                        actionStatus === "draft"
                          ? COLORS.primary
                          : COLORS.white,
                    }}
                    onPress={() => {
                      onListingStatusStore("draft");
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontWeight: "bold",
                          color:
                            actionStatus === "draft"
                              ? COLORS.white
                              : COLORS.primary,
                          textAlign: "center",
                        },
                        rtlText,
                      ]}
                    >
                      {__(
                        "allListingsSCreenTexts.statusMenuButtons.draft",
                        appSettings.lng
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: COLORS.primary,
                      paddingHorizontal: 15,
                      paddingVertical: 7,
                      backgroundColor:
                        actionStatus === "rtcl-reviewed"
                          ? COLORS.primary
                          : COLORS.white,
                    }}
                    onPress={() => {
                      onListingStatusStore("rtcl-reviewed");
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontWeight: "bold",
                          color:
                            actionStatus === "rtcl-reviewed"
                              ? COLORS.white
                              : COLORS.primary,
                          textAlign: "center",
                        },
                        rtlText,
                      ]}
                    >
                      {__(
                        "allListingsSCreenTexts.statusMenuButtons.rtcl-reviewed",
                        appSettings.lng
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: COLORS.primary,
                      paddingHorizontal: 15,
                      paddingVertical: 7,
                      backgroundColor:
                        actionStatus === "pending"
                          ? COLORS.primary
                          : COLORS.white,
                    }}
                    onPress={() => {
                      onListingStatusStore("pending");
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontWeight: "bold",
                          color:
                            actionStatus === "pending"
                              ? COLORS.white
                              : COLORS.primary,
                          textAlign: "center",
                        },
                        rtlText,
                      ]}
                    >
                      {__(
                        "allListingsSCreenTexts.statusMenuButtons.pending",
                        appSettings.lng
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: COLORS.primary,
                      paddingHorizontal: 15,
                      paddingVertical: 7,
                      backgroundColor:
                        actionStatus === "publish"
                          ? COLORS.primary
                          : COLORS.white,
                    }}
                    onPress={() => {
                      onListingStatusStore("publish");
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontWeight: "bold",
                          color:
                            actionStatus === "publish"
                              ? COLORS.white
                              : COLORS.primary,
                          textAlign: "center",
                        },
                        rtlText,
                      ]}
                    >
                      {__(
                        "allListingsSCreenTexts.statusMenuButtons.publish",
                        appSettings.lng
                      )}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={{
                      marginVertical: 5,
                      borderWidth: 1,
                      borderRadius: 3,
                      borderColor: COLORS.primary,
                      paddingHorizontal: 15,
                      paddingVertical: 7,
                      backgroundColor:
                        actionStatus === "rtcl-expired"
                          ? COLORS.primary
                          : COLORS.white,
                    }}
                    onPress={() => {
                      onListingStatusStore("rtcl-expired");
                    }}
                  >
                    <Text
                      style={[
                        {
                          fontWeight: "bold",
                          color:
                            actionStatus === "rtcl-expired"
                              ? COLORS.white
                              : COLORS.primary,
                          textAlign: "center",
                        },
                        rtlText,
                      ]}
                    >
                      {__(
                        "allListingsSCreenTexts.statusMenuButtons.rtcl-expired",
                        appSettings.lng
                      )}
                    </Text>
                  </TouchableOpacity>
                </View>
                {actionItem.status !== actionStatus && (
                  <View style={{ marginBottom: 10 }}>
                    <AppTextButton
                      disabled={actionItem.status === actionStatus}
                      onPress={onStatusUpdate}
                      title={__(
                        "allListingsSCreenTexts.statusUpdateBtn",
                        appSettings.lng
                      )}
                    />
                    {/* <AppButton
                    title={__(
                      "allListingsSCreenTexts.statusUpdateBtn",
                      appSettings.lng
                    )}
                  /> */}
                  </View>
                )}
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      )}
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          {/* ActionLoading Component */}
          {!!deleteLoading && (
            <View style={styles.deleteLoading}>
              <View style={styles.deleteLoadingContentWrap}>
                <ActivityIndicator size={"large"} color={COLORS.primary} />
              </View>
            </View>
          )}

          <View style={styles.filterContainer}>
            <Pressable
              style={[
                styles.filter,
                {
                  borderColor:
                    filter === "" ? COLORS.primary : COLORS.border_light,
                },
              ]}
              onPress={onAll}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color: filter === "" ? COLORS.primary : COLORS.text_gray,
                  },
                ]}
              >
                {__("allListingsSCreenTexts.all", appSettings.lng)}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filter,
                {
                  borderColor:
                    filter === "publish" ? COLORS.primary : COLORS.border_light,
                },
              ]}
              onPress={onPublish}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      filter === "publish" ? COLORS.primary : COLORS.text_gray,
                  },
                ]}
              >
                {__("listingStatus.publish", appSettings.lng)}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filter,
                {
                  borderColor:
                    filter === "pending" ? COLORS.primary : COLORS.border_light,
                },
              ]}
              onPress={onPending}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      filter === "pending" ? COLORS.primary : COLORS.text_gray,
                  },
                ]}
              >
                {__("listingStatus.pending", appSettings.lng)}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filter,
                {
                  borderColor:
                    filter === "rtcl-expired"
                      ? COLORS.primary
                      : COLORS.border_light,
                },
              ]}
              onPress={onExpired}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      filter === "rtcl-expired"
                        ? COLORS.primary
                        : COLORS.text_gray,
                  },
                ]}
              >
                {__("listingStatus.rtcl-expired", appSettings.lng)}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filter,
                {
                  borderColor:
                    filter === "draft" ? COLORS.primary : COLORS.border_light,
                },
              ]}
              onPress={onDraft}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      filter === "draft" ? COLORS.primary : COLORS.text_gray,
                  },
                ]}
              >
                {__("listingStatus.draft", appSettings.lng)}
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.filter,
                {
                  borderColor:
                    filter === "rtcl-reviewed"
                      ? COLORS.primary
                      : COLORS.border_light,
                },
              ]}
              onPress={onReviewed}
            >
              <Text
                style={[
                  styles.filterText,
                  {
                    color:
                      filter === "rtcl-reviewed"
                        ? COLORS.primary
                        : COLORS.text_gray,
                  },
                ]}
              >
                {__("listingStatus.rtcl-reviewed", appSettings.lng)}
              </Text>
            </Pressable>
          </View>
          <View style={styles.container}>
            {/* Stores List */}
            <FlatList
              data={listingsData}
              renderItem={renderListItem}
              keyExtractor={keyExtractor}
              horizontal={false}
              // numColumns={3}
              showsVerticalScrollIndicator={false}
              onEndReached={handleNextPageLoading}
              onEndReachedThreshold={1}
              ListFooterComponent={listFooter}
              maxToRenderPerBatch={15}
              windowSize={60}
              onRefresh={onRefresh}
              refreshing={refreshing}
              scrollEventThrottle={1}
              ListEmptyComponent={EmptyListComponent}
              ListHeaderComponent={
                admobConfig?.admobEnabled &&
                admobConfig?.enableBannerInAdminListingsTop &&
                !admobError
                  ? ListHeaderComponent
                  : null
              }
              contentContainerStyle={{
                marginHorizontal: windowWidth * 0.015,
                paddingBottom: 20,
                paddingTop:
                  admobConfig?.admobEnabled &&
                  admobConfig?.enableBannerInAdminListingsTop &&
                  !admobError
                    ? 0
                    : 20,
              }}
            />
          </View>
        </View>
      )}
      <FlashNotification
        falshShow={flashNotification}
        flashMessage={flashNotificationMessage}
      />
    </>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontWeight: "bold",
    color: COLORS.text_gray,
  },
  buttonIcon: {
    height: "100%",
    width: "100%",
    resizeMode: "contain",
  },
  buttonIconWrap: {
    height: 16,
    width: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 5,
    paddingHorizontal: 15,
  },
  deleteLoading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.3)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 5,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  deleteLoadingContentWrap: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLoading: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.5)",
    zIndex: 5,
    flex: 1,
    height: "100%",
    width: "100%",
  },
  actionMenu: {
    backgroundColor: "#fff",
    borderRadius: 5,
    paddingVertical: 10,
    position: "absolute",
  },
  filter: {
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: 7,
    marginHorizontal: 10,
    marginVertical: 5,
  },
  filterContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginHorizontal: windowWidth * 0.015,
    paddingVertical: 5,
    flexWrap: "wrap",
  },
  container: {
    flex: 1,
    backgroundColor: "#F8F8F8",
  },
  loading: {
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    opacity: 1,
    backgroundColor: "transparent",
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },
  logo: {
    height: windowWidth * 0.17,
    width: windowWidth * 0.25,
            resizeMode: "contain",
  },
  logoWrap: {
    height: windowWidth * 0.17,
    width: windowWidth * 0.25,
    overflow: "hidden",
  },
  storeCardListingCount: {
    fontSize: 13,
    fontWeight: "bold",
    color: COLORS.text_gray,
  },
  storeCardTitle: {
    fontWeight: "bold",
    fontSize: 14,
    marginVertical: 5,
  },
  storeContent: {
    alignItems: "center",
    padding: 5,
  },
  storeWrap: {
    // height: (windowWidth * 0.88) / 3,
    width: (windowWidth * 0.88) / 3,
    marginHorizontal: windowWidth * 0.015,
    backgroundColor: COLORS.white,
    marginBottom: windowWidth * 0.03,
    borderRadius: 5,
    // overflow: "hidden",
    alignItems: "center",
    elevation: 3,
    shadowColor: COLORS.gray,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: {
      height: 2,
      width: 2,
    },
  },
});

export default AllListingsScreen;
