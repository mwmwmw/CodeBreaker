import * as THREE from "three";
import React, { useEffect, useRef, useMemo } from "react";
import { extend, useFrame, useThree } from "react-three-fiber";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";
import { GlitchPass } from "three/examples/jsm/postprocessing/GlitchPass";
import { FilmPass } from "three/examples/jsm/postprocessing/FilmPass";
extend({ EffectComposer, RenderPass, GlitchPass, UnrealBloomPass, FilmPass });

export default function FX({ glitch, dead }) {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef();
  const aspect = useMemo(() => new THREE.Vector2(size.width, size.height), [
    size
  ]);
  useEffect(
    () => void scene && composer.current.setSize(size.width, size.height),
    [size, scene]
  );
  useFrame(() => composer.current.render(), 2);
  return (
    <effectComposer ref={composer} args={[gl]}>
      <renderPass attachArray="passes" scene={scene} camera={camera} />

      <unrealBloomPass attachArray="passes" args={[aspect, 0.7, 0.01, 0.15]} />
      {glitch && (
        <glitchPass
          attachArray="passes"
          renderToScreen
          args={[0.4]}
          goWild={false}
          curF={300}
        />
      )}
      <filmPass
        attachArray="passes"
        args={[0.2, 1, glitch ? 1000 : 0, false]}
      />
    </effectComposer>
  );
}
