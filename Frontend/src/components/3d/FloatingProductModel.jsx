import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF, Float } from '@react-three/drei';
import * as THREE from 'three';

const FloatingProductModel = (props) => {
  const group = useRef();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Add mouse listener to window to get normalized coordinates (-1 to 1)
  React.useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    
    // Smooth inertia tracking mouse for tilt
    const targetRotationX = mousePosition.y * 0.3;
    const targetRotationZ = -mousePosition.x * 0.3;

    // Interpolate current rotation to target rotation + add constant slow rotation
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
    group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, targetRotationZ, 0.05);
    
    // Constant slow rotation on Y axis like Apple showcase
    group.current.rotation.y += 0.005;
  });

  // Premium Material for the Headset
  const matteMaterial = new THREE.MeshStandardMaterial({
    color: '#111111',
    roughness: 0.1,
    metalness: 0.8,
  });

  const greenAccentMaterial = new THREE.MeshStandardMaterial({
    color: '#008000',
    emissive: '#008000',
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8,
  });

  const cushionMaterial = new THREE.MeshStandardMaterial({
    color: '#0a0a0a',
    roughness: 0.9,
    metalness: 0.1,
  });

  return (
    <group ref={group} {...props} dispose={null} scale={1.2}>
        {/* Headband */}
        <mesh material={matteMaterial} position={[0, 0.5, 0]} castShadow>
            <torusGeometry args={[1.5, 0.2, 32, 100, Math.PI]} />
        </mesh>
        
        {/* Left Earcup */}
        <group position={[-1.5, 0.5, 0]}>
            {/* Outer Shell */}
            <mesh material={matteMaterial} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
            </mesh>
            {/* Glowing Ring */}
            <mesh material={greenAccentMaterial} rotation={[0, 0, Math.PI / 2]} position={[-0.16, 0, 0]}>
                <torusGeometry args={[0.6, 0.03, 16, 100]} />
            </mesh>
            {/* Cushion */}
            <mesh material={cushionMaterial} rotation={[0, 0, Math.PI / 2]} position={[0.2, 0, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
            </mesh>
        </group>

        {/* Right Earcup */}
        <group position={[1.5, 0.5, 0]}>
            {/* Outer Shell */}
            <mesh material={matteMaterial} rotation={[0, 0, Math.PI / 2]} castShadow>
                <cylinderGeometry args={[0.8, 0.8, 0.3, 32]} />
            </mesh>
            {/* Glowing Ring */}
            <mesh material={greenAccentMaterial} rotation={[0, 0, Math.PI / 2]} position={[0.16, 0, 0]}>
                <torusGeometry args={[0.6, 0.03, 16, 100]} />
            </mesh>
            {/* Cushion */}
            <mesh material={cushionMaterial} rotation={[0, 0, Math.PI / 2]} position={[-0.2, 0, 0]}>
                <cylinderGeometry args={[0.8, 0.8, 0.4, 32]} />
            </mesh>
        </group>

        {/* Ambient Glow */}
        <pointLight color="#008000" intensity={1} distance={5} position={[0, 0, 0]} />
    </group>
  );
};

export default FloatingProductModel;
