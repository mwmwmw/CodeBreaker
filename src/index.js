import ReactDOM from "react-dom";
import React, {
  useState,
  useRef,
  useEffect,
  useCallback,
  Suspense
} from "react";

import * as THREE from "three/src/Three";
import { useSpring, animated } from "react-spring/three";

import useCodeBreaker, { CODE_PIECES } from "./useGameState";
import { useMousePosition, useKeyPress } from "./hooks";

import Title from "./Title";
import GameOver from "./GameOver";
import Win from "./Win";
import { DisplayRow, PinRow, GuessRow } from "./Pins";

import FX from "./FX";

import { Canvas, useFrame, Dom, useThree } from "react-three-fiber";

import "./styles.css";

const GAME_MODE = {
  TITLE: 1,
  GAME: 2,
  WIN: 3,
  LOSE: 4
};

const ninetyDeg = THREE.MathUtils.degToRad(90);

const CameraControl = ({ mode }) => {
  // const position = useMousePosition();

  var targetPos = new THREE.Vector3(0, 0, 30);
  const { current } = useRef(new THREE.Quaternion());
  var targetRotation = new THREE.Quaternion();

  switch (mode) {
    case GAME_MODE.TITLE:
      targetPos = new THREE.Vector3(0, 0, 30);
      targetRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
      break;
    case GAME_MODE.GAME:
      targetPos = new THREE.Vector3(0, 8, 8);
      targetRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), -0.9);
      break;
    case GAME_MODE.WIN:
      targetPos = new THREE.Vector3(0, 20, 0);
      targetRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
      break;
    case GAME_MODE.LOSE:
      targetPos = new THREE.Vector3(0, -20, 40);
      targetRotation.setFromAxisAngle(new THREE.Vector3(1, 0, 0), 0);
      break;
    default:
      break;
  }

  useFrame(({ camera, clock, scene }) => {
    //   const time = clock.getElapsedTime();
    camera.rotation.setFromQuaternion(current.slerp(targetRotation, 0.09));
    camera.position.lerp(targetPos, 0.09);
    //   camera.position.y = 0; //4 + 2 * Math.cos(time);
    camera.position.x = 0;
    //   scene.rotation.y = position.cx * 0.2;
    //   scene.rotation.x = position.cy * 0.4;
  });

  return null;
};

const App = () => {
  const {
    win,
    lose,
    code,
    newCode,
    makeGuess,
    history,
    vegas
  } = useCodeBreaker();

  const [gameMode, setGameMode] = useState(GAME_MODE.TITLE);

  const [inputCode, setInputCode] = useState("----");

  const [guessing, setGuessing] = useState(false);

  const onePressed = useKeyPress("1");
  const twoPressed = useKeyPress("2");
  const threePressed = useKeyPress("3");
  const fourPressed = useKeyPress("4");
  const enterPressed = useKeyPress("Enter");

  const switchPin = useCallback(
    loc => {
      var newCode = inputCode.split("");

      const pieces = CODE_PIECES.split("");

      const next =
        (pieces.findIndex(v => v === inputCode[loc]) + 1) % pieces.length;
      newCode[loc] = pieces[next];

      setInputCode(newCode.join(""));
    },
    [inputCode]
  );

  const { location } = useSpring({
    config: { duration: 100 },
    location: [1 - history.length, 0, 0]
  });

  const pushPlayerCode = useCallback(() => {
    if (!guessing) {
      if (!lose && !win) {
        if (
          inputCode !== "----" &&
          !history.map(c => c.guess).includes(inputCode)
        ) {
          makeGuess(inputCode);
          setGuessing(true);
          setTimeout(() => {
            setGuessing(false);
          }, 500);
        }
      } else {
        newCode();
      }
    }
  }, [
    inputCode,
    guessing,
    lose,
    win,
    history,
    newCode,
    makeGuess,
    setGuessing
  ]);

  useEffect(() => {
    if (onePressed) {
      switchPin(0);
    }
    if (twoPressed) {
      switchPin(1);
    }
    if (threePressed) {
      switchPin(2);
    }
    if (fourPressed) {
      switchPin(3);
    }
    if (enterPressed) {
      switch (gameMode) {
        case GAME_MODE.TITLE:
          setGameMode(GAME_MODE.GAME);
          break;
        case GAME_MODE.GAME:
          pushPlayerCode();
          break;
        case GAME_MODE.WIN:
          setGameMode(GAME_MODE.TITLE);
          break;
        case GAME_MODE.LOSE:
          setGameMode(GAME_MODE.TITLE);
          break;
        default:
          setGameMode(GAME_MODE.TITLE);
          break;
      }
    }
  }, [
    onePressed,
    twoPressed,
    threePressed,
    fourPressed,
    enterPressed,
    switchPin,
    pushPlayerCode,
    gameMode
  ]);

  useEffect(() => {
    if (win) {
      setGameMode(GAME_MODE.WIN);
      setTimeout(() => {
        newCode();
        setInputCode("----");
        setGameMode(GAME_MODE.TITLE);
      }, 6000);
    }
    if (!win && lose) {
      setGameMode(GAME_MODE.LOSE);
      setTimeout(() => {
        newCode();
        setInputCode("----");
        setGameMode(GAME_MODE.TITLE);
      }, 6000);
    }
  }, [win, lose, newCode]);

  return (
    <>
      <Canvas
        sRGB={false}
        onCreated={({ gl, camera, scene }) => {
          gl.toneMapping = THREE.Uncharted2ToneMapping;
          scene.background = new THREE.Color(0x020204);
        }}
      >
        <ambientLight color={0x808080} intensity={0.5} />
        <CameraControl mode={gameMode} />
        <FX />
        <group rotation={[0, 0, 0]} position={[0, 0, 0]}>
          <pointLight position={[0, 20, 5]} intensity={1} />
          <Suspense fallback={<Dom center>Loading</Dom>}>
            {gameMode === GAME_MODE.TITLE && (
              <Title
                position={[0, 0, 20]}
                onClick={() => setGameMode(GAME_MODE.GAME)}
              />
            )}
            {gameMode === GAME_MODE.WIN && (
              <group position={[0, 20, -10]}>
                <Win onClick={() => setGameMode(GAME_MODE.GAME)} />
                <DisplayRow
                  position={[1, -4, -15]}
                  rotation={[1, 0, 0]}
                  pins={code}
                />
              </group>
            )}
            {gameMode === GAME_MODE.LOSE && (
              <GameOver
                position={[0, -20, 30]}
                onClick={() => setGameMode(GAME_MODE.TITLE)}
              />
            )}
            {gameMode === GAME_MODE.GAME && (
              <group scale={[0.5, 0.5, 0.5]}>
                <DisplayRow
                  position={[1, 2, -6]}
                  rotation={[1, 0, 0]}
                  pins={win ? code : lose ? "AAAA" : "----"}
                />
                <animated.group
                  position={location}
                  rotation={[0, -ninetyDeg, 0]}
                >
                  {history.map((pins, i) => (
                    <PinRow
                      key={i + pins.guess}
                      position={[1, 0, -i * 2]}
                      pins={pins}
                    />
                  ))}
                </animated.group>
                <GuessRow
                  pins={inputCode}
                  clickPin={switchPin}
                  clickGuess={pushPlayerCode}
                  position={[0, 0, 8]}
                />
              </group>
            )}
          </Suspense>
        </group>
      </Canvas>
    </>
  );
};

const rootElement = document.getElementById("root");
ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  rootElement
);
