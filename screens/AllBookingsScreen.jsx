import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Modal,
  Alert,
} from "react-native";
import api, { removeAuthToken, setAuthToken } from "../api/client";
import { COLORS } from "../variables/color";
import { useStateValue } from "../StateProvider";
import { decodeString } from "../helper/helper";
import AppButton from "../components/AppButton";
import { __ } from "../language/stringPicker";
import { paginationData } from "../app/pagination/paginationData";
import { routes } from "../navigation/routes";
import { useIsFocused } from "@react-navigation/native";
import AllBookingCard from "../components/AllBookingCard";
const initiaPagination = { ...paginationData.bookings };
const AllBookingsScreen = ({ navigation }) => {
  const [{ auth_token, appSettings, rtl_support }] = useStateValue();
  const [loading, setLoading] = useState(true);
  const [actionOverlay, setActionOverlay] = useState(false);
  const [retry, setRetry] = useState(false);
  const [bookingsData, setBookingsData] = useState([]);
  const [errorMessage, setErrorMessage] = useState();
  const [refreshing, setRefreshing] = useState(false);
  const [moreLoading, setMoreLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(
    pagination.page || initiaPagination.page
  );
  const isFocused = useIsFocused();

  //  Initial Call
  useEffect(() => {
    loadBookingsData(initiaPagination);
  }, []);

  // Refreshing Call
  useEffect(() => {
    if (!refreshing) return;
    setCurrentPage(1);
    setPagination({});
    loadBookingsData(initiaPagination);
  }, [refreshing]);

  // next page  call
  useEffect(() => {
    if (!moreLoading) return;
    const data = {
      per_page: initiaPagination.per_page,
      page: currentPage,
    };
    loadBookingsData(data);
  }, [moreLoading]);

  // Retry call
  useEffect(() => {
    if (!retry) {
      return;
    }
    loadBookingsData(initiaPagination);
  }, [retry]);

  const loadBookingsData = (arg) => {
    if (!!errorMessage) {
      setErrorMessage();
    }
    setAuthToken(auth_token);
    api
      .get("my/user-bookings", arg)
      .then((res) => {
        if (isFocused) {
          if (res?.ok) {
            if (moreLoading) {
              if (res?.data?.data?.length) {
                setBookingsData((prevBookingsData) => [
                  ...prevBookingsData,
                  ...res.data.data,
                ]);
              }
            } else {
              if (res?.data?.data?.length) {
                setBookingsData(res.data.data);
              }
            }
            setPagination(res.data.pagination ? res.data.pagination : {});
          } else {
            setErrorMessage(
              res?.data?.message ||
                res?.data?.error ||
                res?.problem ||
                __("myBookingScreenTexts.unknownError", appSettings.lng)
            );
          }
        }
      })
      .then(() => {
        removeAuthToken();
        if (loading) {
          setLoading(false);
        }
        if (refreshing) {
          setRefreshing(false);
        }
        if (moreLoading) {
          setMoreLoading(false);
        }
        if (retry) {
          setRetry(false);
        }
      });
  };

  const handleNextPageLoading = () => {
    if (refreshing) return;
    if (pagination && pagination.total_pages > pagination.current_page) {
      setCurrentPage((prevCurrentPage) => prevCurrentPage + 1);
      setMoreLoading(true);
    }
  };

  const handleCardPress = (item) => {
    navigation.navigate(routes.paymentDetailScreen, {
      id: item.id,
      header: true,
    });
  };

  const handleRetry = () => {
    setLoading(true);
    setRetry(true);
  };

  const onRefresh = () => {
    if (moreLoading) return;
    setRefreshing(true);
  };

  const onBookingCancelRequest = (itemId) => {
    Alert.alert("", __("myBookingScreenTexts.cancelWarning", appSettings.lng), [
      { text: __("myBookingScreenTexts.noBtn", appSettings.lng) },
      {
        text: __("myBookingScreenTexts.yesBtn", appSettings.lng),
        onPress: () => onBookingCancel(itemId),
      },
    ]);
  };
  const onBookingCancel = (itemId) => {
    setActionOverlay(true);
    setAuthToken(auth_token);
    api
      .post("my/user-bookings", { action: "canceled", booking_id: itemId })
      .then((res) => {
        if (res?.ok) {
          const tempBookingsData = bookingsData.map((bItem) => {
            if (bItem.id != itemId) {
              return bItem;
            } else {
              return { ...bItem, status: "canceled" };
            }
          });
          alert(res?.data?.message || "");
          setBookingsData(tempBookingsData);
        } else {
          alert(
            res?.data?.message ||
              JSON.stringify(res?.data?.error || res?.problem) ||
              __("myBookingScreenTexts.unknownError", appSettings.lng)
          );
        }
      })
      .then(() => {
        removeAuthToken();
        setActionOverlay(false);
      });
  };
  const onBookingDeleteRequest = (itemId) => {
    Alert.alert("", __("myBookingScreenTexts.deleteWarning", appSettings.lng), [
      { text: __("myBookingScreenTexts.noBtn", appSettings.lng) },
      {
        text: __("myBookingScreenTexts.yesBtn", appSettings.lng),
        onPress: () => onBookingDelete(itemId),
      },
    ]);
  };
  const onBookingDelete = (itemId) => {
    setActionOverlay(true);
    setAuthToken(auth_token);
    api
      .delete("my/user-bookings", {}, { data: { booking_id: itemId } })
      .then((res) => {
        if (res?.ok) {
          const tempBookingsData = [...bookingsData].filter(
            (bItem) => bItem.id != itemId
          );
          if (res?.data?.message) {
            alert(res?.data?.message || "");
          }
          setBookingsData(tempBookingsData);
        } else {
          alert(
            res?.data?.message ||
              JSON.stringify(res?.data?.error || res?.problem) ||
              __("myBookingScreenTexts.unknownError", appSettings.lng)
          );
        }
      })
      .then(() => {
        removeAuthToken();
        setActionOverlay(false);
      });
  };
  const onBookingApproveRequest = (itemId) => {
    Alert.alert(
      "",
      __("myBookingScreenTexts.approveWarning", appSettings.lng),
      [
        { text: __("myBookingScreenTexts.noBtn", appSettings.lng) },
        {
          text: __("myBookingScreenTexts.yesBtn", appSettings.lng),
          onPress: () => onBookingApprove(itemId),
        },
      ]
    );
  };

  const onBookingApprove = (itemId) => {
    setActionOverlay(true);
    setAuthToken(auth_token);
    api
      .post("my/user-bookings", { action: "approved", booking_id: itemId })
      .then((res) => {
        if (res?.ok) {
          const tempBookingsData = bookingsData.map((bItem) => {
            if (bItem.id != itemId) {
              return bItem;
            } else {
              return { ...bItem, status: "approved" };
            }
          });
          alert(res?.data?.message || "");
          setBookingsData(tempBookingsData);
        } else {
          alert(
            res?.data?.message ||
              JSON.stringify(res?.data?.error || res?.problem) ||
              __("myBookingScreenTexts.unknownError", appSettings.lng)
          );
        }
      })
      .then(() => {
        removeAuthToken();
        setActionOverlay(false);
      });
  };
  const onBookingRejectRequest = (itemId) => {
    Alert.alert("", __("myBookingScreenTexts.rejectWarning", appSettings.lng), [
      { text: __("myBookingScreenTexts.noBtn", appSettings.lng) },
      {
        text: __("myBookingScreenTexts.yesBtn", appSettings.lng),
        onPress: () => onBookingReject(itemId),
      },
    ]);
  };
  const onBookingReject = (itemId) => {
    setActionOverlay(true);
    setAuthToken(auth_token);
    api
      .post("my/user-bookings", { action: "rejected", booking_id: itemId })
      .then((res) => {
        if (res?.ok) {
          const tempBookingsData = bookingsData.map((bItem) => {
            if (bItem.id != itemId) {
              return bItem;
            } else {
              return { ...bItem, status: "rejected" };
            }
          });
          alert(res?.data?.message || "");
          setBookingsData(tempBookingsData);
        } else {
          alert(
            res?.data?.message ||
              JSON.stringify(res?.data?.error || res?.problem) ||
              __("myBookingScreenTexts.unknownError", appSettings.lng)
          );
        }
      })
      .then(() => {
        removeAuthToken();
        setActionOverlay(false);
      });
  };

  const keyExtractor = useCallback((item, index) => `${index}`, []);

  const renderBookings = useCallback(
    ({ item }) => (
      <AllBookingCard
        item={item}
        onCancelRequest={onBookingCancelRequest}
        onDeleteRequest={onBookingDeleteRequest}
        onApproveRequest={onBookingApproveRequest}
        onRejectRequest={onBookingRejectRequest}
        onTitlePress={() => onTitlePress(item)}
      />
    ),
    [bookingsData]
  );
  const EmptyList = () => (
    <View style={styles.emptyListWrap}>
      <View style={styles.emptyMessageWrap}>
        <Text style={styles.text}>
          {__("myBookingScreenTexts.emptyListMessage", appSettings.lng)}
        </Text>
      </View>
      <AppButton
        title={__("myBookingScreenTexts.refreshButton", appSettings.lng)}
        onPress={handleRetry}
        style={{ width: "50%" }}
      />
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

  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };

  const onTitlePress = (item) => {
    navigation.navigate(routes.listingDetailScreen, {
      listingId: item.listing.listing_id,
    });
  };

  return (
    <View style={styles.container}>
      <Modal animationType="slide" transparent={true} visible={actionOverlay}>
        <View style={styles.actionModal}>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <View style={styles.aMOverlay} />
            <View style={{ zIndex: 2 }}>
              <ActivityIndicator color={COLORS.primary} size={"large"} />
            </View>
          </View>
        </View>
      </Modal>
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : (
        <>
          {!!errorMessage ? (
            <View style={styles.errorContainer}>
              <View style={styles.emptyMessageWrap}>
                <Text style={[styles.text, rtlText]}>
                  {decodeString(errorMessage)}
                </Text>
              </View>
              <AppButton
                title={__("myBookingScreenTexts.retryButton", appSettings.lng)}
                onPress={handleRetry}
                style={{ width: "50%" }}
              />
            </View>
          ) : (
            <View style={styles.flatListContainer}>
              <FlatList
                data={bookingsData}
                renderItem={renderBookings}
                keyExtractor={keyExtractor}
                refreshing={refreshing}
                onRefresh={onRefresh}
                ListEmptyComponent={EmptyList}
                contentContainerStyle={styles.listContainer}
                ListFooterComponent={listFooter}
                onEndReached={handleNextPageLoading}
                onEndReachedThreshold={0.2}
              />
            </View>
          )}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  aMOverlay: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: COLORS.border_dark,
    zIndex: 1,
    opacity: 0.5,
  },
  actionModal: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },

  emptyListWrap: {
    paddingHorizontal: "3%",
    marginTop: "30%",
    alignItems: "center",
  },
  emptyMessageWrap: {
    marginBottom: 30,
  },
  errorContainer: {
    paddingHorizontal: "3%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  flatListContainer: {
    flex: 1,
  },
  listContainer: {
    paddingVertical: "3%",
  },
  loadingContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});

export default AllBookingsScreen;
