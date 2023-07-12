import { Box } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "./Player";
import Spike from "./Spike";
import Platform from "./Platform";

function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Physics debug>
        <Player position={[-3, 1, 0]} />

        {/* base */}
        <Platform args={[100, 1, 1]} position={[0, 0, 0]} />

        {/* high blocks */}
        <Platform args={[1, 2, 1]} position={[-5, 1.5, 0]} color="green" />
        <Platform args={[1, 3, 1]} position={[-10, 2, 0]} color="yellow" />
        <Platform args={[1, 4, 1]} position={[-15, 2.5, 0]} color="orange" />
        <Platform args={[1, 5, 1]} position={[-20, 3, 0]} color="red" />

        {/* platforms */}
        <Platform args={[10, 2, 1]} position={[10, 1.5, 0]} color="green" />
        <Spike position={[20, 5, 0]} />
        <Platform args={[10, 2, 1]} position={[20, 3.5, 0]} color="green" />
        <Spike position={[30, 8, 0]} />
        <Platform args={[10, 2, 1]} position={[30, 6.5, 0]} color="yellow" />
        <Spike position={[44, 11, 0]} />
        <Spike position={[43, 11, 0]} />
        <Platform args={[10, 2, 1]} position={[40, 9.5, 0]} color="yellow" />
        <Platform args={[10, 2, 1]} position={[50, 13.5, 0]} color="orange" />
        <Spike position={[36, 10.5, 0]} />
        <Platform args={[10, 2, 1]} position={[60, 17.5, 0]} color="orange" />
        <Platform args={[10, 2, 1]} position={[70, 22.5, 0]} color="red" />

        {/* platforms up top */}
        <Platform args={[4, 1, 1]} position={[11, 6, 0]} />
        <Platform args={[4, 1, 1]} position={[7, 7, 0]} />
        <Platform args={[4, 1, 1]} position={[3, 8, 0]} />
        <Platform args={[4, 1, 1]} position={[-1, 9, 0]} />
        <Platform args={[4, 1, 1]} position={[-5, 10, 0]} />
      </Physics>
    </Canvas>
  );
}

export default App;
