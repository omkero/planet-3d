import "./App.css";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useRef, useEffect, useState } from "react";
import { OrbitControls, useTexture } from "@react-three/drei";
import * as THREE from "three";

interface SphereType {
  position?: number[] | any;
  geometryArgs?: number[] | any;
  color?: string | any;
  selectedPlanet: string;
  enableRotation: boolean
}

const RenderBall = ({
  position,
  geometryArgs,
  color,
  selectedPlanet,
  enableRotation,
}: SphereType) => {
  const ballRef: any = useRef(null);

  const earthTexture = useTexture("/8k_earth_daymap.jpg");
  const marsTexture = useTexture("/8k_mars.jpg");
  const moonTexture = useTexture("/8k_moon.jpg");

  useFrame(() => {
    if (enableRotation) {
      ballRef.current.rotation.y -= 0.0005;
    }
  });

  return (
    <mesh ref={ballRef} position={position}>
      <sphereGeometry args={geometryArgs} />
      <meshStandardMaterial
        map={
          selectedPlanet == "earth"
            ? earthTexture
            : selectedPlanet == "mars"
            ? marsTexture
            : moonTexture
        }
      />
    </mesh>
  );
};

function Skybox() {
  const texture = useTexture("/8k_stars_milky_way.jpg");
  const ref = useRef<THREE.Mesh>(null);

  useFrame(() => {
    if (ref.current) {
      //  ref.current.rotation.y += 0.0005; // Slowly rotates the skybox
    }
  });

  return (
    <mesh ref={ref} scale={[-1, 1, 1]} position={[0, 0, 0]}>
      {/* Invert the normals so the texture appears inside */}
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={texture} side={THREE.BackSide} />
    </mesh>
  );
}

function App() {
  const [selectedPlanet, setSelectedPlanet] = useState<string>("earth");
  const [enableRotation, setEnableRotation] = useState<boolean>(true);

  return (
    <div className="h-screen relative">
      <div className="absolute right-5 top-5 h-36 w-36 bg-zinc-800 z-50 p-2">
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs">Select planet:</p>
            <select
              className="w-full bg-zinc-700 p-1 border-none outline-none"
              value={selectedPlanet}
              onChange={(event) => {
                setSelectedPlanet(event.target.value);
              }}
            >
              <option value={"earth"}>earth</option>
              <option value={"mars"}>mars</option>
              <option value={"moon"}>moon</option>
            </select>
          </div>
          <div className="flex gap-1 w-full items-center justify-between">
  
            <label className="text-xs " htmlFor="chk">Enable Rotation</label>
            <input
            id="chk"
              type="checkbox"
              checked={enableRotation}
              
              onChange={(e) => {
                setEnableRotation(e.target.checked);
              }}
              placeholder="enable rotation"
            />
          </div>
        </div>
      </div>
      <Canvas camera={{ position: [0, 5, 10] }}>
        <Skybox />

        <ambientLight intensity={1} />
        <directionalLight color="white" position={[52, 0, 0]} />

        <RenderBall
          position={[0, 0, 0]}
          geometryArgs={[5, 64, 32]}
          selectedPlanet={selectedPlanet}
          enableRotation={enableRotation}
        />
        <OrbitControls minDistance={5.5} maxDistance={19} enablePan={false} />
      </Canvas>
    </div>
  );
}

export default App;
