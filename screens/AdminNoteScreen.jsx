import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useStateValue } from "../StateProvider";
import { COLORS } from "../variables/color";
import { decodeString } from "../helper/helper";

const AdminNoteScreen = (props) => {
  const [{ config, rtl_support }] = useStateValue();

  const rtlText = rtl_support && {
    writingDirection: "rtl",
  };
  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <Text style={[styles.text, rtlText]}>
          {decodeString(config?.admin_note_to_users) || ""}
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    color: COLORS.text_light,
    textAlign: "justify",
  },
  container: {
    flex: 1,
    paddingHorizontal: "3%",
  },
  scrollContainer: {
    paddingVertical: 15,
  },
});

export default AdminNoteScreen;
