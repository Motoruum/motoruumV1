import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { COLORS } from "../variables/color";
import { useStateValue } from "../StateProvider";
import { Entypo, FontAwesome5, AntDesign } from "@expo/vector-icons";
import { __ } from "../language/stringPicker";

const CustomTicketPicker = ({ value, range, title, onSelect }) => {
  const [{ rtl_support, appSettings }] = useStateValue();
  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    let tempRange = 1;
    let tempArr = [];
    while (range >= tempRange) {
      tempArr.push(tempRange);
      tempRange = tempRange + 1;
    }
    setData(tempArr);
    setLoading(false);
  }, []);

  const onToggle = () => {
    setVisible((prevVisible) => !prevVisible);
  };
  const onClose = () => {
    setVisible(false);
  };

  const onDataPress = (_dat) => {
    setVisible(false);
    onSelect(_dat);
  };

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
    <View style={{ flex: 1 }}>
      <Pressable style={[styles.container, rtlView]} onPress={onToggle}>
        <Text style={{ paddingHorizontal: 15 }}>{value || 0}</Text>
        <Entypo name="chevron-small-down" size={20} color="black" />
      </Pressable>
      <Modal animationType="slide" transparent={true} visible={visible}>
        <View style={styles.centeredView}>
          <TouchableWithoutFeedback onPress={onClose}>
            <View style={styles.overLay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalView}>
            <Pressable style={styles.btn} onPress={onClose}>
              <FontAwesome5
                name="times-circle"
                size={20}
                color={COLORS.button.active}
              />
            </Pressable>
            <View style={styles.titleWrap}>
              <Text style={styles.title}>{title || ""}</Text>
            </View>
            {loading ? (
              <View style={styles.view}>
                <ActivityIndicator size={"large"} color={COLORS.primary} />
              </View>
            ) : (
              <View style={styles.scrollWrap}>
                <ScrollView
                  style={{ marginBottom: 15 }}
                  showsVerticalScrollIndicator={false}
                >
                  {data.map((_dat) => (
                    <Pressable
                      style={styles.dataWrap}
                      key={`${_dat}`}
                      onPress={() => onDataPress(_dat)}
                    >
                      <Text
                        style={{
                          fontSize: 16,
                          color:
                            _dat == value ? COLORS.primary : COLORS.text_light,
                        }}
                      >
                        {_dat}
                      </Text>
                      {_dat == value && (
                        <View style={{ position: "absolute", right: "30%" }}>
                          <AntDesign
                            name="check"
                            size={20}
                            color={COLORS.primary}
                          />
                        </View>
                      )}
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dataWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
    justifyContent: "center",
  },
  titleWrap: {
    marginBottom: 15,
  },
  scrollWrap: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    color: COLORS.text_gray,
    textAlign: "center",
  },
  container: {
    borderWidth: 1,
    borderColor: COLORS.border_light,
    paddingVertical: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
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
    position: "absolute",
    right: 10,
    top: 10,
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
  calendarWrap: { flex: 1 },
  modalView: {
    zIndex: 5,
    backgroundColor: COLORS.white,
    marginHorizontal: 30,
    marginVertical: 50,
    elevation: 4,
    borderRadius: 10,
    paddingTop: 30,
    height: "50%",
  },
  centeredView: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
  },
});

export default CustomTicketPicker;
