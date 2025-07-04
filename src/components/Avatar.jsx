/*
Auto-generated by: https://github.com/pmndrs/gltfjsx
Command: npx gltfjsx@6.5.3 models/68624e8f35fff28602dbc860.glb 
*/

import React, { useRef, useMemo } from 'react'
import { useGraph } from '@react-three/fiber'
import { useGLTF } from '@react-three/drei'
import { SkeletonUtils } from 'three-stdlib'

const Avatar = React.forwardRef(
  ({ ...props }, ref) => {
    const group = useRef();
    const { scene } = useGLTF('models/68624e8f35fff28602dbc860.glb');
    const clone = useMemo(() => SkeletonUtils.clone(scene), [scene]);
    const { nodes, materials } = useGraph(clone);
    
    return (
      <group ref={ref || group} {...props} dispose={null}>
        <group name="Scene">
          <group name="AvatarRoot">
            <primitive object={nodes.Hips} />
            {/* <skinnedMesh name="Wolf3D_Hands" geometry={nodes.Wolf3D_Hands.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Hands.skeleton} /> */}
            <skinnedMesh name="Wolf3D_Hair" geometry={nodes.Wolf3D_Hair.geometry} material={materials.Wolf3D_Hair} skeleton={nodes.Wolf3D_Hair.skeleton} />
            <skinnedMesh name="Wolf3D_Glasses" geometry={nodes.Wolf3D_Glasses.geometry} material={materials.Wolf3D_Glasses} skeleton={nodes.Wolf3D_Glasses.skeleton} />
            <skinnedMesh name="Wolf3D_Shirt" geometry={nodes.Wolf3D_Shirt.geometry} material={materials.Wolf3D_Shirt} skeleton={nodes.Wolf3D_Shirt.skeleton} />
            <skinnedMesh name="EyeLeft" geometry={nodes.EyeLeft.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeLeft.skeleton} morphTargetDictionary={nodes.EyeLeft.morphTargetDictionary} morphTargetInfluences={nodes.EyeLeft.morphTargetInfluences} />
            <skinnedMesh name="EyeRight" geometry={nodes.EyeRight.geometry} material={materials.Wolf3D_Eye} skeleton={nodes.EyeRight.skeleton} morphTargetDictionary={nodes.EyeRight.morphTargetDictionary} morphTargetInfluences={nodes.EyeRight.morphTargetInfluences} />
            <skinnedMesh name="Wolf3D_Head" geometry={nodes.Wolf3D_Head.geometry} material={materials.Wolf3D_Skin} skeleton={nodes.Wolf3D_Head.skeleton} morphTargetDictionary={nodes.Wolf3D_Head.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Head.morphTargetInfluences} />
            <skinnedMesh name="Wolf3D_Teeth" geometry={nodes.Wolf3D_Teeth.geometry} material={materials.Wolf3D_Teeth} skeleton={nodes.Wolf3D_Teeth.skeleton} morphTargetDictionary={nodes.Wolf3D_Teeth.morphTargetDictionary} morphTargetInfluences={nodes.Wolf3D_Teeth.morphTargetInfluences} />
          </group>
        </group>
      </group>
    );
  }
);

useGLTF.preload('models/68624e8f35fff28602dbc860.glb');
export default Avatar;
