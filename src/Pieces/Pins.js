import React from "react";

import Pin from "./Pin";
import Hole from "./Hole";
import Indicator from "./Indicator";
import Button from "./Button";

import { useSprings, animated, useTrail } from "react-spring/three";

const Pieces = {
  "-": "hsl(240, 40%, 5%)",
  A: "hsl(0, 90%,  55%)",
  B: "hsl(60, 90%, 55%)",
  C: "hsl(120, 90%, 55%)",
  D: "hsl(180, 90%, 55%)",
  E: "hsl(240, 90%, 55%)",
  F: "hsl(300, 90%, 55%)"
};

export const DisplayRow = props => {
  const { pins } = props;
  return (
    <group {...props}>
      <Pin
        color={pins[0] === "-" ? "black" : Pieces[pins[0]]}
        position={[-4, 0, 0]}
      />
      <Pin
        color={pins[1] === "-" ? "black" : Pieces[pins[1]]}
        position={[-2, 0, 0]}
      />
      <Pin
        color={pins[2] === "-" ? "black" : Pieces[pins[2]]}
        position={[0, 0, 0]}
      />
      <Pin
        color={pins[3] === "-" ? "black" : Pieces[pins[3]]}
        position={[2, 0, 0]}
      />

      <Hole position={[-4, 0, 0]} />
      <Hole position={[-2, 0, 0]} />
      <Hole />
      <Hole position={[2, 0, 0]} />
    </group>
  );
};

export const start_positions = [
  [-4, -0.25, 0],
  [-2, -0.25, 0],
  [0, -0.25, 0],
  [2, -0.25, 0],
  [4, -0.25, 0],
  [-4, 4, 0],
  [-2, 4, 0],
  [0, 4, 0],
  [2, 4, 0]
];

export const positions = [
  [-4, 0, 0],
  [-2, 0, 0],
  [0, 0, 0],
  [2, 0, 0],
  [4, 0, 0],

  [-4, 0, 0],
  [-2, 0, 0],
  [0, 0, 0],
  [2, 0, 0]
];

export const PinRow = props => {
  const { pins } = props;
  const { guess } = pins;

  const trail = useSprings(
    positions.length,
    positions.map((item, i) => ({
      from: { position: start_positions[i], scale: [0, 0, 0] },
      to: { position: positions[i], scale: [1, 1, 1] },
      delay: i * 50
    }))
  );

  return (
    <group {...props}>
      <animated.group {...trail[5]}>
        <Pin color={Pieces[guess[0]]} />
      </animated.group>
      <animated.group {...trail[6]}>
        <Pin color={Pieces[guess[1]]} />
      </animated.group>
      <animated.group {...trail[7]}>
        <Pin color={Pieces[guess[2]]} />
      </animated.group>
      <animated.group {...trail[8]}>
        <Pin color={Pieces[guess[3]]} />
      </animated.group>

      <animated.group {...trail[0]}>
        <Hole />
      </animated.group>
      <animated.group {...trail[1]}>
        <Hole />
      </animated.group>
      <animated.group {...trail[2]}>
        <Hole />
      </animated.group>
      <animated.group {...trail[3]}>
        <Hole />
      </animated.group>
      <animated.group {...trail[4]}>
        <Indicator pins={pins} />
      </animated.group>
    </group>
  );
};

export const GuessRow = props => {
  const { pins, clickPin, clickGuess } = props;

  return (
    <group {...props}>
      <Pin
        color={Pieces[pins[0]]}
        onClick={() => {
          clickPin(0);
        }}
        position={[-4, 0, 0]}
      />
      <Pin
        color={Pieces[pins[1]]}
        onClick={() => {
          clickPin(1);
        }}
        position={[-2, 0, 0]}
      />
      <Pin
        color={Pieces[pins[2]]}
        onClick={() => {
          clickPin(2);
        }}
        position={[0, 0, 0]}
      />
      <Pin
        color={Pieces[pins[3]]}
        onClick={() => {
          clickPin(3);
        }}
        position={[2, 0, 0]}
      />

      <Hole position={[-4, 0, 0]} />
      <Hole position={[-2, 0, 0]} />
      <Hole />
      <Hole position={[2, 0, 0]} />
      <Button onClick={clickGuess} position={[4, 0, 0]}>
        Guess
      </Button>
    </group>
  );
};
