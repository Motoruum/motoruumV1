// import {
//   BannerAd,
//   BannerAdSize,
//   TestIds,
// } from "react-native-google-mobile-ads";
import React from "react";
import { admobConfig } from "../app/services/adMobConfig";
import { useStateValue } from "../StateProvider";

const AdmobBanner = (props) => {
  const [{ ios }] = useStateValue();
  const adUnitId =
    // __DEV__
    //   ? TestIds.BANNER
    //   :
    ios ? admobConfig.admobBannerId.iOS : admobConfig.admobBannerId.android;

  return (
    <BannerAd
      unitId={
        adUnitId
        // ios ? admobConfig.admobBannerId.iOS : admobConfig.admobBannerId.android
        // TestIds.BANNER
      }
      size={BannerAdSize.LARGE_BANNER}
      requestOptions={{
        requestNonPersonalizedAdsOnly: true,
      }}
      onAdFailedToLoad={(err) => console.log(JSON.stringify(err))}
    />
  );
};

export default AdmobBanner;
