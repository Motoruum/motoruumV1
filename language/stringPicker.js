const defaultLng = "en";

const lngs = {
  en: require("./en.json"),
  ar: require("./ar.json"),
};

// Do not edit/remove/add anything below this line!!!

import { getOptionsExtraData } from "../app/services/AccountOptions/optionsExtraData";
import { getSellFastImages } from "../app/services/HowToSellFast/images";
import { getMoreRoutes } from "../app/services/More/moreRoutes";
const routes = getMoreRoutes();
const images = getSellFastImages();
const optionsExtraData = getOptionsExtraData();

//  General String
const __ = (keyString, selectedLanguage) => {
  const lng = lngs[selectedLanguage];
  let tmp = null;
  keyString.split(".").map((_item) => {
    tmp = tmp ? tmp[_item] : lng[_item];
  });
  return tmp;
};

// Account Options
const getAccountOptionsData = (selectedLanguage) => {
  let resData = lngs[selectedLanguage]["options_user"];
  resData.map((_dat) => {
    _dat["assetUri"] = optionsExtraData[_dat.id].assetUri;
    _dat["icon"] = optionsExtraData[_dat.id].icon;
    _dat["routeName"] = optionsExtraData[_dat.id].routeName;
  });

  return resData;
};
// Drawer Options
const getDrawerOptionsData = (selectedLanguage) => {
  let resData = lngs[selectedLanguage]["options_drawer"];
  resData.map((_dat) => {
    _dat["routeName"] = optionsExtraData[_dat.id].routeName;
  });
  return resData;
};

// App Description
const getAppDescription = (selectedLanguage) => {
  return lngs[selectedLanguage]["appDescription"];
};

// FAQ
const getFAQ = (selectedLanguage) => {
  return lngs[selectedLanguage]["frequentlyAskedQuestions"];
};

// Sell Faster
const getSellFastTips = (selectedLanguage) => {
  const data = lngs[selectedLanguage]["sellFastTips"];
  const myData = data.map((_obj) => {
    const tempObj = { ..._obj };
    tempObj["uri"] = images[`${_obj.id}`];
    return tempObj;
  });
  return myData;
};

// More Options
const getMoreOptionsData = (selectedLanguage) => {
  let resData = lngs[selectedLanguage]["moreOptions"];
  resData.map((_data) => {
    _data["routeName"] = routes[_data.id];
  });
  return resData;
};

// Privacy Policy
const getPrivacyPolicy = (selectedLanguage) => {
  return lngs[selectedLanguage]["privacyPolicy"];
};

// TnC
const getTnC = (selectedLanguage) => {
  return lngs[selectedLanguage]["termsAndConditions"];
};
// week
const getWeek = (selectedLanguage) => {
  return lngs[selectedLanguage]["weekDayNames"];
};

const getRelativeTimeConfig = (selectedLanguage) => {
  return lngs[selectedLanguage]["relativeTime"];
};

export {
  __,
  defaultLng,
  getAccountOptionsData,
  getAppDescription,
  getFAQ,
  getSellFastTips,
  getMoreOptionsData,
  getPrivacyPolicy,
  getTnC,
  getWeek,
  getRelativeTimeConfig,
  getDrawerOptionsData,
};
