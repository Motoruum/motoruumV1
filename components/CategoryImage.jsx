import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { SvgUri } from "react-native-svg";

const CategoryImage = ({ uri, size }) => {
  if (uri.split(".").pop() === "svg") {
    return (
      <View
        style={{
          height: size,
          width: size,
          overflow: "hidden",
        }}
      >
        <SvgUri
          width="100%"
          height="100%"
          uri={
            uri ||
            "https://dev.w3.org/SVG/tools/svgweb/samples/svg-files/ruby.svg"
          }
        />
      </View>
    );
  } else
    return (
      <View
        style={{
          height: size,
          width: size,
          overflow: "hidden",
        }}
      >
        <Image
          source={{ uri: uri }}
          style={{ height: size, width: size, resizeMode: "contain" }}
        />
      </View>
    );
};

const styles = StyleSheet.create({
  container: {},
});

export default CategoryImage;
