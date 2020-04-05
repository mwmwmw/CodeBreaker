import * as THREE from "three";
import React, { useEffect, useRef } from "react";
import { extend, Canvas, useFrame, useThree } from "react-three-fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
import { Layers } from "three";
extend({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, FilmPass });

export default function FX({ glitch, dead }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();
  useEffect(() => void composer.current.setSize(size.width, size.height), [
    size
  ]);
  useFrame(() => composer.current.render(), 2);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" args={[scene, camera]} />

      {glitch && (
        <glitchPass attachArray="passes" renderToScreen args={[100]} />
      )}
      <filmPass attachArray="passes" args={[0.25, 1, 0, dead ? true : false]} />
      <unrealBloomPass
        attachArray="passes"
        args={[undefined, 0.7, 0.01, 0.15]}
      />
    </effectComposer>
  );
}
