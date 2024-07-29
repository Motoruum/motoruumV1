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
import { COLORS } from "../variables/color";
import { __ } from "../language/stringPicker";
import { useStateValue } from "../StateProvider";
import CalendarPicker from "react-native-calendar-picker";
import moment from "moment";

const CustomDP = ({ onSelectDate, value }) => {
  const [{ appSettings }] = useStateValue();
  const [visible, setVisible] = useState(false);
  const [loading, setloading] = useState(false);
  const [selectedDay, setSelectedDay] = useState(value || null);

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

  const onApply = () => {
    setVisible(false);
    // onSelecDate();
  };

  const onChange = (date) => {
    const formatted = moment(date).format("YYYY-MM-DD");
    setSelectedDay(formatted);
    onSelectDate(formatted);
    setVisible(false);
  };
  return (
    <View style={styles.container}>
      <Pressable
        onPress={togglePicker}
        style={{ width: "100%", alignItems: "center" }}
      >
        <View style={styles.pickerWrap}>
          <Text style={styles.pickerText}>
            {value ||
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
                <CalendarPicker
                  key={setSelectedDay}
                  onDateChange={onChange}
                  showDayStragglers={true}
                  minDate={getToday()}
                  initialDate={value || getToday()}
                  selectedStartDate={selectedDay}
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
  calendarWrap: {},
  modalView: {
    zIndex: 5,
    // flex: 1,
    backgroundColor: COLORS.white,
    // marginHorizontal: 30,
    // marginVertical: 50,
    paddingVertical: 20,
    elevation: 4,
    borderRadius: 10,
  },
  container: { width: "100%" },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});

export default CustomDP;
