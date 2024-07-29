import { routes } from "../../../navigation/routes";
const optionsExtraData = {
  my_listings: {
    routeName: routes.myListingsScreen,
    icon: "hdd-o",
    id: "my_listings",
  },
  favourite: {
    routeName: routes.favouriteScreen,
    icon: "star",
    id: "favourite",
  },
  my_membership: {
    routeName: routes.myMembershipScreen,
    icon: "diamond",
    id: "my_membership",
  },
  my_store: {
    routeName: routes.myStoreScreen,
    icon: "store_icon",
    assetUri: require("../../../assets/store_icon.png"),
    id: "my_store",
  },
  all_stores: {
    routeName: routes.allStoresScreen,
    id: "all_stores",
  },

  my_profile: {
    routeName: routes.myProfileScreen,
    icon: "user",
    id: "my_profile",
  },

  payments: {
    routeName: routes.paymentsScreen,
    icon: "money",
    id: "payments",
  },
  my_documents: {
    routeName: routes.documentsScreen,
    id: "my_documents",
  },

  faq: {
    routeName: routes.fAQScreen,
    id: "faq",
  },
  how_to_sell_fast: {
    routeName: routes.howToSellFastScreen,
    id: "how_to_sell_fast",
  },
  about: {
    routeName: routes.aboutAppScreen,
    id: "about",
  },
  pp: {
    routeName: routes.privacyPolicyScreen,
    id: "pp",
  },
  tnc: {
    routeName: routes.tnCScreen,
    id: "tnc",
  },
  contact: {
    routeName: routes.contactUsScreen,
    id: "contact",
  },
  settings: {
    routeName: routes.settingsScreen,
    id: "settings",
  },
  share: {
    routeName: routes.settingsScreen,
    id: "share",
  },
  privacy_safety: {
    routeName: routes.privacynSafetyScreen,
    id: "privacy_safety",
  },
  admin_features: {
    routeName: routes.adminFeaturesScreen,
    id: "admin_features",
  },
  my_bookings: {
    routeName: routes.myBookingsScreen,
    id: "my_bookings",
  },
  all_bookings: {
    routeName: routes.allBookingsScreen,
    id: "all_bookings",
  },
  admin_note: {
    routeName: routes.adminNoteScreen,
    id: "admin_note",
  },
};

export function getOptionsExtraData() {
  return optionsExtraData;
}
