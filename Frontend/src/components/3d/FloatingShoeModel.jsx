import React, { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';

const FloatingShoeModel = (props) => {
  const group = useRef();
  
  // Uncomment and use a real URL in production
  // const { nodes, materials } = useGLTF('/models/shoe.glb')

  // Using a simple abstract shape as a placeholder for the hero section
  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    group.current.rotation.y = Math.sin(t / 4) / 2;
    group.current.rotation.z = Math.cos(t / 4) / 2;
    group.current.position.y = Math.sin(t / 1.5) / 5;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Placeholder Geometry. Replace with actual GLTF mesh */}
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial 
            color="#00ffff" 
            roughness={0.1} 
            metalness={0.8} 
            emissive="#00ffff"
            emissiveIntensity={0.2}
        />
      </mesh>
    </group>
  );
};

// Preload the model if using actual gltf
// useGLTF.preload('/models/shoe.glb')

export default FloatingShoeModel;
