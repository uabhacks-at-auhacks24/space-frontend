import React, { Suspense, useState, useEffect } from "react";
import Dialog from "./Dialog";
import { Canvas, useFrame, useLoader } from "@react-three/fiber";
import { OrbitControls, Html } from "@react-three/drei";
import * as THREE from "three";
import planetData from "./planetData";
import sunTexture from "./textures/sun.jpg";
import "./styles.css";
import Header from "./components/Header/Header";
import Bottomer from "./components/Bottomer/Bottomer";
import dummyPlanetData from "./planetData";

import tx1 from "./textures/1.jpg";
import tx2 from "./textures/2.jpg";
import tx3 from "./textures/3.jpg";
import tx4 from "./textures/4.jpg";
import tx5 from "./textures/5.jpg";
import tx6 from "./textures/6.jpg";

const totalPlanets = 6;

const random = (a, b) => a + Math.random() * b;
const randomInt = (a, b) => Math.floor(random(a, b));
const randomColor = () =>
  `rgb(${randomInt(80, 50)}, ${randomInt(80, 50)}, ${randomInt(80, 50)})`;

const shuffle = (a) => {
  const temp = a.slice(0);
  for (let i = temp.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [temp[i], temp[j]] = [temp[j], temp[i]];
  }
  return temp;
};

const textures = shuffle([tx1, tx2, tx3, tx4, tx5, tx6]);

export default function App() {
  const [isAnimating, setIsAnimating] = useState(true);
  const [dialogData, setDialogData] = useState(null);
  const [planetData, setPlanetData] = useState([]);

  useEffect(() => {
    console.log("Planet data has changed:", planetData);

    // Any additional logic you want to run when planetData changes
  }, [planetData]);

  const hideDialog = () => {
    setDialogData(null);
    setIsAnimating(true);
  };

  const handleSearch = async (spotifyLink) => {
    console.log("handle search called");
    console.log("spotifyURL: ", spotifyLink);

    try {
      const response = await fetch(`http://localhost:8000/spotify/test`);
      const json = await response.json();
      console.log("response: ", json);
      setPlanetData(json.items);
      console.log("State Planet Variable", { planetData });

      // Process your response data here
    } catch (error) {
      console.error("Error fetching data: ", error);
      // Handle error here
    }
  };

  if (planetData) {
    return (
      <>
        <Header></Header>
        <Dialog hideDialog={hideDialog} dialogData={dialogData} />
        <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
          <Suspense fallback={null}>
            <Sun />
            {planetData.map((planet) => (
              <Planet
                planet={planet}
                key={planet.id}
                setDialogData={setDialogData}
                isAnimating={isAnimating}
                setIsAnimating={setIsAnimating}
              />
            ))}
            <Lights />
            <OrbitControls />
          </Suspense>
        </Canvas>
        <Bottomer handleSearch={handleSearch}></Bottomer>
      </>
    );
  } else {
    return (
      <>
        <Header></Header>
        <Dialog hideDialog={hideDialog} dialogData={dialogData} />
        <Canvas camera={{ position: [0, 20, 25], fov: 45 }}>
          <Suspense fallback={null}>
            <Sun />

            <Lights />
            <OrbitControls />
          </Suspense>
        </Canvas>
        <Bottomer handleSearch={handleSearch}></Bottomer>
      </>
    );
  }
}
function Sun() {
  const texture = useLoader(THREE.TextureLoader, sunTexture);
  return (
    <mesh>
      <sphereGeometry args={[2.5, 32, 32]} />
      <meshStandardMaterial map={texture} />
    </mesh>
  );
}
function Planet({
  planet: {
    color,
    xRadius,
    zRadius,
    size,
    speed,
    offset,
    rotationSpeed,
    textureMap,
    name,
    gravity,
    orbitalPeriod,
    surfaceArea,
  },
  setDialogData,
  isAnimating,
  setIsAnimating,
}) {
  const planetRef = React.useRef();

  console.log("textureMap: ", textureMap);
  const imageBlob = textureMap.blob();
  console.log("imageBlob", imageBlob);
  const imageObjectUrl = URL.createObjectURL(imageBlob);
  console.log("imageObjectUrl", imageObjectUrl);
  console.log("type of ObjectUrl", typeof imageObjectUrl);
  const texture = useLoader(THREE.TextureLoader, imageObjectUrl);

  //const texture = useLoader(THREE.TextureLoader, tx1); //HARDCODED TEXTURE
  useFrame(({ clock }) => {
    if (isAnimating) {
      const t = clock.getElapsedTime() * speed + offset;
      const x = xRadius * Math.sin(t);
      const z = xRadius * Math.cos(t);
      planetRef.current.position.x = x;
      planetRef.current.position.z = z;
      planetRef.current.rotation.y += rotationSpeed;
    }
  });

  const handlePlanetClick = () => {
    setIsAnimating(false);
    setDialogData({ name, gravity, orbitalPeriod, surfaceArea });
  };

  const hitboxSize = size * 1000;

  return (
    <>
      <mesh ref={planetRef} onClick={handlePlanetClick}>
        <sphereGeometry args={[size, 32, 32]} />
        <meshStandardMaterial map={texture} />
        <Html distanceFactor={15}>
          <div className="annotation">{name}</div>
        </Html>
      </mesh>
      {/* making the hitbox bigger */}
      <mesh
        position={planetRef.current ? planetRef.current.position : [0, 0, 0]}
        onClick={handlePlanetClick}
        visible={false} // Make the hitbox invisible
      >
        <sphereGeometry args={[hitboxSize, 32, 32]} />
        <meshStandardMaterial opacity={0} transparent />
      </mesh>
      <Ecliptic xRadius={xRadius} zRadius={zRadius} />
    </>
  );
}

function Lights() {
  return (
    <>
      <ambientLight />
      <pointLight position={[0, 0, 0]} />
    </>
  );
}

function Ecliptic({ xRadius = 1, zRadius = 1 }) {
  const points = [];
  for (let index = 0; index < 64; index++) {
    const angle = (index / 64) * 2 * Math.PI;
    const x = xRadius * Math.cos(angle);
    const z = xRadius * Math.sin(angle);
    points.push(new THREE.Vector3(x, 0, z));
  }

  points.push(points[0]);

  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  return (
    <line geometry={lineGeometry}>
      <lineBasicMaterial attach="material" color="#393e46" linewidth={10} />
    </line>
  );
}
