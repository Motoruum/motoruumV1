import React from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";

// Vector Icons
import {
  AntDesign,
  Entypo,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";

// Custom Components & Constants
import { COLORS } from "../variables/color";
import { useStateValue } from "../StateProvider";

const ListingHeader = ({
  onAction,
  onBack,
  onFavorite,
  title,
  style,
  author,
  is_favourite,
  favoriteDisabled,
  favLoading,
  sharable,
  reportable,
  loading,
  actionsDisabled,
}) => {
  const [{ user, rtl_support }] = useStateValue();
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

  return (
    <View style={[styles.container, styles.flexRow, style]}>
      {!loading && !actionsDisabled && rtl_support && (
        <View style={styles.flexRow}>
          {(reportable || sharable) && !loading && (
            <TouchableOpacity
              onPress={onAction}
              style={{
                paddingRight: 10,
              }}
            >
              <Entypo
                name="dots-three-vertical"
                size={20}
                color={COLORS.white}
              />
            </TouchableOpacity>
          )}
          {user !== null && user.id !== author && !!author && (
            <View>
              <TouchableOpacity
                onPress={onFavorite}
                disabled={favoriteDisabled}
              >
                {favLoading ? (
                  <View style={{ width: 23.5, alignItems: "center" }}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <FontAwesome
                    name={is_favourite ? "star" : "star-o"}
                    size={20}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
      <View
        style={[
          styles.flexRow,
          {
            justifyContent: "flex-start",
            flex: 1,
          },
          rtlView,
        ]}
      >
        <TouchableOpacity onPress={onBack}>
          <AntDesign
            name={rtl_support ? "arrowright" : "arrowleft"}
            size={24}
            color={COLORS.white}
          />
        </TouchableOpacity>
        <Text
          style={[
            styles.headerTitle,
            {
              paddingLeft: rtl_support ? 0 : "3%",
              paddingRight: rtl_support ? "3%" : 0,
            },
            rtlTextA,
          ]}
        >
          {title}
        </Text>
      </View>
      {!loading && !actionsDisabled && !rtl_support && (
        <View style={styles.flexRow}>
          {user !== null && user.id !== author && !!author && (
            <View>
              <TouchableOpacity
                onPress={onFavorite}
                disabled={favoriteDisabled}
              >
                {favLoading ? (
                  <View style={{ width: 23.5, alignItems: "center" }}>
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <FontAwesome
                    name={is_favourite ? "star" : "star-o"}
                    size={20}
                    color={COLORS.white}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
          {(reportable || sharable) && !loading && (
            <TouchableOpacity
              onPress={onAction}
              style={{
                paddingLeft: 10,
              }}
            >
              <Entypo
                name="dots-three-vertical"
                size={20}
                color={COLORS.white}
              />
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: "space-between",
    paddingHorizontal: "3%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 1,
    height: 50,
    backgroundColor: COLORS.primary,
  },
  flexRow: {
    alignItems: "center",
    flexDirection: "row",
  },
  headerTitle: {
    color: COLORS.white,
    fontWeight: "bold",
    fontSize: 20,
  },
  shareButton: {
    width: 30,
  },
});

export default ListingHeader;
