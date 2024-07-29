import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableWithoutFeedback,
  Pressable,
  ActivityIndicator,
} from "react-native";
import Calendar from "./customDateRangePicker/src/index";
import AppButton from "./AppButton";
import { COLORS } from "../variables/color";
import { __ } from "../language/stringPicker";
import { useStateValue } from "../StateProvider";

const CustomDateRangePicker = ({ onSelectRange, value }) => {
  const [{ appSettings }] = useStateValue();
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(true);
  const [updated, setUpdated] = useState(false);
  const [range, setRange] = useState("");
  const [rangeObject, setRangeObject] = useState({
    startDate: null,
    endDate: null,
  });

  useEffect(() => {
    if (updated) {
      return;
    }
    if (value) {
      setRange(value);
      const tempVals = value.split(" - ");
      const tempObj = {
        startDate: tempVals[0],
        endDate: tempVals[1],
      };
      setRangeObject(tempObj);
    } else {
      const today = getToday();
      setRange(today + " - " + today);
      setRangeObject({
        startDate: today,
        endDate: today,
      });
      onSelectRange(today + " - " + today);
    }
    setUpdated(true);
    setTimeout(() => {
      setloading(false);
    }, 2000);
  });

  const getToday = (date) => {
    var d = new Date(),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [year, month, day].join("-");
  };

  const togglePicker = () => {
    setVisible((prevVisible) => !prevVisible);
  };
  const onClose = () => {
    setVisible(false);
  };
  const onRange = ({ startDate, endDate }) => {
    setRange(
      endDate ? startDate + " - " + endDate : startDate + " - " + endDate
    );
    setRangeObject({ startDate: startDate, endDate: endDate });
  };
  const onApply = () => {
    setVisible(false);
    onSelectRange(range);
  };
  return (
    <View style={styles.container}>
      <Pressable onPress={togglePicker}>
        <View style={styles.pickerWrap}>
          <Text style={styles.pickerText}>
            {value
              ? value
              : range ||
                __("listingFormTexts.dateRangePickerButton", appSettings.lng)}
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
              <Pressable style={styles.btn} onPress={onApply}>
                <Text style={styles.btnTitle}>
                  {__("listingFormTexts.dateRangeApplyButton", appSettings.lng)}
                </Text>
              </Pressable>
            </View>
            {loading ? (
              <View style={styles.loading}>
                <ActivityIndicator size={"large"} color={COLORS.primary} />
              </View>
            ) : (
              <View style={styles.calendarWrap}>
                <Calendar
                  startDate={rangeObject.startDate}
                  endDate={rangeObject.endDate}
                  onChange={onRange}
                  disabledBeforeToday
                />
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  pickerText: {
    color: COLORS.text_gray,
  },
  pickerWrap: {
    borderWidth: 1,
    borderColor: COLORS.border_light,
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 3,
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
  calendarWrap: { flex: 1 },
  modalView: {
    zIndex: 5,
    flex: 1,
    backgroundColor: COLORS.white,
    marginHorizontal: 30,
    marginVertical: 50,
    elevation: 4,
    borderRadius: 10,
  },
  container: { flex: 1 },
  centeredView: {
    flex: 1,
    width: "100%",
  },
});

export default CustomDateRangePicker;
