import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
  Dimensions,
  Image,
  FlatList,
  Animated,
} from "react-native";
import songs from "../model/data";
import Ionicons from "react-native-vector-icons/Ionicons";
import Slider from "@react-native-community/slider";
const { width, height } = Dimensions.get("window");

const MusicPlayer = () => {
  const [songIndex, setsongIndex] = useState(0);
  const ScrollX = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    ScrollX.addListener(({ value }) => {
      //console.log("ScrollX : ${value} | Device Width : ${width }");
      const index = Math.round(value / width);
      setsongIndex(index);
      //console.log(index);
    });
  }, []);

  const renderSongs = ({ item, index }) => {
    return (
      <Animated.View style={style.mainimagewrapper}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image
            //   source={item.artwork}
            source={item.artwork}
            style={style.MusicImg}
          />
        </View>
      </Animated.View>
    );
  };
  const handleScroll = Animated.event(
    [{ nativeEvent: { contentOffset: { x: ScrollX } } }],
    { useNativeDriver: true }
  );

  return (
    <SafeAreaView style={style.container}>
      <View style={style.maincontainer}>
        {/*  image */}
        <Animated.FlatList
          renderItem={renderSongs}
          data={songs}
          keyExtractor={(item) => item.id}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          scrollEventThrottle={16}
          //onScroll={handleScroll}

          onScroll={Animated.event(
            [
              {
                nativeEvent: {
                  contentOffset: { x: ScrollX },
                },
              },
            ],
            { useNativeDriver: true }
          )}
        />
        {/**pick */}

        {/*Song Content*/}
        <View style={style.songview}>
          <Text style={[style.songcontent, style.songtitle]}>
            {songs[songIndex].title}
          </Text>
          <Text style={[style.songcontent, style.songartist]}>some artist</Text>
        </View>

        {/*Slider */}
        <View>
          <Slider
            style={style.progressBar}
            value={10}
            minimumValue={0}
            maximumValue={100}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={() => {}}
          />

          {/*music progress duration */}

          <View style={style.progresslevelduration}>
            <Text style={style.progresslabeltext}>00:00</Text>
            <Text style={style.progresslabeltext}>00:00</Text>
          </View>
        </View>

        {/* mymusic controls */}
        <View style={style.musiccontrolscontainer}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="ios-pause-circle" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity>
            <ion-icon name="caret-forward-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons
              name="play-skip-forward-outline"
              size={35}
              color="#FFD369"
            />
          </TouchableOpacity>
        </View>
      </View>

      {/*icons are going here*/}
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
  mainimagewrapper: {
    width: width,
    justifyContent: "center",
    alignItems: "center",
  },
  imageWrapper: {
    width: 300,
    height: 340,
    marginBottom: 20,
    marginTop: 20,
  },
  MusicImg: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  elevation: {
    elevation: 5,

    shadowColor: "#ccc",
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.5,
    shadowRadius: 3.84,
  },
  songcontent: {
    textAlign: "center",
    color: "#EEEEEE",
  },
  songtitle: {
    fontSize: 18,
    fontWeight: "600",
  },
  songartist: {
    fontSize: 16,
    fontWeight: "300",
  },
  /*Custom made not in project*/
  songview: {
    marginBottom: "10px",
  },
  progressBar: {
    width: 350,
    height: 40,
    marginTop: 25,
    flexDirection: "row",
  },
  progresslevelduration: {
    width: 340,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  progresslabeltext: {
    color: "#fff",
    fontWeight: "500",
  },
  musiccontrolscontainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 15,
    width: "60%",
  },
});
