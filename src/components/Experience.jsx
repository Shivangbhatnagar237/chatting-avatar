import { OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef, useEffect } from "react";

export const Experience = ({ spokenText }) => {
  const avatarRef = useRef();
  const { camera, gl } = useThree();
  const mouse = useRef({ x: 0, y: 0 });
  const readingPhase = useRef(0);
  const readingStart = useRef(0);

  useEffect(() => {
    function onMouseMove(e) {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    }
    gl.domElement.addEventListener("mousemove", onMouseMove);
    return () => gl.domElement.removeEventListener("mousemove", onMouseMove);
  }, [gl]);

  useEffect(() => {
    if (spokenText) {
      readingPhase.current = 1;
      readingStart.current = performance.now();
    } else {
      readingPhase.current = 0;
    }
  }, [spokenText]);

  useFrame(() => {
    if (!avatarRef.current) return;
    let head = null, eyeL = null, eyeR = null;
    avatarRef.current.traverse(obj => {
      if (obj.name === "Wolf3D_Head") head = obj;
      if (obj.name === "EyeLeft") eyeL = obj;
      if (obj.name === "EyeRight") eyeR = obj;
    });
    let targetY = 0, targetX = 0, eyeOffsetX = 0, eyeOffsetY = 0;
    if (spokenText && readingPhase.current > 0) {
      const now = performance.now();
      const elapsed = now - readingStart.current;
      if (readingPhase.current === 1) {
        const t = Math.min(elapsed / 1200, 1);
        targetY = -0.15 + 0.3 * t; // -8.5deg to +8.5deg
        targetX = 0;
        if (t >= 1) {
          readingPhase.current = 2;
          readingStart.current = now;
        }
      } else if (readingPhase.current === 2) {
        const t = Math.min((elapsed - 1200) / 700, 1);
        targetX = -0.08 * t; // up to -4.5deg
        targetY = 0.15; // hold at right
        if (t >= 1) {
        }
      }
      eyeOffsetX = targetY * 1.2;
      eyeOffsetY = targetX * 1.2;
    } else {
      targetY = mouse.current.x * 0.15; // -0.15 to 0.15
      targetX = -0.05 + mouse.current.y * 0.08; // looks slightly up by default
      eyeOffsetX = targetY * 1.2;
      eyeOffsetY = targetX * 1.2;
    }
    if (head) {
      head.rotation.y += (targetY - head.rotation.y) * 0.2;
      head.rotation.x += (targetX - head.rotation.x) * 0.2;
    }
    if (eyeL && eyeL.morphTargetInfluences && eyeL.morphTargetDictionary) {
      const leftRight = eyeL.morphTargetDictionary["eyeLookLeft"] !== undefined ? "eyeLookLeft" : null;
      const rightLeft = eyeL.morphTargetDictionary["eyeLookRight"] !== undefined ? "eyeLookRight" : null;
      const up = eyeL.morphTargetDictionary["eyeLookUp"] !== undefined ? "eyeLookUp" : null;
      const down = eyeL.morphTargetDictionary["eyeLookDown"] !== undefined ? "eyeLookDown" : null;
      if (leftRight && rightLeft) {
        eyeL.morphTargetInfluences[eyeL.morphTargetDictionary[leftRight]] = Math.max(0, -eyeOffsetX);
        eyeL.morphTargetInfluences[eyeL.morphTargetDictionary[rightLeft]] = Math.max(0, eyeOffsetX);
      }
      if (up && down) {
        eyeL.morphTargetInfluences[eyeL.morphTargetDictionary[up]] = Math.max(0, -eyeOffsetY);
        eyeL.morphTargetInfluences[eyeL.morphTargetDictionary[down]] = Math.max(0, eyeOffsetY);
      }
    }
    if (eyeR && eyeR.morphTargetInfluences && eyeR.morphTargetDictionary) {
      const leftRight = eyeR.morphTargetDictionary["eyeLookLeft"] !== undefined ? "eyeLookLeft" : null;
      const rightLeft = eyeR.morphTargetDictionary["eyeLookRight"] !== undefined ? "eyeLookRight" : null;
      const up = eyeR.morphTargetDictionary["eyeLookUp"] !== undefined ? "eyeLookUp" : null;
      const down = eyeR.morphTargetDictionary["eyeLookDown"] !== undefined ? "eyeLookDown" : null;
      if (leftRight && rightLeft) {
        eyeR.morphTargetInfluences[eyeR.morphTargetDictionary[leftRight]] = Math.max(0, -eyeOffsetX);
        eyeR.morphTargetInfluences[eyeR.morphTargetDictionary[rightLeft]] = Math.max(0, eyeOffsetX);
      }
      if (up && down) {
        eyeR.morphTargetInfluences[eyeR.morphTargetDictionary[up]] = Math.max(0, -eyeOffsetY);
        eyeR.morphTargetInfluences[eyeR.morphTargetDictionary[down]] = Math.max(0, eyeOffsetY);
      }
    }
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
        <Avatar ref={avatarRef} position={[0, -4.5, 0]} scale={7} />
      </group>
      <ambientLight intensity={2} />
    </>
  );
};
