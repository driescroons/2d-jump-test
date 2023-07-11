import { RigidBody, RigidBodyProps } from "@react-three/rapier";

export default function Spike(props: RigidBodyProps) {
  return (
    <RigidBody type="fixed" colliders="hull" {...props}>
      <mesh>
        <coneGeometry args={[0.5, 1, 10]} />
        <meshStandardMaterial color="red" />
      </mesh>
    </RigidBody>
  );
}
