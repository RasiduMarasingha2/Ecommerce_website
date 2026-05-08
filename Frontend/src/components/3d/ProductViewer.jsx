import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stage, useGLTF } from '@react-three/drei';

// Helper component to load and render the model
const Model = ({ url }) => {
  // If the URL is valid, useGLTF loads the model. 
  // In a real scenario, handle errors or fallbacks here.
  const { scene } = useGLTF(url);
  return <primitive object={scene} scale={1.5} />;
};

const ProductViewer = ({ modelUrl }) => {
  return (
    <div className="w-full h-[500px] rounded-2xl overflow-hidden bg-gradient-to-b from-gray-900 to-black border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] relative">
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 4], fov: 45 }}>
        <Suspense fallback={null}>
          <Stage environment="city" intensity={0.6}>
            {modelUrl ? (
                <Model url={modelUrl} />
            ) : (
                <mesh>
                    <boxGeometry args={[1, 1, 1]} />
                    <meshStandardMaterial color="hotpink" />
                </mesh>
            )}
          </Stage>
        </Suspense>
        <OrbitControls autoRotate autoRotateSpeed={2} enablePan={false} maxPolarAngle={Math.PI / 2} />
      </Canvas>
      {/* Loading Indicator could go here using Suspense fallback, but keeping simple for now */}
      <div className="absolute bottom-4 left-4 text-xs text-gray-500 pointer-events-none">
        Interactive 3D Viewer - Drag to rotate
      </div>
    </div>
  );
};

export default ProductViewer;
