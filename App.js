import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";

const { width, height } = Dimensions.get("window");

const MusicPlayer = () => {
  return (
    <SafeAreaView style={style.container}>
      <View style={style.maincontainer}>{/* FOR OTHER CONTENTS */}</View>

      <View style={style.bottomcontainer}>
        <View style={style.bottomIconWrapper}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="repeat" size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="share-outline" size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ellipsis-horizontal" size={30} color="#888888" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default MusicPlayer;

const style = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#555",
    alignItems: "center",
    justifyContent: "center",
  },
  maincontainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomcontainer: {
    width: width,
    alignItems: "center",
    paddingVertical: 15,
    borderTopColor: "#393e46",
    borderWidth: 1,
  },
  bottomIconWrapper: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "80%",
  },
});
