import { OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

export const Experience = ({
  spokenText,
  isSpeaking,
  visemeSequence,
  audioStartTime,
}) => {
  const avatarRef = useRef();
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const readingPhase = useRef(0);
  const readingStart = useRef(0);
  const MOUTH_VISEMES = [
    "mouthOpen",
    "viseme_aa",
    "viseme_ih",
    "viseme_oh",
    "viseme_ou",
    "viseme_ee",
    "viseme_ae",
  ];
  useEffect(() => {
    function onMouseMove(e) {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    gl.domElement.addEventListener("mousemove", onMouseMove);
    return () => gl.domElement.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    if (spokenText) {
      readingPhase.current = 1;
      readingStart.current = performance.now();
    } else {
      readingPhase.current = 0;
    }
  }, [spokenText]);

  const hasLogged = useRef(false);

  useFrame(() => {
    if (!hasLogged.current) {
      avatarRef.current.traverse((obj) => {
        console.log(`Type: ${obj.type}, Name: ${obj.name}`);
      });
      hasLogged.current = true; // Prevent further logging
    }
  });

  const eyeDartState = useRef({
    nextDart: Math.random() * 1.5 + 0.5, // 0.5–2s
    lastTime: 0,
    targetX: 0,
    targetY: 0,
    currentX: 0,
    currentY: 0,
  });

  const headMoveState = useRef({
    nextMove: 0,
    lastTime: 0,
    target: { x: 0, y: 0, z: 0 },
    current: { x: 0, y: 0, z: 0 },
  });

  const smoothHeadX = useRef(0);

  useFrame((state) => {
    if (!avatarRef.current) return;
    let head = null,
      eyeL = null,
      eyeR = null,
      teeth = null,
      headBone = null,
      leftEye = null,
      rightEye = null;

    avatarRef.current.traverse((obj) => {
      if (obj.name === "Wolf3D_Head") head = obj;
      if (obj.name === "EyeLeft") eyeL = obj;
      if (obj.name === "EyeRight") eyeR = obj;
      if (obj.name === "Wolf3D_Teeth") teeth = obj;
      if (obj.type === "Bone" && obj.name === "Head") headBone = obj;
      if (obj.name === "LeftEye") leftEye = obj;
      if (obj.name === "RightEye") rightEye = obj;
    });

    const upwardBias = isSpeaking ? -0.07 : 0;
    const targetX = -Math.PI / 8 + (isSpeaking ? -0.07 : 0); // or adjust as needed
    smoothHeadX.current += (targetX - smoothHeadX.current) * 0.08;

    if (headBone) {
      headBone.rotation.x = smoothHeadX.current; // Try -Math.PI / 6 for more tilt
    }

    const now = state.clock.getElapsedTime();

    const eyeDart = eyeDartState.current;
    const maxDart = 0.1;
    if (now - eyeDart.lastTime > eyeDart.nextDart) {
      eyeDart.lastTime = now;
      eyeDart.nextDart = Math.random() * 1.2 + 1.2;
      eyeDart.targetX = (Math.random() - 0.5) * 2 * maxDart; // -0.005 to +0.005
      eyeDart.targetY = (Math.random() - 0.5) * 2 * maxDart;
    }
    eyeDart.currentX += (eyeDart.targetX - eyeDart.currentX) * 0.05;
    eyeDart.currentY += (eyeDart.targetY - eyeDart.currentY) * 0.05;
    if (leftEye) {
      leftEye.rotation.y = eyeDart.currentX;
    }
    if (rightEye) {
      rightEye.rotation.y = eyeDart.currentX;
    }

    const move = headMoveState.current;

    // Every 1–2 seconds, pick a new random target rotation
    if (now - move.lastTime > move.nextMove) {
      move.lastTime = now;
      move.nextMove = Math.random() * 2 + 2; // 1–2s
      move.target.x = (Math.random() - 0.5) * 0.04; // Pitch (up/down), ±0.02 rad
      move.target.y = (Math.random() - 0.5) * 0.2; // Yaw (left/right), ±0.02 rad
      move.target.z = (Math.random() - 0.5) * 0.1; // Roll (tilt), ±0.01 rad
    }

    // Smoothly interpolate toward the target
    move.current.x += (move.target.x - move.current.x) * 0.05;
    move.current.y += (move.target.y - move.current.y) * 0.05;
    move.current.z += (move.target.z - move.current.z) * 0.05;

    const maxYaw = 0.15; // left/right (Y axis), about 8.5°
    const mouseX = mouse.current.x * maxYaw;

    // --- Blend idle and mouse movement ---
    const idleWeight = 0.7;
    const mouseWeight = 0.3;
    const blendedY = move.current.y * idleWeight + mouseX * mouseWeight;
    const blendedZ = move.current.z;

    // Apply to head bone
    if (headBone) {
      headBone.rotation.y = blendedY;
      headBone.rotation.z = blendedZ;
    }

    if (head && head.morphTargetDictionary && head.morphTargetInfluences) {
      const smileIdx = head.morphTargetDictionary["mouthSmile"];
      if (smileIdx !== undefined) {
        head.morphTargetInfluences[smileIdx] = 0.3 + 0.2 * Math.sin(now * 0.5);
      }
      if (isSpeaking) {
        const t = state.clock.getElapsedTime();
        const mouthValue = 0.3 + 0.2 * Math.abs(Math.sin(t * 6));
        MOUTH_VISEMES.forEach((morph) => {
          if (head.morphTargetDictionary[morph] !== undefined) {
            head.morphTargetInfluences[head.morphTargetDictionary[morph]] =
              mouthValue;
          }
        });
      } else {
        MOUTH_VISEMES.forEach((morph) => {
          if (head.morphTargetDictionary[morph] !== undefined) {
            head.morphTargetInfluences[head.morphTargetDictionary[morph]] = 0;
          }
        });
      }
    }
    // For Teeth
    // if (teeth && teeth.morphTargetDictionary && teeth.morphTargetInfluences) {
    //   if (isSpeaking) {
    //     const t = state.clock.getElapsedTime();
    //     const mouthValue = 0.3 + 0.2 * Math.abs(Math.sin(t * 6));
    //     MOUTH_VISEMES.forEach((morph) => {
    //       if (teeth.morphTargetDictionary[morph] !== undefined) {
    //         teeth.morphTargetInfluences[teeth.morphTargetDictionary[morph]] =
    //           mouthValue;
    //       }
    //     });
    //   } else {
    //     MOUTH_VISEMES.forEach((morph) => {
    //       if (teeth.morphTargetDictionary[morph] !== undefined) {
    //         teeth.morphTargetInfluences[teeth.morphTargetDictionary[morph]] = 0;
    //       }
    //     });
    //   }
    // }
  });

  return (
    <>
      <OrbitControls
        enablePan={false}
        enableZoom={false}
        minPolarAngle={Math.PI / 2 - 0.44}
        maxPolarAngle={Math.PI / 2 + 0.44}
        minAzimuthAngle={-0.44}
        maxAzimuthAngle={0.44}
      />
      <group>
        <mesh position={[0, 1, 0]} scale={2.2}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial transparent opacity={0} />
        </mesh>
        <Avatar ref={avatarRef} position={[0, -4.25, 0]} scale={7} />
      </group>
      <ambientLight intensity={2} />
    </>
  );
};
