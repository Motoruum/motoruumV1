// import { AccessToken, LoginManager } from "react-native-fbsdk-next";
// import {
//   GoogleSignin,
//   statusCodes,
// } from "@react-native-google-signin/google-signin";
import React, { useState, useEffect } from "react";
import {
  Keyboard,
  StyleSheet,
  Text,
  View,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  ActivityIndicator,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Dimensions,
  Image,
} from "react-native";

import * as AppleAuthentication from "expo-apple-authentication";

import { FontAwesome } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";

// External Libraries
import { Formik } from "formik";
import * as Yup from "yup";

// Custom Components & Functions
import AppButton from "../components/AppButton";
import AppTextButton from "../components/AppTextButton";
import { useStateValue } from "../StateProvider";
import api, { setAuthToken } from "../api/client";
import { COLORS } from "../variables/color";
import authStorage from "../app/auth/authStorage";
import FlashNotification from "../components/FlashNotification";
import { __ } from "../language/stringPicker";
import { socialConfig } from "../app/services/socialLoginConfig";
import { routes } from "../navigation/routes";
import ScatteredBg from "../components/svgComponents/ScatteredBg";
import BuildingBg from "../components/svgComponents/BuildingBg";
import UserIcon from "../components/svgComponents/UserIcon";
import LockIcon from "../components/svgComponents/LockIcon";
import EyeSlashIcon from "../components/svgComponents/EyeSlashIcon";
import { miscConfig } from "../app/services/miscConfig";
import settingsStorage from "../app/settings/settingsStorage";

