import { useFrame, useThree } from "@react-three/fiber";
import {
  CapsuleCollider,
  RapierRigidBody,
  RigidBody,
  RigidBodyProps,
  vec3,
} from "@react-three/rapier";
import { button, useControls } from "leva";
import React, { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { lerp } from "three/src/math/MathUtils.js";

type PlayerState = "idle" | "running" | "jumping" | "falling";

export default function Player(props: RigidBodyProps) {
  const ref = useRef<RapierRigidBody>(null);
  const lastJumpedAt = useRef(Date.now());
  const [state, setState] = useState<PlayerState>("idle");
  const jumpReleased = useRef(true);

  const [movement, setMovement] = useState({
    left: false,
    right: false,
    jump: false,
  });

  const { maxJumpForce, speed, jumpDuration } = useControls({
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
      value: 2,
      min: 0,
      max: 100,
    },
    speed: {
      value: 5,
      min: 0,
      max: 10,
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
      if (e.code === "Space") {
        setMovement((m) => ({ ...m, jump: true }));
      }
    };

    const keyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyA") {
        setMovement((m) => ({ ...m, left: false }));
      }
      if (e.code === "KeyD") {
        setMovement((m) => ({ ...m, right: false }));
      }
      if (e.code === "Space") {
        jumpReleased.current = true;
        setMovement((m) => ({ ...m, jump: false }));
      }
    };

    window.addEventListener("keydown", keyDown);
    window.addEventListener("keyup", keyUp);

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
      if (Date.now() - lastJumpedAt.current > 100) {
        const diff = lerp(linvel.y, 0.2, jumpReleased.current ? 0.1 : 0.8);

        ref.current?.applyImpulse(new Vector3(0, -diff * correction, 0), true);
      }

      // const diff = (Date.now() - lastJumpedAt.current) / jumpDuration;

      // let jumpReduceBasedOnHold = jumpReduce;

      // if (jumpReleased.current) {
      //   jumpReduceBasedOnHold = jumpReduce * jumpHoldMultiplier;
      // }

      // console.log(jumpReduceBasedOnHold);
      // const newY = Math.pow(2, -jumpReduceBasedOnHold * diff);
      // // console.log(diff, newY);

      // ref.current?.applyImpulse(
      //   new Vector3(
      //     0,
      //     newY * maxJumpForce,
      //     // diff > 500 / 3 ? -1 + easing(diff) : 2 - easing(diff * 2),
      //     // newY,
      //     // 0.3, // this is the threshold to stay afloat
      //     0
      //   ),
      //   true
      // );
    }
    setState(newState);
  });

  return (
    <RigidBody
      {...props}
      ref={ref}
      lockRotations
      enabledTranslations={[true, true, false]}
    >
      <CapsuleCollider args={[0.25, 0.5]} density={2} />
      {/* <mesh>
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color="hotpink" />
      </mesh> */}
    </RigidBody>
  );
}
