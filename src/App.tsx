import { Box, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "./Player";

function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <OrbitControls />
      <Physics debug>
        <Player position={[0, 1, 0]} />
        <RigidBody type="fixed">
          <Box args={[100, 1, 1]} position={[0, 0, 0]} />
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 1, 1]} position={[-7, 10, 0]} />
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 1, 1]} position={[7, 7, 0]} />
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[1, 4, 1]} position={[-2, 2.5, 0]} />
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 1, 1]} position={[7, 3, 0]} />
        </RigidBody>
      </Physics>
    </Canvas>
  );
}

export default App;
