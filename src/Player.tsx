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
      value: 200,
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
    const correction = delta / (1 / 60);
    const linvel = ref.current?.linvel() ?? vec3();

    let horizontalMovement = Number(movement.right) - Number(movement.left);
    let newState = state;

    const collisions = Object.values(collisionMap.current);

    isTouchingFloor.current = collisions.some((c) => {
      if (c.normal.y === -1) {
        return true;
      }
    });

    isTouchingRight.current = collisions.some((c) => {
      if (c.normal.x === 1) {
        return true;
      }
    });

    isTouchingLeft.current = collisions.some((c) => {
      if (c.normal.x === -1) {
        return true;
      }
    });

    isTouchingWall.current = isTouchingLeft.current || isTouchingRight.current;

    if (
      isTouchingFloor.current &&
      lastJumpedAt.current + jumpDuration < Date.now()
    ) {
      jumpsLeft.current = 2;
    }

    if (horizontalMovement !== 0) {
      if (
        (horizontalMovement > 0 && isTouchingRight.current) ||
        (horizontalMovement < 0 && isTouchingLeft.current)
      ) {
        horizontalMovement = 0;
      }

      ref.current?.setLinvel(
        vec3({ ...linvel, x: horizontalMovement * speed }),
        true
      );
    } else {
      ref.current?.setLinvel(vec3({ ...linvel, x: 0 }), true);
    }

    // reenable when we have isGrounded logic
    if (linvel.y < 0) {
      if (!isTouchingWall.current) {
        newState = "falling";
        ref.current?.applyImpulse(
          new Vector3(0, (-speed / 10) * correction, 0),
          true
        );
      } else {
        newState = "sliding";
      }
    }

    if (jumpsLeft.current > 0 && movement.jump && jumpReleased.current) {
      jumpReleased.current = false;
      lastJumpedAt.current = Date.now();
      newState = "jumping";
      ref.current?.setLinvel(vec3({ ...linvel, y: 0 }), true);
      ref.current?.applyImpulse(new Vector3(0, maxJumpForce, 0), true);
      jumpsLeft.current--;
    }

    if (newState === "jumping") {
      if (Date.now() - lastJumpedAt.current > 50) {
        const diff = lerp(
          linvel.y,
          0,
          jumpReleased.current ? minScaleReducer : maxScaleReducer
        );

        ref.current?.applyImpulse(new Vector3(0, -diff * correction, 0), true);
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
