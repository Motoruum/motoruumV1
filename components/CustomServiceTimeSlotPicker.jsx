import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
} from "react-native";
import { COLORS } from "../variables/color";
import { __ } from "../language/stringPicker";
import { useStateValue } from "../StateProvider";
import { decodeString } from "../helper/helper";

const CustomServiceTimeSlotPicker = ({ onSelectTimeSlot, value, data }) => {
  const [{ appSettings }] = useStateValue();
  const [visible, setVisible] = useState(false);

  const togglePicker = () => {
    setVisible((prevVisible) => !prevVisible);
  };

  const onClose = () => {
    setVisible(false);
  };

  const onApply = () => {
    setVisible(false);
  };

  const onSelectSlot = (slot) => {
    onSelectTimeSlot(slot);
  };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={togglePicker}
        style={{ width: "100%", alignItems: "center" }}
      >
        <View style={styles.pickerWrap}>
          <Text style={styles.pickerText}>
            {value
              ? value
              : __(
                  "listingDetailScreenTexts.select_time_slot",
                  appSettings.lng
                ) || ""}
          </Text>
        </View>
      </Pressable>

      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback>
            <View style={styles.overLay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <View style={styles.btnRow}>
              <Pressable style={styles.btn} onPress={onClose}>
                <Text style={styles.btnTitle}>
                  {__("listingFormTexts.dateRangeCloseButton", appSettings.lng)}
                </Text>
              </Pressable>
              <Pressable
                style={[
                  styles.btn,
                  {
                    backgroundColor: !!value
                      ? COLORS.button.active
                      : COLORS.button.disabled,
                  },
                ]}
                onPress={onApply}
                disabled={!value}
              >
                <Text style={styles.btnTitle}>
                  {__("listingFormTexts.dateRangeApplyButton", appSettings.lng)}
                </Text>
              </Pressable>
            </View>
            <View style={{ alignItems: "center" }}>
              {data.map((_slot, index) => (
                <View style={{ alignItems: "center" }} key={`${index}`}>
                  <Pressable
                    onPress={() => onSelectSlot(_slot)}
                    style={{
                      alignItems: "center",
                      marginVertical: 10,
                      borderColor:
                        !!value && value == _slot
                          ? COLORS.primary_soft
                          : COLORS.border_light,
                      borderRadius: 4,
                      paddingHorizontal: 20,
                      paddingVertical: 8,
                      borderWidth: 1,
                    }}
                  >
                    <Text style={styles.text}>{decodeString(_slot)}</Text>
                  </Pressable>
                  <View style={styles.view}></View>
                </View>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerText: {
    color: COLORS.text_gray,
    textAlign: "center",
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: COLORS.border_light,
    paddingHorizontal: 25,
    paddingVertical: 9,
    borderRadius: 3,
    width: "100%",
  },
  loading: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  btnTitle: {
    color: COLORS.white,
    fontWeight: "bold",
  },
  btn: {
    paddingHorizontal: 15,
    paddingVertical: 7,
    borderRadius: 6,
    backgroundColor: COLORS.button.active,
  },
  overLay: {
    zIndex: 4,
    position: "absolute",
    height: "100%",
    width: "100%",
    backgroundColor: COLORS.gray,
    opacity: 0.5,
    left: 0,
    top: 0,
  },
  btnRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginVertical: 10,
  },
  modalView: {
    zIndex: 5,
    backgroundColor: COLORS.white,
    paddingVertical: 20,
    elevation: 4,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  container: { width: "100%" },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});

export default CustomServiceTimeSlotPicker;
