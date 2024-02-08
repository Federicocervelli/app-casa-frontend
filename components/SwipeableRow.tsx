import { Icon } from "@rneui/base";
import React, { Component, PropsWithChildren } from "react";
import { Animated, StyleSheet, I18nManager, View, Text } from "react-native";

import { RectButton } from "react-native-gesture-handler";

import Swipeable from "react-native-gesture-handler/Swipeable";

const AnimatedView = Animated.createAnimatedComponent(View);

interface GmailStyleSwipeableRowProps extends PropsWithChildren<unknown> {
  onSwipe?: (id: string, direction: "left" | "right") => void;
  id: string;
}

export default class GmailStyleSwipeableRow extends Component<GmailStyleSwipeableRowProps> {
  private renderLeftActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [0, 80],
      outputRange: [0, 1],
      extrapolate: "clamp",
    });
    const rotate = scale.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <RectButton style={styles.leftAction}>
        {/* Change it to some icons */}
        <AnimatedView style={[styles.actionIcon, { transform: [{ scale },{rotate}], marginLeft: 20 }]}>
          <Icon name="check" size={40} color="white" />
        </AnimatedView>
      </RectButton>
    );
  };
  private renderRightActions = (
    _progress: Animated.AnimatedInterpolation<number>,
    dragX: Animated.AnimatedInterpolation<number>
  ) => {
    const scale = dragX.interpolate({
      inputRange: [-80, 0],
      outputRange: [1, 0],
      extrapolate: "clamp",
    });
    const rotate = scale.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    return (
      <RectButton style={styles.rightAction}>
        {/* Change it to some icons */}
        <AnimatedView style={[styles.actionIcon, { transform: [{ scale }, {rotate}] }]}>
          <Icon name="close" size={40} color="white" />
        </AnimatedView>
      </RectButton>
    );
  };

  private swipeableRow?: Swipeable;

  private hasSwiped = false;

  private updateRef = (ref: Swipeable) => {
    this.swipeableRow = ref;
  };
  private close = () => {
    this.swipeableRow?.close();
  };

  private handleOpen = (direction: "left" | "right") => {
    if (this.hasSwiped) {return}
    this.hasSwiped = true;
    const { onSwipe, id } = this.props;
    console.log(`open ${direction} for id ${id}`);

    // Notify the parent component about the swipe direction
    onSwipe && onSwipe(id, direction);

    
  };
  render() {
    const { children } = this.props;
    return !this.hasSwiped ? (
      <Swipeable
        ref={this.updateRef}
        friction={3}
        leftThreshold={80}
        enableTrackpadTwoFingerGesture
        rightThreshold={80}
        renderLeftActions={this.renderLeftActions}
        renderRightActions={this.renderRightActions}
        onSwipeableOpen={(direction) => this.handleOpen(direction)}
      >
        {children}
      </Swipeable>
    ) : null;
  }
}

const styles = StyleSheet.create({
  leftAction: {
    flex: 1,
    backgroundColor: "green",
    justifyContent: "flex-end",
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row" : "row-reverse",
  },
  actionIcon: {
    width: 40,
    marginHorizontal: 10,
    height: 40,
  },
  rightAction: {
    alignItems: "center",
    flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    backgroundColor: "#dd2c00",
    flex: 1,
    justifyContent: "flex-end",
  },
});
