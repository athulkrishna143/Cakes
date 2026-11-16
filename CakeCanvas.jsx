import React, { useRef, useState, useImperativeHandle, forwardRef, useEffect } from 'react';
import * as THREE from 'three';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, ContactShadows, Environment } from '@react-three/drei';
import { Eye, ArrowDownCircle, RefreshCw, Shuffle, Share2, Check } from 'lucide-react';
import ProceduralCake from './ProceduralCake';

function CameraController({ cameraPreset, setCameraPreset, autoRotate }) {
  const controlsRef = useRef();
  const { camera } = useThree();
  const targetPos = useRef(null);

  useEffect(() => {
    if (cameraPreset === 'front') {
      targetPos.current = new THREE.Vector3(0, 1.35, 4.35);
    } else if (cameraPreset === 'top') {
      targetPos.current = new THREE.Vector3(0, 4.6, 0.35);
    }
  }, [cameraPreset]);

  useFrame((_, delta) => {
    if (targetPos.current && controlsRef.current) {
      camera.position.lerp(targetPos.current, Math.min(1, delta * 6));
      controlsRef.current.target.lerp(new THREE.Vector3(0, 0.15, 0), Math.min(1, delta * 6));
      controlsRef.current.update();

      if (camera.position.distanceTo(targetPos.current) < 0.04) {
        targetPos.current = null;
        setCameraPreset(null);
      }
    }
  });

  return (
    <OrbitControls
      ref={controlsRef}
      makeDefault
      target={[0, 0.15, 0]}
      enablePan={false}
      enableDamping
      dampingFactor={0.07}
      autoRotate={autoRotate}
      autoRotateSpeed={1.2}
      minDistance={2.5}
      maxDistance={6.8}
      minPolarAngle={0.12}
      maxPolarAngle={Math.PI / 2 - 0.06}
      onStart={() => {
        targetPos.current = null;
        setCameraPreset(null);
      }}
    />
  );
}

function SnapshotHelper({ snapshotRef }) {
  const { gl, scene, camera } = useThree();
  useImperativeHandle(snapshotRef, () => ({
    capture: () => {
      gl.render(scene, camera);
      return gl.domElement.toDataURL('image/png');
    },
  }));
  return null;
}

const CakeCanvas = forwardRef(function CakeCanvas(
  { config, onRandomize, onShare, shareCopied },
  ref
) {
  const [cameraPreset, setCameraPreset] = useState(null);
  const [autoRotate, setAutoRotate] = useState(true);

  return (
    <div className="relative w-full h-full bg-gradient-to-b from-[#F5EFE6] via-[#FAF7F2] to-[#EFE6D8] overflow-hidden select-none">
      <div className="absolute top-4 left-4 z-10 pointer-events-none flex items-center gap-2 bg-[#FAF7F2]/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#2C1E16]/10 shadow-sm">
        <span className="w-2 h-2 rounded-full bg-[#D48C94] animate-pulse" />
        <span className="text-xs font-medium tracking-wide text-[#2C1E16]/80">
          3D Live Patisserie Studio
        </span>
      </div>

      <div className="absolute top-4 right-4 z-10 flex items-center gap-2">
        <button
          type="button"
          onClick={onRandomize}
          title="Inspire Me (Randomize Cake)"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAF7F2]/90 hover:bg-white text-[#2C1E16] text-xs font-medium border border-[#2C1E16]/12 shadow-sm transition active:scale-95"
        >
          <Shuffle className="w-3.5 h-3.5 text-[#C59B43]" />
          <span className="hidden sm:inline">Randomize</span>
        </button>

        <button
          type="button"
          onClick={onShare}
          title="Copy Shareable 3D Design Link"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#2C1E16] hover:bg-[#3F2C21] text-[#FAF7F2] text-xs font-medium shadow-sm transition active:scale-95"
        >
          {shareCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-[#D48C94]" />
              <span>Link Copied</span>
            </>
          ) : (
            <>
              <Share2 className="w-3.5 h-3.5 text-[#C59B43]" />
              <span className="hidden sm:inline">Share Design</span>
            </>
          )}
        </button>
      </div>

      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [0, 1.35, 4.35], fov: 38 }}
        gl={{ preserveDrawingBuffer: true, antialias: true }}
        className="touch-none"
      >
        <color attach="background" args={['#F6F1E9']} />
        <fog attach="fog" args={['#F6F1E9', 8, 16]} />

        <ambientLight intensity={0.75} color="#FFF8EE" />
        <directionalLight
          position={[4, 6, 4]}
          intensity={1.35}
          color="#FFFDF9"
          castShadow
          shadow-mapSize={[1024, 1024]}
          shadow-bias={-0.0005}
        />
        <directionalLight position={[-4, 3, -3]} intensity={0.5} color="#F7DCE0" />
        <spotLight position={[0, 6, -4]} intensity={0.6} angle={0.5} penumbra={1} color="#FFE8C2" />

        <Environment preset="apartment" />

        <ProceduralCake config={config} />

        <ContactShadows
          position={[0, -1.52, 0]}
          opacity={0.38}
          scale={7}
          blur={2.4}
          far={3}
          color="#2C1E16"
        />

        <CameraController
          cameraPreset={cameraPreset}
          setCameraPreset={setCameraPreset}
          autoRotate={autoRotate}
        />

        <SnapshotHelper snapshotRef={ref} />
      </Canvas>

      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 bg-[#FAF7F2]/90 backdrop-blur-md p-1.5 rounded-full border border-[#2C1E16]/12 shadow-md">
        <button
          type="button"
          onClick={() => setCameraPreset('front')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#2C1E16] hover:bg-[#2C1E16]/5 transition"
        >
          <Eye className="w-3.5 h-3.5 text-[#D48C94]" />
          <span>Front View</span>
        </button>

        <div className="w-px h-4 bg-[#2C1E16]/15" />

        <button
          type="button"
          onClick={() => setCameraPreset('top')}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-[#2C1E16] hover:bg-[#2C1E16]/5 transition"
        >
          <ArrowDownCircle className="w-3.5 h-3.5 text-[#C59B43]" />
          <span>Top-Down</span>
        </button>

        <div className="w-px h-4 bg-[#2C1E16]/15" />

        <button
          type="button"
          onClick={() => setAutoRotate((prev) => !prev)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition ${
            autoRotate
              ? 'bg-[#2C1E16] text-[#FAF7F2]'
              : 'text-[#2C1E16] hover:bg-[#2C1E16]/5'
          }`}
        >
          <RefreshCw className={`w-3 h-3 ${autoRotate ? 'animate-spin' : ''}`} style={{ animationDuration: '6s' }} />
          <span>{autoRotate ? 'Rotating' : 'Auto-Rotate'}</span>
        </button>
      </div>
    </div>
  );
});

export default CakeCanvas;
