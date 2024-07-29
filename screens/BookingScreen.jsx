import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  TextInput,
  Alert,
  Modal,
} from "react-native";
import { useStateValue } from "../StateProvider";
import api, { removeAuthToken, setAuthToken } from "../api/client";
import { COLORS } from "../variables/color";
import AppButton from "../components/AppButton";
import { __ } from "../language/stringPicker";
import { Formik } from "formik";
import * as Yup from "yup";
import { getPrice } from "../helper/helper";

const BookingScreen = ({ navigation, route }) => {
  const [{ auth_token, appSettings, rtl_support, user, config }, dispatch] =
    useStateValue();
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState(false);
  const [bookingError, setBookingError] = useState("");
  const [bookingData, setBookingData] = useState(route.params || {});
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({
      name: Yup.string().required(
        __("bookingScreenTexts.nameTitle", appSettings.lng) +
          " " +
          __("signUpScreenTexts.formValidation.requiredField", appSettings.lng)
      ),
      phone: Yup.string()
        .required(
          __("signUpScreenTexts.formFieldLabels.phone", appSettings.lng) +
            " " +
            __(
              "signUpScreenTexts.formValidation.requiredField",
              appSettings.lng
            )
        )
        .min(
          5,
          __("signUpScreenTexts.formFieldLabels.phone", appSettings.lng) +
            " " +
            __(
              "signUpScreenTexts.formValidation.minimumLength5",
              appSettings.lng
            )
        ),
      email: Yup.string()
        .required(
          __("signUpScreenTexts.formFieldLabels.email", appSettings.lng) +
            " " +
            __(
              "signUpScreenTexts.formValidation.requiredField",
              appSettings.lng
            )
        )
        .email(
          __("signUpScreenTexts.formValidation.validEmail", appSettings.lng)
        ),
    })
  );

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

  useEffect(() => {
    checkAvailability();
  }, []);

  const checkAvailability = () => {
    const tempArgs = {
      listing_id: bookingData.listing_id,
    };
    if (bookingData._rtcl_listing_booking === "event") {
      tempArgs["no_of_ticket"] = bookingData.no_of_ticket;
    }
    if (bookingData._rtcl_listing_booking === "pre_order") {
      tempArgs["no_of_ticket"] = bookingData.no_of_item;
    }
    if (bookingData._rtcl_listing_booking === "services") {
      tempArgs["booking_date"] = bookingData.booking_date;
      tempArgs["time_slot"] = bookingData.time_slot;
      tempArgs["no_of_ticket"] = bookingData.guest_number;
    }
    setAuthToken(auth_token);
    api
      .get(`/booking/availability/${bookingData.listing_id}`, { ...tempArgs })
      .then((res) => {
        if (res.ok) {
          if (res?.data?.error === true && res?.data?.message) {
            setMessage(res.data.message);
          }
        } else {
          setError(
            res?.data?.error_message || res?.data?.error || res?.problem
          );
        }
      })
      .finally(() => {
        removeAuthToken();
        setLoading(false);
      });
  };

  const onRetry = () => {
    setLoading(true);
    setError(false);
    checkAvailability();
  };
  const onBack = () => {
    navigation.goBack();
  };
  const handleBookingRequest = (values) => {
    setBookingLoading(true);
    setBookingError("");
    const tempApiParams = {
      ...values,
      fee: `${bookingData._rtcl_booking_fee}`,
      listing_id: bookingData.listing_id,
    };
    if (route.params._rtcl_listing_booking === "event") {
      tempApiParams["ticket_no"] =
        route?.params?.no_of_ticket ||
        route.params._rtcl_booking_fee / route.params.fee_single ||
        1;
    }
    if (route.params._rtcl_listing_booking === "rent") {
      tempApiParams["booking_date"] = route?.params?.booking_date;
      tempApiParams["ticket_no"] =
        route?.params?.rent_days ||
        route.params._rtcl_booking_fee / route.params.fee_single ||
        1;
    }
    if (route.params._rtcl_listing_booking === "pre_order") {
      tempApiParams["ticket_no"] =
        route?.params?.no_of_item ||
        route.params._rtcl_booking_fee / route.params.fee_single ||
        1;
    }
    if (route.params._rtcl_listing_booking === "services") {
      tempApiParams["booking_date"] =
        bookingData?.booking_date || route.params.booking_date;
      tempApiParams["time_slot"] =
        bookingData?.time_slot || route.params.time_slot;
      tempApiParams["ticket_no"] =
        bookingData?.guest_number ||
        route.params.guest_number ||
        route.params._rtcl_booking_fee / route.params.fee_single ||
        1;
    }
    setAuthToken(auth_token);
    api
      .post("booking/create", { ...tempApiParams })
      .then((res) => {
        if (res?.ok) {
          handleBookingSuccess(res.data);
        } else {
          setBookingError(
            res?.data?.error_message || res?.data?.error || res?.problem
          );
        }
      })
      .finally(() => {
        removeAuthToken();
        setBookingLoading(false);
      });
  };

  const handleBookingSuccess = (data) => {
    Alert.alert(
      __("bookingScreenTexts.successTitle", appSettings.lng),
      data.message[0] ||
        data.message ||
        __("bookingScreenTexts.bookingRequestSuccess", appSettings.lng),
      [
        {
          text: __("bookingScreenTexts.goBack", appSettings.lng),
          onPress: () => navigation.goBack(),
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {loading ? (
        <View style={styles.loading}>
          <ActivityIndicator size={"large"} color={COLORS.primary} />
        </View>
      ) : (
        <View style={styles.contentContainer}>
          {!!message || !!error ? (
            <View style={{ flex: 1 }}>
              <View style={styles.bookingInfoContainer}>
                <View style={styles.bookingDataRow}>
                  <View style={styles.bDTitleWrap}>
                    <Text style={styles.bDTitle}>
                      {__("bookingScreenTexts.fee", appSettings.lng)}
                    </Text>
                  </View>
                  <View style={styles.bDValWrap}>
                    <Text style={styles.bDVal}>
                      {bookingData?.fee_single ||
                        route?.params?.fee_single ||
                        0}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingDataRow}>
                  <View style={styles.bDTitleWrap}>
                    <Text style={styles.bDTitle}>
                      {__("bookingScreenTexts.noOfGuest", appSettings.lng)}
                    </Text>
                  </View>
                  <View style={styles.bDValWrap}>
                    <Text style={styles.bDVal}>
                      {bookingData?.no_of_ticket ||
                        route?.params?.no_of_ticket ||
                        0}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingDataRow}>
                  <View style={styles.bDTitleWrap}>
                    <Text style={styles.bDTitle}>
                      {__("bookingScreenTexts.totalFee", appSettings.lng)}
                    </Text>
                  </View>
                  <View style={styles.bDValWrap}>
                    <Text style={styles.bDVal}>
                      {bookingData?._rtcl_booking_fee ||
                        route?.params?._rtcl_booking_fee ||
                        0}
                    </Text>
                  </View>
                </View>
              </View>

              <View style={styles.msgErrContainer}>
                {!!error && (
                  <View style={styles.errorContainer}>
                    <View style={styles.errorWrap}>
                      <Text style={styles.error}>{error || ""}</Text>
                    </View>
                    <View style={styles.btnContainer}>
                      <AppButton
                        title={__(
                          "bookingScreenTexts.retryBtn",
                          appSettings.lng
                        )}
                        onPress={onRetry}
                      />
                    </View>
                    <View style={styles.btnContainer}>
                      <AppButton
                        title={__(
                          "bookingScreenTexts.goBackBtn",
                          appSettings.lng
                        )}
                        onPress={onBack}
                      />
                    </View>
                  </View>
                )}
                {!!message && (
                  <View style={styles.messageContainer}>
                    <View style={styles.messageWrap}>
                      <Text style={styles.message}>{message || ""}</Text>
                    </View>
                    <View style={styles.btnContainer}>
                      <AppButton
                        title={__(
                          "bookingScreenTexts.goBackBtn",
                          appSettings.lng
                        )}
                        onPress={onBack}
                      />
                    </View>
                  </View>
                )}
              </View>
            </View>
          ) : (
            <ScrollView style={styles.scrollContainer}>
              <View style={styles.bookingInfoContainer}>
                <View style={styles.bookingDataRow}>
                  <View style={styles.bDTitleWrap}>
                    <Text style={styles.bDTitle}>
                      {["rent", "event", "services"].includes(
                        route?.params?._rtcl_listing_booking
                      ) && __("bookingScreenTexts.fee", appSettings.lng)}
                      {route?.params?._rtcl_listing_booking === "pre_order" &&
                        __("bookingScreenTexts.preOrderfee", appSettings.lng)}
                    </Text>
                  </View>
                  <View style={styles.bDValWrap}>
                    <Text style={styles.bDVal}>
                      {getPrice(
                        config.payment_currency,
                        {
                          pricing_type: "price",
                          price_type: "",
                          price:
                            bookingData?.fee_single ||
                            route?.params?.fee_single ||
                            0,
                          max_price: 0,
                        },
                        appSettings.lng
                      )}
                    </Text>
                  </View>
                </View>
                <View style={styles.bookingDataRow}>
                  <View style={styles.bDTitleWrap}>
                    <Text style={styles.bDTitle}>
                      {route.params._rtcl_listing_booking === "event" &&
                        __("bookingScreenTexts.noOfGuest", appSettings.lng)}
                      {route.params._rtcl_listing_booking === "services" &&
                        __("bookingScreenTexts.noOfGuest", appSettings.lng)}
                      {route.params._rtcl_listing_booking === "rent" &&
                        __("bookingScreenTexts.noOfGuest", appSettings.lng)}
                      {route.params._rtcl_listing_booking === "pre_order" &&
                        __("bookingScreenTexts.noOfItem", appSettings.lng)}
                    </Text>
                  </View>
                  <View style={styles.bDValWrap}>
                    {route.params._rtcl_listing_booking === "event" && (
                      <Text style={styles.bDVal}>
                        {bookingData?.no_of_ticket ||
                          route?.params?.no_of_ticket ||
                          1}
                      </Text>
                    )}
                    {route.params._rtcl_listing_booking === "pre_order" && (
                      <Text style={styles.bDVal}>
                        {bookingData?.no_of_item ||
                          route?.params?.no_of_item ||
                          route?.params?._rtcl_booking_fee /
                            route?.params?.fee_single ||
                          1}
                      </Text>
                    )}
                    {route.params._rtcl_listing_booking === "rent" && (
                      <Text style={styles.bDVal}>
                        {bookingData?.guest_number ||
                          route?.params?.guest_number ||
                          1}
                      </Text>
                    )}
                    {route.params._rtcl_listing_booking === "services" && (
                      <Text style={styles.bDVal}>
                        {bookingData?.guest_number ||
                          route?.params?.guest_number ||
                          1}
                      </Text>
                    )}
                  </View>
                </View>
                {route?.params?._rtcl_listing_booking === "rent" && (
                  <>
                    <View style={styles.bookingDataRow}>
                      <View style={styles.bDTitleWrap}>
                        <Text style={styles.bDTitle}>
                          {__(
                            "bookingScreenTexts.rentDateRange",
                            appSettings.lng
                          )}
                        </Text>
                      </View>
                      <View style={styles.bDValWrap}>
                        <Text style={styles.bDVal}>
                          {bookingData?.booking_date ||
                            route?.params?.booking_date}
                        </Text>
                      </View>
                    </View>
                    <View style={styles.bookingDataRow}>
                      <View style={styles.bDTitleWrap}>
                        <Text style={styles.bDTitle}>
                          {__(
                            "bookingScreenTexts.rentDuration",
                            appSettings.lng
                          )}
                        </Text>
                      </View>
                      <View style={styles.bDValWrap}>
                        <Text style={styles.bDVal}>
                          {bookingData?.rent_days ||
                            route?.params?.rent_days ||
                            1}
                        </Text>
                      </View>
                    </View>
                  </>
                )}
                <View style={styles.bookingDataRow}>
                  <View style={styles.bDTitleWrap}>
                    <Text style={styles.bDTitle}>
                      {["rent", "event", "services"].includes(
                        route?.params?._rtcl_listing_booking
                      ) && __("bookingScreenTexts.totalFee", appSettings.lng)}
                      {route.params._rtcl_listing_booking === "pre_order" &&
                        __(
                          "bookingScreenTexts.totalPreOrderFee",
                          appSettings.lng
                        )}
                    </Text>
                  </View>
                  <View style={styles.bDValWrap}>
                    <Text style={styles.bDVal}>
                      {getPrice(
                        config.payment_currency,
                        {
                          pricing_type: "price",
                          price_type: "",
                          price:
                            bookingData?._rtcl_booking_fee ||
                            route?.params?._rtcl_booking_fee ||
                            0,
                          max_price: 0,
                        },
                        appSettings.lng
                      )}
                    </Text>
                  </View>
                </View>
              </View>
              <View style={styles.contentWrap}>
                <Formik
                  initialValues={{
                    name: user.first_name
                      ? user.first_name + " " + user.last_name
                      : "",
                    phone: user?.phone ? user.phone : "",
                    email: user?.email ? user.email : "",
                    message: "",
                  }}
                  validationSchema={validationSchema}
                  onSubmit={handleBookingRequest}
                >
                  {({
                    handleChange,
                    handleSubmit,
                    values,
                    errors,
                    setFieldTouched,
                    touched,
                  }) => (
                    <View>
                      <View style={[styles.inputWrap, rtlView]}>
                        <View style={styles.iconWrap}>
                          <Text style={styles.fieldTitle}>
                            {__(
                              "bookingScreenTexts.nameTitle",
                              appSettings.lng
                            )}
                          </Text>
                        </View>
                        <TextInput
                          placeholderTextColor={COLORS.text_light}
                          style={[styles.inputCommon, rtlText]}
                          onChangeText={handleChange("name")}
                          onBlur={() => setFieldTouched("name")}
                          value={values.name}
                          placeholder={__(
                            "signUpScreenTexts.formFieldLabels.name",
                            appSettings.lng
                          )}
                        />
                      </View>
                      <View style={styles.errorWrap}>
                        {touched.name && errors.name && (
                          <Text style={[styles.errorMessage, rtlText]}>
                            {errors.name}
                          </Text>
                        )}
                      </View>
                      <View style={[styles.inputWrap, rtlView]}>
                        <View style={styles.iconWrap}>
                          <Text style={styles.fieldTitle}>
                            {__(
                              "bookingScreenTexts.emailTitle",
                              appSettings.lng
                            )}
                          </Text>
                        </View>
                        <TextInput
                          placeholderTextColor={COLORS.text_light}
                          style={[styles.inputCommon, rtlText]}
                          onChangeText={handleChange("email")}
                          onBlur={() => setFieldTouched("email")}
                          value={values.email}
                          placeholder={__(
                            "signUpScreenTexts.formFieldLabels.email",
                            appSettings.lng
                          )}
                          keyboardType="email-address"
                        />
                      </View>
                      <View style={styles.errorWrap}>
                        {touched.email && errors.email && (
                          <Text style={[styles.errorMessage, rtlText]}>
                            {errors.email}
                          </Text>
                        )}
                      </View>
                      <View style={[styles.inputWrap, rtlView]}>
                        <View style={styles.iconWrap}>
                          <Text style={styles.fieldTitle}>
                            {__(
                              "bookingScreenTexts.phoneTitle",
                              appSettings.lng
                            )}
                          </Text>
                        </View>
                        <TextInput
                          placeholderTextColor={COLORS.text_light}
                          style={[
                            styles.inputCommon,
                            styles.phoneImput,
                            rtlText,
                          ]}
                          onChangeText={handleChange("phone")}
                          onBlur={() => setFieldTouched("phone")}
                          value={values.phone}
                          placeholder={__(
                            "signUpScreenTexts.formFieldLabels.phone",
                            appSettings.lng
                          )}
                          keyboardType="phone-pad"
                        />
                      </View>
                      <View style={styles.errorWrap}>
                        {touched.phone && errors.phone && (
                          <Text style={[styles.errorMessage, rtlText]}>
                            {errors.phone}
                          </Text>
                        )}
                      </View>
                      <View style={[styles.inputWrap, rtlView]}>
                        <View style={styles.iconWrap}>
                          <Text style={styles.fieldTitle}>
                            {__(
                              "bookingScreenTexts.messageTitle",
                              appSettings.lng
                            )}
                          </Text>
                        </View>
                        <TextInput
                          placeholderTextColor={COLORS.text_light}
                          style={[
                            styles.inputCommon,
                            {
                              paddingHorizontal: 10,
                              flex: 1,
                              minHeight: 80,
                              textAlignVertical: "top",
                              paddingVertical: 10,
                            },
                            rtlText,
                          ]}
                          onChangeText={handleChange("message")}
                          onBlur={() => setFieldTouched("message")}
                          value={values.message}
                          placeholder={__(
                            "signUpScreenTexts.formFieldLabels.message",
                            appSettings.lng
                          )}
                          autoCapitalize="none"
                          multiline
                        />
                      </View>
                      <View style={styles.errorWrap}>
                        {touched.message && errors.message && (
                          <Text style={[styles.errorMessage, rtlText]}>
                            {errors.message}
                          </Text>
                        )}
                      </View>
                      <AppButton
                        onPress={handleSubmit}
                        title={__(
                          "bookingScreenTexts.confirmBtn",
                          appSettings.lng
                        )}
                        style={styles.signUpBtn}
                        textStyle={styles.signUpBtnTxt}
                        // disabled={
                        //   Object.keys(errors).length > 0 ||
                        //   Object.keys(touched).length === 0
                        // }
                        disabled={loading || bookingLoading}
                        loading={loading}
                      />
                      {!!bookingError && (
                        <View style={styles.bookingErrWrap}>
                          <Text style={styles.bookingErr}>
                            {bookingError || ""}
                          </Text>
                        </View>
                      )}
                    </View>
                  )}
                </Formik>
              </View>
            </ScrollView>
          )}
        </View>
      )}
      {bookingLoading && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={bookingLoading}
        >
          <View style={styles.actionModal}>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <View style={styles.aMOverlay} />
              <View style={{ zIndex: 2 }}>
                <ActivityIndicator color={COLORS.primary} size={"large"} />
              </View>
            </View>
          </View>
        </Modal>
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
  bookingErr: {
    fontSize: 15,
    color: COLORS.red,
    textAlign: "center",
  },
  bookingErrWrap: {
    paddingVertical: 15,
    textAlign: "center",
    alignItems: "center",
  },
  errorMessage: {
    lineHeight: 13,
    fontSize: 12,
    color: COLORS.red,
  },
  errorWrap: {
    minHeight: 15,
  },
  inputCommon: {
    borderWidth: 1,
    borderColor: COLORS.border_light,
    borderRadius: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginBottom: 5,
  },
  fieldTitle: {
    fontWeight: "bold",
    color: COLORS.text_gray,
    marginBottom: 5,
  },
  error: {
    fontSize: 18,
    color: COLORS.red,
  },
  message: {
    fontSize: 18,
    color: COLORS.text_light,
  },
  bDVal: {
    fontSize: 15,
    color: COLORS.text_gray,
  },
  bDTitle: {
    fontSize: 15,
    color: COLORS.text_gray,
  },
  bookingDataRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  bookingInfoContainer: {
    paddingVertical: 10,
  },
  errorContainer: {
    alignItems: "center",
  },
  messageContainer: {
    alignItems: "center",
  },
  btnContainer: {
    // paddingHorizontal: "20%",
    marginVertical: 15,
  },
  msgErrContainer: { flex: 1, justifyContent: "center" },
  contentContainer: { flex: 1, justifyContent: "center" },
  loading: {
    flex: 2,
    justifyContent: "center",
  },
  container: { flex: 1, paddingHorizontal: "3%", zIndex: 1 },
});

export default BookingScreen;
