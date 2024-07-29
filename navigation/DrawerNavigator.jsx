import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import TabNavigator from "./TabNavigator";
import TabNavigatorOld from "./TabNavigatorOld";
import { routes } from "./routes";
import DrawerScreen from "../screens/DrawerScreen";
import { miscConfig } from "../app/services/miscConfig";
import { useStateValue } from "../StateProvider";

const Drawer = createDrawerNavigator();

const DrawerNavigator = (props) => {
  const [{ rtl_support }] = useStateValue();
  return (
    <Drawer.Navigator
      drawerContent={(props) => <DrawerScreen {...props} />}
      screenOptions={{
        drawerStyle: {
          width: "85%",
        },
        drawerPosition: rtl_support ? "right" : "left",
      }}
    >
      <Drawer.Screen
        name={routes.tabNavigator}
        component={miscConfig?.oldBottomTabBar ? TabNavigatorOld : TabNavigator}
        options={{
          header: () => null,
        }}
      />
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
