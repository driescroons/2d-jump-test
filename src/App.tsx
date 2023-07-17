import { Canvas } from "@react-three/fiber";
import { Physics } from "@react-three/rapier";
import { Leva } from "leva";
import Platform from "./Platform";
import Player from "./Player";
import Spike from "./Spike";

const hideLeva = import.meta.env.MODE !== "development";

function App() {
  return (
    <>
      <Leva collapsed={true} hidden={hideLeva} />
      <Canvas>
        <ambientLight />
        <pointLight position={[10, 10, 10]} />
        <Physics debug>
          <Player position={[0, 1, 0]} />

          {/* base */}
          <Platform args={[100, 1, 1]} position={[0, 0, 0]} />

          {/* left jumping blocks */}
          {[...Array(6)].map((_, i) => (
            <Platform
              args={[2, 1, 1]}
              position={[-5 - i * (3 + 0.5 * i), 1, 0]}
              color={i >= 4 ? "orange" : i >= 2 ? "yellow" : "green"}
            />
          ))}

          {/* wall jumping blocks */}
          {[...Array(6)].map((_, i) => (
            <>
              <Platform
                args={[1, 10, 1]}
                position={[2.5 + i / 2, 10 + 10 * i, 0]}
                color="grey"
              />
              <Platform
                args={[1, 10, 1]}
                position={[-2.5 - i / 2, 10 + 10 * i, 0]}
                color="grey"
              />
            </>
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[5, 1, 1]}
              position={[-10 - i * 6, 8 + i * 2, 0]}
              color="green"
            />
          ))}

          <Platform args={[1, 10, 1]} position={[-28, 18, 0]} />

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[5, 1, 1]}
              position={[-22 + i * 6, 18 + i * 3, 0]}
              color="yellow"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[5, 1, 1]}
              position={[-10 - i * 6, 29 + i * 4, 0]}
              color="orange"
            />
          ))}

          <Platform args={[1, 10, 1]} position={[-28, 40, 0]} />

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[5, 1, 1]}
              position={[-22 + i * 6, 43 + i * 5, 0]}
              color="red"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[2, 1, 1]}
              position={[7 + i * 5, 8 + i * 2, 0]}
              color="yellow"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[2, 1, 1]}
              position={[20 - i * 6, 17 + i * 2, 0]}
              color="yellow"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[2, 1, 1]}
              position={[10 + i * 6, 26 + i * 2.5, 0]}
              color="yellow"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[2, 1, 1]}
              position={[20 - i * 6, 35 + i * 2.5, 0]}
              color="yellow"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[2, 1, 1]}
              position={[10 + i * 6, 45 + i * 3, 0]}
              color="yellow"
            />
          ))}

          {[...Array(3)].map((_, i) => (
            <Platform
              args={[2, 1, 1]}
              position={[20 - i * 6.5, 55 + i * 3, 0]}
              color="yellow"
            />
          ))}

          {/* <Platform args={[3, 1, 1]} position={[-4, 2, 0]} color="green" />
          <Platform args={[3, 1, 1]} position={[-10, 3, 0]} color="yellow" />
          <Platform args={[1, 4, 1]} position={[-15, 2.5, 0]} color="orange" />
          <Platform args={[1, 5, 1]} position={[-20, 3, 0]} color="red" /> */}

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
        </Physics>
      </Canvas>
    </>
  );
}

export default App;
