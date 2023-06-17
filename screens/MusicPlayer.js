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

import TrackPlayer, {
  Capability,
  Event,
  RepeatMode,
  State,
  usePlaybackState,
  useProgress,
  useTrackPlayerEvents,
} from "react-native-track-player";
import songs from "../model/data";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Slider from "@react-native-community/slider";
const { width, height } = Dimensions.get("window");

const setupPlayer = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
      capabilities: [
        Capability.Play,
        Capability.Pause,
        Capability.SkipToNext,
        Capability.SkipToPrevious,
        Capability.Stop,
      ],
    });
    await TrackPlayer.add(songs);
  } catch (error) {
    console.log(error);
  }
};

const togglePlayBack = async (playBackState) => {
  const currentTrack = await TrackPlayer.getCurrentTrack();
  console.log(currentTrack, playBackState, State.Playing);
  if (currentTrack != null) {
    if (playBackState == State.Paused) {
      await TrackPlayer.play();
    } else {
      await TrackPlayer.pause();
    }
  }
};

const MusicPlayer = () => {
  const playBackState = usePlaybackState();
  const progress = useProgress();
  const [songIndex, setsongIndex] = useState(0);

  const [repeatMode, setRepeatMode] = useState("off");
  const ScrollX = useRef(new Animated.Value(0)).current;
  const songSlider = useRef(null);
  const [trackTitle, setTrackTitle] = useState();
  const [trackArtist, setTrackArtist] = useState();
  const [trackArtwork, setTrackArtwork] = useState();

  //   changing the track on complete
  useTrackPlayerEvents([Event.PlaybackTrackChanged], async (event) => {
    if (event.type === Event.PlaybackTrackChanged && event.nextTrack !== null) {
      const track = await TrackPlayer.getTrack(event.nextTrack);
      const { title, artwork, artist } = track;
      setTrackTitle(title);
      setTrackArtist(artist);
      setTrackArtwork(artwork);
    }
  });

  const repeatIcon = () => {
    if (repeatMode == "off") {
      return "repeat-off";
    }

    if (repeatMode == "track") {
      return "repeat-once";
    }

    if (repeatMode == "repeat") {
      return "repeat";
    }
  };

  const changeRepeatMode = () => {
    if (repeatMode == "off") {
      TrackPlayer.setRepeatMode(RepeatMode.Track);
      setRepeatMode("track");
    }

    if (repeatMode == "track") {
      TrackPlayer.setRepeatMode(RepeatMode.Queue);
      setRepeatMode("repeat");
    }

    if (repeatMode == "repeat") {
      TrackPlayer.setRepeatMode(RepeatMode.Off);
      setRepeatMode("off");
    }
  };

  useEffect(() => {
    setupPlayer();
    ScrollX.addListener(({ value }) => {
      //console.log("ScrollX : ${value} | Device Width : ${width }");
      const index = Math.round(value / width);
      setsongIndex(index);
      //console.log(index);
    });
    return () => {
      ScrollX.removeAllListeners();
      TrackPlayer.destroy();
    };
  }, []);

  const skipToNext = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex + 1) * width,
    });
  };

  const skipToPrevious = () => {
    songSlider.current.scrollToOffset({
      offset: (songIndex - 1) * width,
    });
  };

  const renderSongs = ({ item, index }) => {
    return (
      <Animated.View style={style.mainimagewrapper}>
        <View style={[style.imageWrapper, style.elevation]}>
          <Image
            //   source={item.artwork}
            source={trackArtwork}
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

        {/* Title & Artist Name */}
        <View>
          <Text style={[style.songContent, style.songTitle]}>
            {/* {songs[songIndex].title} */ trackTitle}
          </Text>
          <Text style={[style.songContent, style.songArtist]}>
            {/* {songs[songIndex].artist} */ trackArtist}
          </Text>
        </View>

        {/* Song Content
        <View style={style.songview}>
          <Text style={[style.songcontent, style.songtitle]}>
            {songs[songIndex].title}
          </Text>
          <Text style={[style.songcontent, style.songartist]}>some artist</Text>
        </View> */}

        {/*Slider */}
        <View>
          <Slider
            style={style.progressBar}
            value={progress.position}
            minimumValue={0}
            maximumValue={progress.duration}
            thumbTintColor="#FFD369"
            minimumTrackTintColor="#FFD369"
            maximumTrackTintColor="#fff"
            onSlidingComplete={async (value) => {
              await TrackPlayer.seekTo(value);
            }}
          />

          {/*music progress duration */}

          {/* Progress Durations */}
          <View style={style.progressLevelDuraiton}>
            <Text style={style.progressLabelText}>
              {new Date(progress.position * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
            <Text style={style.progressLabelText}>
              {new Date((progress.duration - progress.position) * 1000)
                .toLocaleTimeString()
                .substring(3)}
            </Text>
          </View>
        </View>

        {/* mymusic controls */}
        <View style={style.musiccontrolscontainer}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="play-skip-back-outline" size={35} color="#FFD369" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => togglePlayBack(playBackState)}>
            <Ionicons
              name={
                playBackState === State.Playing
                  ? "ios-pause-circle"
                  : "ios-play-circle"
              }
              size={75}
              color="#FFD369"
            />
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

      {/* bottom section */}
      <View style={style.bottomSection}>
        <View style={style.bottomIconContainer}>
          <TouchableOpacity onPress={() => {}}>
            <Ionicons name="heart-outline" size={30} color="#888888" />
          </TouchableOpacity>

          <TouchableOpacity onPress={changeRepeatMode}>
            <MaterialCommunityIcons
              name={`${repeatIcon()}`}
              size={30}
              color={repeatMode !== "off" ? "#FFD369" : "#888888"}
            />
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
