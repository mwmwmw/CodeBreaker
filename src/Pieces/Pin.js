/*
auto-generated by: https://github.com/react-spring/gltfjsx
*/

import * as THREE from "three";
import React, { useEffect, useRef, useState } from "react";
import { useLoader, useFrame } from "react-three-fiber";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { useSpring, animated } from "react-spring/three";

export default function Model(props) {
  const [active, setActive] = useState(false);

  const { nodes, materials, animations } = useLoader(
    GLTFLoader,
    "/game_pieces.glb"
  );

  useEffect(() => {
    document.body.style.cursor = active ? "pointer" : "default";
    return function cleanup() {
      document.body.style.cursor = "default";
    };
  }, [active]);

  const { color } = useSpring({
    config: { duration: 100 },
    color: props.color
  });

  return (
    <group
      {...props}
      dispose={null}
      onPointerOver={() => setActive(true)}
      onPointerOut={() => setActive(false)}
    >
      <mesh
        material={materials.MaskPlaneMaterial}
        geometry={nodes.Cube_0.geometry}
        name="Cube_0"
      />
      <animated.mesh geometry={nodes.Cube_1.geometry}>
        <animated.meshStandardMaterial
          attach="material"
          color={color}
          //transparent
        />
      </animated.mesh>
      <mesh
        material={materials.MetalEdge}
        geometry={nodes.Cube_2.geometry}
        name="Cube_2"
      />
    </group>
  );
}