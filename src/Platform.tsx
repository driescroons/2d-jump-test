import { Box } from "@react-three/drei";
import { RigidBody, RigidBodyProps } from "@react-three/rapier";
import { Vector3Tuple } from "three";

export default function Platform(props: RigidBodyProps & { color?: string }) {
  return (
    <RigidBody type="fixed" userData={{ type: "platform" }}>
      <Box args={props.args as Vector3Tuple} position={props.position}>
        <meshStandardMaterial color={props.color} />
      </Box>
    </RigidBody>
  );
}