const { width: screenWidth } = Dimensions.get("window");
const LoginScreen = ({ navigation }) => {
  const [{ ios, appSettings, rtl_support, push_token, config }, dispatch] =
    useStateValue();
  const [validationSchema, setValidationSchema] = useState(
    Yup.object().shape({
      username: Yup.string()
        .required(
          __("loginScreenTexts.formFieldsLabel.username", appSettings.lng) +
            " " +
            __("loginScreenTexts.formValidation.requiredField", appSettings.lng)
        )
        .min(
          3,
          __("loginScreenTexts.formFieldsLabel.username", appSettings.lng) +
            " " +
            __(
              "loginScreenTexts.formValidation.minimumLength3",
              appSettings.lng
            )
        ),
      password: Yup.string()
        .required(
          __("loginScreenTexts.formFieldsLabel.password", appSettings.lng) +
            " " +
            __("loginScreenTexts.formValidation.requiredField", appSettings.lng)
        )
        .min(
          3,
          __("loginScreenTexts.formFieldsLabel.password", appSettings.lng) +
            " " +
            __(
              "loginScreenTexts.formValidation.minimumLength3",
              appSettings.lng
            )
        ),
    })
  );
  const [responseErrorMessage, setResponseErrorMessage] = useState();
  const [loading, setLoading] = useState(false);
  const [passVisible, setPassVisible] = useState(false);
  const [flashNotification, setFlashNotification] = useState(false);
  const [flashNotificationMessage, setFlashNotificationMessage] = useState();
  const [socialOverlayActive, setSocialOverlayActive] = useState(false);
  const [socialErrorMessage, setSocialErrorMessage] = useState();
  const [activeSocialType, setActiveSocialType] = useState();

  useEffect(() => {
    if (
      socialConfig?.enabled &&
      socialConfig?.socialPlatforms?.includes("google")
    ) {
      initGoogle();
    }
  }, []);
  const initGoogle = () => {
    GoogleSignin.configure({
      scopes: ["PROFILE", "EMAIL"], // what API you want to access on behalf of the user, default is email and profile
      webClientId: socialConfig.google.webClientId, // client ID of type WEB for your server (needed to verify user ID and offline access)
      offlineAccess: true, // if you want to access Google API on behalf of the user FROM YOUR SERVER
      hostedDomain: "", // specifies a hosted domain restriction
    });
  };

  const signInAsyncGFB = async () => {
    setSocialErrorMessage();
    setActiveSocialType("google_firebase");
    setSocialOverlayActive(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      handleSocialLoginRequest(userInfo?.idToken || "", "google_firebase");
    } catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
        // user cancelled the login flow
      } else if (error.code === statusCodes.IN_PROGRESS) {
        // operation (e.g. sign in) is in progress already
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        // play services not available or outdated
      } else {
        // some other error happened
      }
    }
  };
  const handleLogin = (values) => {
    setResponseErrorMessage();
    setLoading(true);
    Keyboard.dismiss();
    api
      .post("login", {
        username: values.username,
        password: values.password,
      })
      .then((res) => {
        if (res.ok) {
          dispatch({
            type: "SET_AUTH_DATA",
            data: {
              user: res.data.user,
              auth_token: res.data.jwt_token,
            },
          });
          authStorage.storeUser(JSON.stringify(res.data));

          handlePushRegister(res.data.jwt_token);

          handleSuccess(
            __("loginScreenTexts.loginSuccessMessage", appSettings.lng)
          );
        } else {
          setResponseErrorMessage(
            res?.data?.message ||
              res?.data?.error_message ||
              res?.data?.error ||
              res?.problem ||
              __("loginScreenTexts.customResponseError", appSettings.lng)
          );
          setLoading(false);
        }
      });
  };

  const handlePushRegister = (a_token) => {
    if (miscConfig?.enablePushNotification) {
      setAuthToken(a_token);
      // let nCon = [];
      let nCon = ["listing_approved", "listing_expired", "chat"];
      // if (appSettings?.notifications?.length && config?.pn_events?.length) {
      //   appSettings.notifications.map((_item) => {
      //     if (config.pn_events.includes(_item)) {
      //       nCon.push(_item);
      //     }
      //   });
      // } else {
      //   nCon = ["listing_approved", "listing_expired", "chat"];
      // }
      const tempAppSetting = {
        ...appSettings,
        notifications: [...nCon],
      };
      dispatch({
        type: "SET_SETTINGS",
        appSettings: tempAppSetting,
      });
      settingsStorage.storeAppSettings(JSON.stringify(tempAppSetting));

      api
        .post("push-notification/add-device", {
          push_token: push_token,
          events: nCon,
        })
        .then((res) => {
          if (!res?.ok) {
            // alert("Failed to register device for push notification");
            console.log(
              __("alerts.notificationRegistrationFail", appSettings.lng),
              res.data
            );
          }
        });
    }
    return;
  };
  const handleSuccess = (message) => {
    setFlashNotificationMessage(message);
    setTimeout(() => {
      setFlashNotification(true);
    }, 10);
    setTimeout(() => {
      setFlashNotification(false);
      if (loading) {
        setLoading(false);
      }
      if (socialOverlayActive) {
        setSocialOverlayActive(false);
      }
      setFlashNotificationMessage();
      navigation.goBack();
    }, 1000);
  };
  const handleError = (message) => {
    setFlashNotificationMessage(message);
    setTimeout(() => {
      setFlashNotification(true);
    }, 10);
    setTimeout(() => {
      setFlashNotification(false);
      setFlashNotificationMessage();

      if (socialOverlayActive) {
        setSocialOverlayActive(false);
      }
    }, 1000);
  };

  const handleAppleLoginPress = async () => {
    setSocialErrorMessage();
    setActiveSocialType("apple");
    setSocialOverlayActive(true);

    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      // signed in
      if (credential?.identityToken && credential?.user) {
        api
          .post("social-login", {
            access_token: credential.identityToken,
            type: "apple",
            apple_user: credential.user,
          })
          .then((res) => {
            if (res.ok) {
              dispatch({
                type: "SET_AUTH_DATA",
                data: {
                  user: res.data.user,
                  auth_token: res.data.jwt_token,
                },
              });
              authStorage.storeUser(JSON.stringify(res.data));
              handlePushRegister(res.data.jwt_token);
              handleSuccess(
                __("loginScreenTexts.loginSuccessMessage", appSettings.lng)
              );
            } else {
              setSocialErrorMessage(
                res?.data?.error_message ||
                  res?.data?.error ||
                  res?.problem ||
                  __("loginScreenTexts.customResponseError", appSettings.lng)
              );
              handleError(
                res?.data?.error_message ||
                  res?.data?.error ||
                  res?.problem ||
                  __("loginScreenTexts.customResponseError", appSettings.lng)
              );
            }
          })
          .then(() => setActiveSocialType());
      } else {
        setSocialOverlayActive(false);
        return true;
      }
    } catch (e) {
      if (e.code === "ERR_CANCELED") {
        // handle that the user canceled the sign-in flow
      } else {
        // handle other errors
        setSocialErrorMessage(
          e.code || __("loginScreenTexts.customResponseError", appSettings.lng)
        );
        handleError(
          e.code || __("loginScreenTexts.customResponseError", appSettings.lng)
        );
      }
    }
  };

  const handleFacebookLoginPress = () => {
    setSocialErrorMessage();
    setActiveSocialType("facebook");
    setSocialOverlayActive(true);
    loginWithFBReadPermissionAsync();
  };

  const loginWithFBReadPermissionAsync = async () => {
    try {
      const result = await LoginManager.logInWithPermissions([
        "public_profile",
        "email",
      ]);

      if (result?.isCancelled) {
        setActiveSocialType();
        setSocialOverlayActive(false);
      } else {
        const { accessToken } = await AccessToken.getCurrentAccessToken();
        handleSocialLoginRequest(accessToken, "facebook");
      }
    } catch ({ message }) {
      alert(`Facebook Login Error: ${message}`);
    }
  };

  const handleSocialLoginRequest = (access_token, type) => {
    if (!access_token || !type) {
      setSocialOverlayActive(false);
      return true;
    }
    api
      .post("social-login", {
        access_token: access_token,
        type: type,
      })
      .then((res) => {
        if (res.ok) {
          dispatch({
            type: "SET_AUTH_DATA",
            data: {
              user: res.data.user,
              auth_token: res.data.jwt_token,
            },
          });
          authStorage.storeUser(JSON.stringify(res.data));
          handlePushRegister(res.data.jwt_token);
          handleSuccess(
            __("loginScreenTexts.loginSuccessMessage", appSettings.lng)
          );
          if (type === "google_firebase") {
            const tempAppSetting = {
              ...appSettings,
              google_login: true,
            };
            dispatch({
              type: "SET_SETTINGS",
              appSettings: tempAppSetting,
            });
            settingsStorage.storeAppSettings(JSON.stringify(tempAppSetting));
          }
          if (type === "facebook") {
            const tempAppSetting = {
              ...appSettings,
              facebook_login: true,
            };
            dispatch({
              type: "SET_SETTINGS",
              appSettings: tempAppSetting,
            });
            settingsStorage.storeAppSettings(JSON.stringify(tempAppSetting));
          }
          setActiveSocialType();
        } else {
          setSocialErrorMessage(
            res?.data?.message ||
              res?.data?.error_message ||
              res?.data?.error ||
              res?.problem ||
              __("loginScreenTexts.customResponseError", appSettings.lng)
          );
          handleError(
            res?.data?.message ||
              res?.data?.error_message ||
              res?.data?.error ||
              res?.problem ||
              __("loginScreenTexts.customResponseError", appSettings.lng)
          );
          setActiveSocialType();
        }
      });
  };

  const handleSocialLoginCancel = () => {
    setActiveSocialType();
    setSocialOverlayActive(false);
  };

  const rtlText = rtl_support && {
    writingDirection: "rtl",
    textAlign: "right",
  };

  const rtlView = rtl_support && {
    flexDirection: "row-reverse",
  };

  const onSignUpClick = () => {
    config?.verification
      ? navigation.navigate(routes.oTPScreen, { source: "signup" })
      : navigation.navigate(routes.signUpScreen);
  };
  return (
    <KeyboardAvoidingView
      behavior={ios ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: "#f8f8f8" }}
      // keyboardVerticalOffset={ios ? 80 : 0}
    >
      <TouchableOpacity
        style={{ position: "absolute", padding: screenWidth * 0.03, zIndex: 5 }}
        onPress={() => navigation.goBack()}
      >
        <AntDesign name="arrowleft" size={20} color={COLORS.primary} />
      </TouchableOpacity>
      <View
        style={{
          alignItems: "center",
          zIndex: 1,
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }}
      >
        <ScatteredBg fillColor="red" />
      </View>
      <ScrollView style={{ zIndex: 2 }}>
        <View style={[styles.container]}>
          <View
            style={{
              width: screenWidth,
              height: screenWidth * 0.25,
              alignItems: "center",
              justifyContent: "center",
              marginVertical: screenWidth * 0.05,
            }}
          >
            <Image
              source={require("../assets/auth_logo_new.png")}
              style={{
                width: screenWidth * 0.75,
                height: screenWidth * 1,
                resizeMode: "contain",
              }}
            />
          </View>
          <View
            style={{
              marginBottom: 30,
            }}
          >
            <Text
              style={{
                fontSize: 20,
                fontWeight: "bold",
                color: COLORS.text_dark,
              }}
            >
              {__("loginScreenTexts.loginTitle", appSettings.lng)}
            </Text>
          </View>
          <View
            style={[
              styles.loginForm,
              { marginBottom: socialConfig?.enabled ? 20 : 40 },
            ]}
          >
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={handleLogin}
              validationSchema={validationSchema}
            >
              {({
                handleChange,
                handleSubmit,
                values,
                errors,
                setFieldTouched,
                touched,
              }) => (
                <View style={{ width: "100%" }}>
                  <View style={[styles.inputWrap, rtlView]}>
                    <View style={styles.iconWrap}>
                      <UserIcon fillColor={COLORS.primary} />
                    </View>
                    <TextInput
                      style={[styles.input, rtlText]}
                      onChangeText={handleChange("username")}
                      onBlur={() => setFieldTouched("username")}
                      value={values.username}
                      placeholder={__(
                        "loginScreenTexts.formFieldsPlaceholder.username",
                        appSettings.lng
                      )}
                      autoCorrect={false}
                      onFocus={() => setFieldTouched("username")}
                      autoCapitalize="none"
                    />
                  </View>
                  <View style={styles.errorFieldWrap}>
                    {touched.username && errors.username && (
                      <Text style={[styles.errorMessage, rtlText]}>
                        {errors.username}
                      </Text>
                    )}
                  </View>
                  <View style={[styles.inputWrap, rtlView]}>
                    <View style={styles.iconWrap}>
                      <LockIcon fillColor={COLORS.primary} />
                    </View>
                    <TextInput
                      style={[styles.input, rtlText]}
                      onChangeText={handleChange("password")}
                      onBlur={() => setFieldTouched("password")}
                      value={values.password}
                      placeholder={__(
                        "loginScreenTexts.formFieldsPlaceholder.password",
                        appSettings.lng
                      )}
                      type="password"
                      autoCorrect={false}
                      autoCapitalize="none"
                      onFocus={() => setFieldTouched("password")}
                      secureTextEntry={!passVisible}
                    />
                    <TouchableWithoutFeedback
                      onPress={() =>
                        setPassVisible((prevPassVisible) => !prevPassVisible)
                      }
                    >
                      <View
                        style={{
                          width: 35,
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <EyeSlashIcon
                          fillColor={
                            passVisible
                              ? COLORS.primary_soft
                              : COLORS.text_light
                          }
                        />
                      </View>
                    </TouchableWithoutFeedback>
                  </View>
                  <View style={styles.errorFieldWrap}>
                    {touched.password && errors.password && (
                      <Text style={[styles.errorMessage, rtlText]}>
                        {errors.password}
                      </Text>
                    )}
                  </View>
                  <AppTextButton
                    title={__(
                      "loginScreenTexts.forgotPassword",
                      appSettings.lng
                    )}
                    style={{
                      alignItems: "flex-end",
                      paddingHorizontal: "3%",
                      paddingBottom: 10,
                    }}
                    textStyle={{ color: COLORS.text_gray, fontSize: 13 }}
                    onPress={() => navigation.navigate(routes.forgotPassScreen)}
                  />
                  <View style={styles.loginBtnWrap}>
                    <AppButton
                      onPress={handleSubmit}
                      title={__(
                        "loginScreenTexts.loginButtonTitle",
                        appSettings.lng
                      )}
                      style={styles.loginBtn}
                      textStyle={styles.loginBtnTxt}
                      disabled={
                        !!errors?.username ||
                        !!errors?.password ||
                        !touched?.username ||
                        socialOverlayActive
                      }
                      loading={loading}
                    />
                  </View>
                    {responseErrorMessage && (
                      <View style={styles.responseErrorWrap}>
                        <Text style={styles.responseErrorMessage}>
                          {responseErrorMessage.replace(/^:|[?]$/g, "")}
                        </Text>
                      </View>
                    )}
                </View>
              )}
            </Formik>
          </View>
          {socialConfig?.enabled && (
            <View style={styles.socialLoginWrap}>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 20,
                }}
              >
                <View
                  style={{
                    height: 1,
                    width: screenWidth * 0.2,
                    backgroundColor: COLORS.border_light,
                  }}
                />
                <View style={{ paddingHorizontal: 10 }}>
                  <Text
                    style={[
                      { fontWeight: "bold", color: COLORS.text_dark },
                      rtlText,
                    ]}
                  >
                    {__("loginScreenTexts.socialLoginText", appSettings.lng)}
                  </Text>
                </View>
                <View
                  style={{
                    height: 1,
                    width: screenWidth * 0.2,
                    backgroundColor: COLORS.border_light,
                  }}
                />
              </View>
              <View
                style={{
                  width: "100%",
                  alignItems: "center",
                  justifyContent: "center",
                  flexDirection: "row",
                  flexWrap: "wrap",
                }}
              >
                {socialConfig?.socialPlatforms.includes("facebook") && (
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: "#1877F2",
                        marginBottom: 10,
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 3,
                        flexDirection: "row",
                        justifyContent: "center",
                        width: "48%",
                        marginRight: rtl_support ? 0 : "2%",
                        marginLeft: rtl_support ? "2%" : 0,
                      },
                      rtlView,
                    ]}
                    onPress={handleFacebookLoginPress}
                    disabled={socialOverlayActive || loading}
                  >
                    <View
                      style={
                        rtl_support ? { marginLeft: 10 } : { marginRight: 10 }
                      }
                    >
                      <FontAwesome
                        name="facebook"
                        size={18}
                        color={COLORS.white}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.white,
                        fontWeight: "bold",
                      }}
                    >
                      {__(
                        "loginScreenTexts.socialButtonTitle.facebook",
                        appSettings.lng
                      )}
                    </Text>
                  </TouchableOpacity>
                )}

                {socialConfig?.socialPlatforms?.includes("google") && (
                  <TouchableOpacity
                    style={[
                      {
                        backgroundColor: COLORS.white,
                        marginBottom: 10,
                        padding: 10,
                        alignItems: "center",
                        borderRadius: 3,
                        flexDirection: "row",
                        justifyContent: "center",
                        width: "48%",
                        marginLeft: rtl_support ? 0 : "2%",
                        marginRight: rtl_support ? "2%" : 0,
                        elevation: 1,
                        shadowColor: COLORS.gray,
                        shadowOpacity: 0.2,
                        shadowRadius: 1,
                        shadowOffset: {
                          height: 1,
                          width: 1,
                        },
                      },
                      rtlView,
                    ]}
                    onPress={signInAsyncGFB}
                    disabled={socialOverlayActive || loading}
                  >
                    <View
                      style={[
                        {
                          height: 18,
                          width: 18,
                          alignItems: "center",
                          justifyContent: "center",
                        },
                        rtl_support ? { marginLeft: 10 } : { marginRight: 10 },
                      ]}
                    >
                      <Image
                        source={require("../assets/google_logo.png")}
                        style={{
                          height: 18,
                          width: 18,
                          resizeMode: "contain",
                        }}
                      />
                    </View>
                    <Text
                      style={{
                        fontSize: 16,
                        color: COLORS.text_gray,
                        fontWeight: "bold",
                      }}
                    >
                      {__(
                        "loginScreenTexts.socialButtonTitle.google",
                        appSettings.lng
                      )}
                    </Text>
                  </TouchableOpacity>
                )}
                {ios && (
                  <AppleAuthentication.AppleAuthenticationButton
                    buttonType={
                      AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN
                    }
                    buttonStyle={
                      AppleAuthentication.AppleAuthenticationButtonStyle.BLACK
                    }
                    cornerRadius={3}
                    style={{ width: "100%", height: 40, marginBottom: 10 }}
                    onPress={handleAppleLoginPress}
                  />
                )}
              </View>
              {!!socialErrorMessage && (
                <View style={styles.responseErrorWrap}>
                  <Text style={styles.responseErrorMessage}>
                    {socialErrorMessage}
                  </Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>
      <View
        style={[
          {
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "row",
            paddingBottom: 10,
            zIndex: 2,
          },
          rtlView,
        ]}
      >
        <Text style={{ fontSize: 13, color: COLORS.text_light }}>
          {__("loginScreenTexts.signUpPrompt", appSettings.lng)}
        </Text>
        <AppTextButton
          title={__("loginScreenTexts.signUpButtonTitle", appSettings.lng)}
          onPress={onSignUpClick}
          textStyle={{ fontSize: 13, fontWeight: "bold" }}
          style={{ paddingHorizontal: 5 }}
        />
      </View>
      <View
        style={{ zIndex: 1, position: "absolute", width: "100%", bottom: 0 }}
      >
        <BuildingBg />
      </View>
      <FlashNotification
        falshShow={flashNotification}
        flashMessage={flashNotificationMessage}
      />
      {socialOverlayActive && (
        <View style={styles.socialOverlayWrap}>
          <View
            style={{
              backgroundColor: "#000",
              opacity: 0.2,
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 5,
            }}
          />
          <View
            style={{
              paddingVertical: 40,
              backgroundColor: COLORS.white,
              width: "60%",
              alignItems: "center",
              borderRadius: 10,
              zIndex: 6,
            }}
          >
            <Text style={{ marginBottom: 20 }}>
              {__("loginScreenTexts.pleaseWaitText", appSettings.lng)}
            </Text>
            <ActivityIndicator size="large" color="black" />
            <AppTextButton
              title={__("loginScreenTexts.cancelButtonTitle", appSettings.lng)}
              onPress={handleSocialLoginCancel}
              style={{ marginTop: 20 }}
            />
          </View>
        </View>
      )}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  cancelResetBtn: {
    color: "gray",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  container: {
    alignItems: "center",
  },
  errorFieldWrap: {
    height: 15,
    justifyContent: "center",
    paddingHorizontal: "3%",
  },
  errorMessage: {
    fontSize: 12,
    color: COLORS.red,
  },
  iconWrap: {
    width: 35,
    alignItems: "center",
    justifyContent: "center",
  },
  input: {
    height: 38,
    justifyContent: "center",
    paddingHorizontal: 10,
    flex: 1,
  },
  inputWrap: {
    marginHorizontal: "3%",

    flexDirection: "row",
    alignItems: "center",
    backgroundColor: COLORS.white,
    borderRadius: 3,
    elevation: 1,
    shadowColor: COLORS.gray,
    shadowOpacity: 0.1,
    shadowRadius: 2,
    shadowOffset: { height: 0, width: 0 },
  },
  loginBtn: {
    height: 40,
    borderRadius: 3,
    marginVertical: 10,
  },
  loginBtnWrap: {
    width: "100%",
    paddingHorizontal: "3%",
  },
  loginForm: {
    width: "100%",
  },
  loginNotice: {
    fontSize: 16,
    color: "#111",
    marginVertical: 20,
  },
  modalEmail: {
    backgroundColor: COLORS.border_light,
    width: "95%",
    marginVertical: 10,
    height: 38,
    justifyContent: "center",
    borderRadius: 3,
    paddingHorizontal: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 3,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    width: "90%",
  },
  resetLink: {
    height: 40,
    borderRadius: 3,
    marginVertical: 10,
    width: "60%",
  },
  responseErrorMessage: {
    color: COLORS.red,
    fontWeight: "bold",
    fontSize: 15,
  },
  responseErrorWrap: {
    marginVertical: 10,
    alignItems: "center",
    marginHorizontal: "3%",
  },
  signUpPrompt: {},
  socialLogin: {
    marginHorizontal: 15,
  },
  socialLoginWrap: {
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: "3%",
  },
  socialOverlayWrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 5,
  },
});

export default LoginScreen;
