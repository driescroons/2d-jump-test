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

type PlayerState = "idle" | "running" | "jumping" | "falling" | "sliding";

CameraControls.install({ THREE });
extend({ CameraControls });

export default function Player(props: RigidBodyProps) {
  const { gl, camera } = useThree();
  const controlsRef = useRef<CameraControls>(null);
  const ref = useRef<RapierRigidBody>(null);
  const lastJumpedAt = useRef(Date.now());
  const [state, setState] = useState<PlayerState>("idle");
  const jumpReleased = useRef(true);
  const jumpsLeft = useRef(0);

  const isTouchingFloor = useRef(false);
  const isTouchingWall = useRef(false);
  const isTouchingLeft = useRef(false);
  const isTouchingRight = useRef(false);

  const jumpAngle = useRef(0);

  const collisionMap = useRef<Record<string, { normal: Vector3; other: any }>>(
    {}
  );

  const [movement, setMovement] = useState({
    left: false,
    right: false,
    jump: false,
  });

  const {
    maxJumpForce,
    speed,
    jumpDuration,
    cameraSensitivity,
    cameraDistance,
    maxScaleReducer,
    minScaleReducer,
  } = useControls({
    "Reset player": button(() => {
      ref.current?.setTranslation(new Vector3(0, 5, 0), true);
      ref.current?.setLinvel(new Vector3(0, 0, 0), true);
    }),
    cameraDistance: {
      value: 20,
      min: 5,
      max: 100,
    },
    jumpDuration: {
      value: 300,
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
    minScaleReducer: {
      value: 0.5,
      min: 0,
      max: 1,
    },
    maxScaleReducer: {
      value: 0.9,
      min: 0,
      max: 1,
    },
  });

  useEffect(() => {
    const keyDown = (e: KeyboardEvent) => {
      if (e.code === "KeyA" || e.code === "ArrowLeft") {
        setMovement((m) => ({ ...m, left: true }));
      }
      if (e.code === "KeyD" || e.code === "ArrowRight") {
        setMovement((m) => ({ ...m, right: true }));
      }
      if (e.code === "Space" || e.code === "ArrowUp") {
        setMovement((m) => ({ ...m, jump: true }));
      }
    };

    const keyUp = (e: KeyboardEvent) => {
      if (e.code === "KeyA" || e.code === "ArrowLeft") {
        setMovement((m) => ({ ...m, left: false }));
      }
      if (e.code === "KeyD" || e.code === "ArrowRight") {
        setMovement((m) => ({ ...m, right: false }));
      }
      if (e.code === "Space" || e.code === "ArrowUp") {
        jumpReleased.current = true;
        setMovement((m) => ({ ...m, jump: false }));
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
      window.removeEventListener("pointerdown", pointerDown);
      window.removeEventListener("pointerup", pointerUp);
    };
  }, []);

  useFrame((_, delta) => {
    const correction = delta / (1 / 60);
    const linvel = ref.current?.linvel() ?? vec3();

    let horizontalMovement = Number(movement.right) - Number(movement.left);
    let newState = state;

    const collisions = Object.values(collisionMap.current);

    isTouchingFloor.current = collisions.some((c) => {
      // console.log(c.normal.y);
      if (c.normal.y < -0.8) {
        return true;
      }
    });

    isTouchingRight.current = collisions.some((c) => {
      if (c.normal.x > 0.8) {
        return true;
      }
    });

    isTouchingLeft.current = collisions.some((c) => {
      if (c.normal.x < -0.8) {
        return true;
      }
    });

    isTouchingWall.current = isTouchingLeft.current || isTouchingRight.current;

    // console.log(jumpAngle.current);

    if (newState === "running") {
      let newLinvelX = 0;
      if (horizontalMovement !== 0) {
        newLinvelX = horizontalMovement * speed;
      } else {
        newLinvelX = lerp(linvel.x, 0, 0.5);
      }
      ref.current?.setLinvel(vec3({ ...linvel, x: newLinvelX }), true);
    }

    // else if (newState === "falling" || newState === "jumping") {
    //   if (horizontalMovement !== 0) {
    //     // const jumpMoveModifier = Math.min(
    //     //   ((Date.now() - lastJumpedAt.current) / jumpDuration) * 2,
    //     //   1
    //     // );
    //     // newLinvelX = lerp(
    //     //   linvel.x,
    //     //   jumpMoveModifa * horizontalMovement * speed,
    //     //   0.01
    //     // );
    //     // console.log(newLinvelX);
    //     // ref.current?.setLinvel(vec3({ ...linvel, x: newLinvelX }), true);
    //   } else {
    //     // newLinvelX = lerp(linvel.x, 0, 0.01);
    //   }
    // }

    // ----------------------------

    // if (newState !== "jumping" && newState !== "falling") {

    // if (
    //   (horizontalMovement > 0 && isTouchingRight.current) ||
    //   (horizontalMovement < 0 && isTouchingLeft.current)
    // ) {
    //   horizontalMovement = 0;
    // }

    // newLinvelX = horizontalMovement * speed;
    // } else {
    // if (newState === "running") {

    // ref.current?.setLinvel(vec3({ ...linvel, x: newLinvelX * 1 }), true);
    // }
    // else if (
    //   (newState === "falling" || newState === "jumping") &&
    //   Math.abs(linvel.x) > 0.5
    // ) {
    //   const jumpMoveModifier = Math.min(
    //     (Date.now() - lastJumpedAt.current) / jumpDuration,
    //     1
    //   );
    //   newLinvelX = lerp(
    //     linvel.x,
    //     jumpAngle.current > 0 ? -speed : speed,
    //     jumpMoveModifier
    //     // *
    //     // jumpMoveModifier *
    //     // jumpMoveModifier *
    //     // jumpMoveModifier
    //   );
    // }
    // }

    // console.log(newLinvelX);

    // } else {
    //   // // lerp to direction you're facing
    //   // const newLinvelX = lerp(linvel.x, horizontalMovement * speed, 0.1);
    //   // ref.current?.setLinvel(vec3({ ...linvel, x: newLinvelX * 1 }), true);
    // }

    // const jumpMoveModifier = Math.min();

    // reenable when we have isGrounded logic
    if (!isTouchingFloor.current && !isTouchingWall.current) {
      if (linvel.y < 0) {
        newState = "falling";
        ref.current?.applyImpulse(
          new Vector3(0, (-speed / 10) * correction, 0),
          true
        );
      } else {
        newState = "jumping";
      }
    }
    //  else if (linvel.y > 0) {
    //   newState = "jumping";
    // }

    if (!isTouchingFloor.current && isTouchingWall.current) {
      newState = "sliding";
      jumpsLeft.current = 2;
    }

    if (
      isTouchingFloor.current &&
      // we need this, otherwise after the jump it could still be that we're still collding with a platform and get put back into the running state
      lastJumpedAt.current + jumpDuration < Date.now()
    ) {
      newState = "running";
      jumpsLeft.current = 2;
    }

    if (
      jumpsLeft.current > 0 &&
      movement.jump &&
      jumpReleased.current &&
      lastJumpedAt.current + jumpDuration < Date.now()
    ) {
      jumpReleased.current = false;
      lastJumpedAt.current = Date.now();
      newState = "jumping";
      ref.current?.setLinvel(vec3({ ...linvel, y: 0 }), true);

      const rotatedImpulse = new Vector3(0, maxJumpForce, 0);

      if (isTouchingWall.current) {
        jumpAngle.current = isTouchingLeft.current ? -Math.PI / 5 : Math.PI / 5;
        rotatedImpulse.applyAxisAngle(new Vector3(0, 0, 1), jumpAngle.current);
      } else {
        jumpAngle.current = 0;
      }

      console.log(rotatedImpulse, isTouchingWall.current);

      ref.current?.applyImpulse(rotatedImpulse, true);
      jumpsLeft.current--;
    }

    // console.log(newState);

    if (newState === "jumping") {
      if (Date.now() - lastJumpedAt.current > 50) {
        const diff = lerp(
          linvel.y,
          0,
          jumpReleased.current ? minScaleReducer : maxScaleReducer
        );
        const rotatedImpulse = new Vector3(0, -diff * correction, 0);
        rotatedImpulse.applyAxisAngle(new Vector3(0, 0, 1), jumpAngle.current);
        console.log(rotatedImpulse);
        ref.current?.applyImpulse(rotatedImpulse, true);
      }
    }

    setState(newState);

    const cameraPosition = camera.getWorldPosition(new Vector3());
    const playerPosition = ref?.current?.translation();

    const newPosition = new Vector3().lerpVectors(
      cameraPosition,
      vec3(playerPosition).add(new Vector3(0, 0, cameraDistance)),
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
        restitution={0}
        ref={ref}
        lockRotations
        onCollisionEnter={(e) => {
          if ((e.other.rigidBody?.userData as any).type === "platform") {
            collisionMap.current[e.other.collider.handle] = {
              normal: vec3(e.manifold.normal()),
              other: e.other,
            };
          }
        }}
        onCollisionExit={(e) => {
          if ((e.other.rigidBody?.userData as any).type === "platform") {
            delete collisionMap.current[e.other.collider.handle];
          }
        }}
        enabledTranslations={[true, true, false]}
      >
        <CapsuleCollider args={[0.25, 0.5]} density={2} />
      </RigidBody>
    </>
  );
}
