import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useGLTF } from '@react-three/drei';
import { MathUtils } from 'three';

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
    
    // Anti-gravity floating effect (up and down)
    const floatY = Math.sin(t) * 0.2;
    
    // Smooth inertia tracking mouse for rotation
    // Target rotation based on mouse position
    const targetRotationX = mousePosition.y * 0.5;
    const targetRotationY = mousePosition.x * 0.5;

    // Interpolate current rotation to target rotation for smooth lag effect
    group.current.rotation.x = MathUtils.lerp(group.current.rotation.x, targetRotationX, 0.05);
    group.current.rotation.y = MathUtils.lerp(group.current.rotation.y, targetRotationY, 0.05);
    
    // Apply floating
    group.current.position.y = floatY;
  });

  return (
    <group ref={group} {...props} dispose={null}>
      {/* Placeholder Geometry representing a headset or gaming item */}
      <mesh castShadow receiveShadow>
        <torusKnotGeometry args={[1, 0.3, 128, 32]} />
        <meshStandardMaterial 
            color="#ffffff" 
            roughness={0.2} 
            metalness={0.1} 
        />
        {/* Subtle green glow inside */}
        <pointLight color="#008000" intensity={2} distance={3} />
      </mesh>
    </group>
  );
};

export default FloatingProductModel;
