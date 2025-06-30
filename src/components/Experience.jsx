import { OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";

export const Experience = ({ spokenText }) => {
  const avatarRef = useRef();
  const { camera } = useThree();

  // Make the avatar look at the camera when speaking
  useEffect(() => {
    if (spokenText && avatarRef.current) {
      // Look at camera
      avatarRef.current.lookAt(camera.position);
    }
  }, [spokenText, camera]);

  return (
    <>
      <OrbitControls enablePan={false} enableZoom={false} />
      <group position={[0, -1, 0]}>
        {/* 3D mesh around avatar */}
        <mesh position={[0, 1, 0]}>
          <sphereGeometry args={[1.2, 32, 32]} />
          <meshStandardMaterial color="#aee1f9" transparent opacity={0.2} />
        </mesh>
        <Avatar ref={avatarRef} position={[0, 1, 0]} />
      </group>
      <ambientLight intensity={2} />
    </>
  );
};
