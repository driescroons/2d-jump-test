import { extend, useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import CameraControls from "camera-controls";
import { button, useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import * as THREE from "three";
import { lerp } from "three/src/math/MathUtils.js";

type PlayerState = "idle" | "running" | "jumping" | "falling";

CameraControls.install({ THREE });
extend({ CameraControls });

export default function Player(props: RigidBodyProps) {
  const { gl, camera } = useThree();
  const controlsRef = useRef<CameraControls>(null);
  const ref = useRef<RapierRigidBody>(null);
  const lastJumpedAt = useRef(Date.now());
  const [state, setState] = useState<PlayerState>("idle");
  const jumpReleased = useRef(true);

  const [movement, setMovement] = useState({
    left: false,
    right: false,
    jump: false,
  });

  const { maxJumpForce, speed, jumpDuration, cameraSensitivity } = useControls({
    "Reset player": button(() => {
      ref.current?.setTranslation(new Vector3(0, 5, 0), true);
      ref.current?.setLinvel(new Vector3(0, 0, 0), true);
    }),
    jumpDuration: {
      value: 500,
      min: 0,
      max: 1000,
    },
    maxJumpForce: {
      value: 32,
      min: 0,
      max: 100,
    },
    speed: {
      value: 5,
      min: 0,
      max: 10,
    },
    cameraSensitivity: {
      value: 0.5,
      min: 0,
      max: 1,
    },
  });

  useEffect(() => {
    console.log(state);
  }, [state]);

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      console.log(e.code);
      if (e.code === "KeyA") {
        setMovement((m) => ({ ...m, left: true }));
      }
      if (e.code === "KeyD") {
        setMovement((m) => ({ ...m, right: true }));
      }
    };

    const keyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyA") {
        setMovement((m) => ({ ...m, left: false }));
      }
      if (e.code === "KeyD") {
        setMovement((m) => ({ ...m, right: false }));
      }
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

    const pointerDown = (_: PointerEvent) => {
      setMovement((m) => ({ ...m, jump: true }));
    };

    const pointerUp = (_: PointerEvent) => {
      jumpReleased.current = true;
      setMovement((m) => ({ ...m, jump: false }));
    };

    window.addEventListener("pointerdown", pointerDown);
    window.addEventListener("pointerup", pointerUp);

    return () => {
      window.removeEventListener("keydown", keyDown);
      window.removeEventListener("keyup", keyUp);
    };
  }, []);

  useFrame((_, delta) => {
    const correction = 1 / 60 / delta;
    const linvel = ref.current?.linvel() ?? vec3();

    const horizontalMovement = Number(movement.right) - Number(movement.left);
    let newState = state;

    if (horizontalMovement !== 0) {
      // const impulse = horizontalMovement * speed - linvel.x;
      // ref.current?.applyImpulse(new Vector3(impulse, 0, 0), true);
      ref.current?.setLinvel(
        vec3({ ...linvel, x: horizontalMovement * speed }),
        true
      );
    } else {
      ref.current?.setLinvel(vec3({ ...linvel, x: 0 }), true);
    }

    // reenable when we have isGrounded logic
    if (linvel.y < 0) {
      newState = "falling";
      ref.current?.applyImpulse(new Vector3(0, -speed / 10, 0), true);
    }

    if (
      movement.jump &&
      lastJumpedAt.current + jumpDuration < Date.now() &&
      jumpReleased.current
    ) {
      jumpReleased.current = false;
      lastJumpedAt.current = Date.now();
      newState = "jumping";
      ref.current?.applyImpulse(new Vector3(0, maxJumpForce, 0), true);
    }

    if (
      newState === "jumping" &&
      Date.now() - lastJumpedAt.current < jumpDuration
    ) {
      if (Date.now() - lastJumpedAt.current > 50) {
        const diff = lerp(linvel.y, 0, jumpReleased.current ? 0.5 : 0.9);

        ref.current?.applyImpulse(new Vector3(0, -diff * correction, 0), true);
      }
    }
    setState(newState);

    const cameraPosition = camera.getWorldPosition(new Vector3());
    const playerPosition = ref?.current?.translation();

    const newPosition = new Vector3().lerpVectors(
      cameraPosition,
      vec3(playerPosition).add(new Vector3(0, 0, 10)),
      cameraSensitivity
    );

    void controlsRef.current?.setLookAt(
      ...newPosition.toArray(),
      ...vec3(playerPosition).toArray(),
      true
    );

    controlsRef.current!.update(delta);
  });

  return (
    <>
      {/* @ts-ignore */}
      <cameraControls ref={controlsRef} args={[camera, gl.domElement]} />
      <RigidBody
        {...props}
        ref={ref}
        lockRotations
        enabledTranslations={[true, true, false]}
      >
        <CapsuleCollider args={[0.25, 0.5]} density={2} />
      </RigidBody>
    </>
  );
}
