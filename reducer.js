import { Platform } from "react-native";
import { listViewConfig } from "./app/services/listViewConfig";
import { defaultLng } from "./language/stringPicker";

export const initialState = {
  ios: Platform.OS === "ios",
  push_token: null,
  appSettings: {
    lng: defaultLng || "en",
    notifications: ["listing_approved", "listing_expired", "chat"],
    listView:
      listViewConfig?.defaultListViewStyle === true ? true : false || false,
    promotionList:
      listViewConfig?.defaultListViewStyle === true ? true : false || false,
    dynamic_currency: null,
    google_login: false,
    facebook_login: false,
  },
  auth_token: null,
  user: null,
  newListingScreen: false,
  search_categories: [],
  featured_search_categories: [],
  top_search_categories: [],
  featured_search_locations: [],
  top_search_locations: [],
  search_locations: [],
  listing_locations: null,
  cat_name: "",
  type_name: "",
  featured_cat_name: "",
  top_cat_name: "",
  button_hidden: false,
  chat_badge: null,
  is_connected: true,
  rtl_support: false,
  deleted_id: null,
  config: {
    currency: {
      id: "USD",
      symbol: "&#36;",
      position: "left", // position: "left" or "right"
      separator: {
        decimal: ".",
        thousand: ",",
      },
    },
    payment_currency: {
      id: "USD",
      position: "right",
      separator: {
        decimal: ".",
        thousand: ",",
      },
      symbol: "&#36;",
    },
    promotions: {
      _bump_up: "Bump Up",
      _top: "Top",
      featured: "Featured",
    },
    location_type: "local", // location_type: "local" or "geo"
    mark_as_sold: false, // mark_as_sold: boolian
    radius_search: {
      max_distance: 1000,
      units: "miles",
    },
    store_enabled: false,
    store: {
      time_options: {
        showMeridian: true,
      },
    },
    week_days: [
      {
        id: 1,
        name: "Monday",
      },
      {
        id: 2,
        name: "Tuesday",
      },
      {
        id: 3,
        name: "Wednesday",
      },
      {
        id: 4,
        name: "Thursday",
      },
      {
        id: 5,
        name: "Friday",
      },
      {
        id: 6,
        name: "Saturday",
      },
      {
        id: 0,
        name: "Sunday",
      },
    ],
    registered_only: {
      listing_contact: false,
      store_contact: false,
    },
    pn_events: [
      "listing_approved",
      "listing_expired",
      "chat",
      "listing_created",
      "order_created",
    ],
    redirect_new_listing: "home",
    timezone: {
      timezone_type: 1,
      timezone: "+06:00",
    },
    tz: {
      timezone_type: 1,
      timezone: "+06:00",
    },
  },
};

const reducer = (state, action) => {
  switch (action.type) {
    case "SET_AUTH_DATA":
      let new_state = state;
      if (
        action.data.user !== undefined &&
        action.data.auth_token !== undefined
      ) {
        new_state = {
          ...state,
          user: action.data.user,
          auth_token: action.data.auth_token,
        };
      } else if (action.data.user === undefined && action.data.auth_token) {
        new_state = {
          ...state,
          auth_token: action.data.auth_token,
        };
      } else if (action.data.user && action.data.auth_token === undefined) {
        new_state = {
          ...state,
          user: action.data.user,
        };
      }
      return new_state;
    case "SET_LANGUAGE_CHANGES":
      return {
        ...state,
        appSettings: action.appSettings,
        search_locations: [],
        featured_search_locations: [],
        top_search_locations: [],
        search_categories: [],
        featured_search_categories: [],
        top_search_categories: [],
        cat_name: "",
        type_name: "",
        featured_cat_name: "",
        top_cat_name: "",
      };
    case "SET_NEW_LISTING_SCREEN":
      return {
        ...state,
        newListingScreen: action.newListingScreen,
      };

    case "SET_SEARCH_LOCATIONS":
      return {
        ...state,
        search_locations: action.search_locations,
      };

    case "SET_FEATURED_SEARCH_LOCATIONS":
      return {
        ...state,
        featured_search_locations: action.featured_search_locations,
      };
    case "SET_TOP_SEARCH_LOCATIONS":
      return {
        ...state,
        top_search_locations: action.top_search_locations,
      };

    case "SET_SEARCH_CATEGORIES":
      return {
        ...state,
        search_categories: action.search_categories,
      };

    case "SET_FEATURED_SEARCH_CATEGORIES":
      return {
        ...state,
        featured_search_categories: action.featured_search_categories,
      };
    case "SET_TOP_SEARCH_CATEGORIES":
      return {
        ...state,
        top_search_categories: action.top_search_categories,
      };
    case "SET_LISTING_LOCATIONS":
      return {
        ...state,
        listing_locations: action.listing_locations,
      };

    case "SET_CAT_NAME":
      return {
        ...state,
        cat_name: action.cat_name,
      };

    case "SET_TYPE_NAME":
      return {
        ...state,
        type_name: action.type_name,
      };
    case "SET_FEATURED_CAT_NAME":
      return {
        ...state,
        featured_cat_name: action.featured_cat_name,
      };
    case "SET_TOP_CAT_NAME":
      return {
        ...state,
        top_cat_name: action.top_cat_name,
      };
    case "SET_SETTINGS":
      return {
        ...state,
        appSettings: action.appSettings,
      };

    case "SET_BUTTON_HIDDEN":
      return {
        ...state,
        button_hidden: action.button_hidden,
      };

    case "SET_CHAT_BADGE":
      return {
        ...state,
        chat_badge: action.chat_badge,
      };

    case "SET_CONFIG":
      return {
        ...state,
        config: action.config,
      };

    case "IS_CONNECTED":
      return {
        ...state,
        is_connected: action.is_connected,
      };
    case "SET_RTL_SUPPORT":
      return {
        ...state,
        rtl_support: action.rtl_support,
      };
    case "SET_PUSH_TOKEN":
      return {
        ...state,
        push_token: action.push_token,
      };
    case "SET_DELETED_ID":
      return {
        ...state,
        deleted_id: action.deleted_id,
      };

    default:
      return state;
  }
};

export default reducer;
