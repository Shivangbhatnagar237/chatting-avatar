import { OrbitControls } from "@react-three/drei";
import Avatar from "./Avatar";
import { useThree, useFrame } from "@react-three/fiber";
import { useRef } from "react";

export const Experience = ({ spokenText }) => {
  const avatarRef = useRef();
  const { camera } = useThree();

  // Make the avatar look at the camera only horizontally (Y axis)
  useFrame(() => {
    if (avatarRef.current) {
      const avatarPos = avatarRef.current.position;
      // Only update y rotation: look at camera.x, avatar.y, camera.z
      avatarRef.current.lookAt(camera.position.x, avatarPos.y + 2, camera.position.z);
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
          <meshStandardMaterial color="#aee1f9" transparent opacity={0.2} />
        </mesh>
        <Avatar ref={avatarRef} position={[0, -2.5, 0]} scale={4} />
      </group>
      <ambientLight intensity={2} />
    </>
  );
};
