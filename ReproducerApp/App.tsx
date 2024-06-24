import React, {useRef, useState} from 'react';
import {View, PanResponder, StyleSheet, Animated, Text} from 'react-native';

const DraggableBoxExample: React.FC = () => {
  const [panPositionAnim] = useState(new Animated.ValueXY());
  const [isDragging, setIsDragging] = useState(false);

  const panResponderRef = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        panPositionAnim.setOffset({
          x: (panPositionAnim.x as any)._value,
          y: (panPositionAnim.y as any)._value,
        });
        panPositionAnim.setValue({x: 0, y: 0});
        setIsDragging(true);
      },
      onPanResponderMove: Animated.event(
        [null, {dx: panPositionAnim.x, dy: panPositionAnim.y}],
        {
          useNativeDriver: false,
        },
      ),
      onPanResponderRelease: () => {
        panPositionAnim.flattenOffset();
        Animated.spring(panPositionAnim, {
          toValue: {x: 0, y: (panPositionAnim.y as any)._value},
          useNativeDriver: false,
        }).start();
        setIsDragging(false);
      },
    }),
  );

  return (
    <View style={styles.container}>
      <Animated.View
        {...panResponderRef.current.panHandlers}
        style={[
          styles.box,
          panPositionAnim.getLayout(),
          isDragging ? styles.drag : null,
        ]}>
        {!isDragging && <Text style={styles.text}>{'DRAG ME'}</Text>}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 128,
  },
  box: {
    width: 80,
    height: 50,
    borderBottomRightRadius: 50,
    borderTopEndRadius: 50,
    backgroundColor: 'red',
  },
  drag: {
    borderRadius: 50,
    width: 50,
    height: 50,
  },
  text: {
    flex: 1,
    lineHeight: 50,
    textAlign: 'center',
  },
});

export default DraggableBoxExample;
