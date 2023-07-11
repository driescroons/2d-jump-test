import { Box, OrbitControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Physics, RigidBody } from "@react-three/rapier";
import Player from "./Player";

function App() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Physics debug>
        <Player position={[-3, 1, 0]} />
        <RigidBody type="fixed">
          <Box args={[100, 1, 1]} position={[0, 0, 0]} />
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[1, 2, 1]} position={[-5, 1.5, 0]}>
            <meshBasicMaterial color="green" />
          </Box>
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[1, 2, 1]} position={[-5, 1.5, 0]}>
            <meshBasicMaterial color="green" />
          </Box>
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[1, 3, 1]} position={[-10, 2, 0]}>
            <meshBasicMaterial color="yellow" />
          </Box>
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[1, 4, 1]} position={[-15, 2.5, 0]}>
            <meshBasicMaterial color="orange" />
          </Box>
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[1, 5, 1]} position={[-20, 3, 0]}>
            <meshBasicMaterial color="red" />
          </Box>
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[10, 2, 1]} position={[10, 1.5, 0]}>
            <meshBasicMaterial color="green" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 2, 1]} position={[20, 3.5, 0]}>
            <meshBasicMaterial color="green" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 2, 1]} position={[30, 6.5, 0]}>
            <meshBasicMaterial color="yellow" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 2, 1]} position={[40, 9.5, 0]}>
            <meshBasicMaterial color="yellow" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 2, 1]} position={[50, 13.5, 0]}>
            <meshBasicMaterial color="orange" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 2, 1]} position={[60, 17.5, 0]}>
            <meshBasicMaterial color="orange" />
          </Box>
        </RigidBody>
        <RigidBody type="fixed">
          <Box args={[10, 2, 1]} position={[70, 22.5, 0]}>
            <meshBasicMaterial color="red" />
          </Box>
        </RigidBody>

        {/* platforms up top */}

        <RigidBody type="fixed">
          <Box args={[4, 1, 1]} position={[11, 6, 0]} />
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[4, 1, 1]} position={[7, 7, 0]} />
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[4, 1, 1]} position={[3, 8, 0]} />
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[4, 1, 1]} position={[-1, 9, 0]} />
        </RigidBody>

        <RigidBody type="fixed">
          <Box args={[4, 1, 1]} position={[-5, 10, 0]} />
        </RigidBody>
      </Physics>
    </Canvas>
  );
}

export default App;
