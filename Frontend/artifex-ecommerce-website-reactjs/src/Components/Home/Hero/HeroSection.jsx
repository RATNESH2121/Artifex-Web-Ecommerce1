import React, { useState, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

import "./HeroSection.css";
import { Model } from "../../Model/Model";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const [tshirtColor, setTshirtColor] = useState("#c9a84c");

  const changeColor = (color) => {
    setTshirtColor(color);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const colors = [
    { hex: "#1a1a1a", label: "Noir" },
    { hex: "#c9a84c", label: "Gold" },
    { hex: "#4a5568", label: "Slate" },
    { hex: "#8b0000", label: "Burgundy" },
  ];

  return (
    <>
      <div className="heroMain">
        <div className="sectionleft">
          <p>New Collection 2025</p>
          <h1>
            Redefine
            <strong>Elegance</strong>
          </h1>
          <span>
            Curated fashion for the discerning individual — where craftsmanship meets contemporary design.
          </span>
          <div className="heroLink">
            <Link to="/shop" onClick={scrollToTop}>
              <h5>Explore Collection</h5>
            </Link>
          </div>
        </div>
        <div className="sectionright">
          <Canvas
            className="canvasModel"
            camera={{ position: [0, 5, 15], fov: 50 }}
          >
            <ambientLight intensity={0.3} />
            <directionalLight
              position={[10, 10, 5]}
              intensity={2.0}
              color={"#fff8e7"}
            />
            <directionalLight
              position={[-5, 5, -5]}
              intensity={0.5}
              color={"#c9a84c"}
            />

            <OrbitControls
              enableZoom={false}
              enablePan={false}
              minAzimuthAngle={-Infinity}
              maxAzimuthAngle={Infinity}
              maxPolarAngle={Math.PI / 2}
              minPolarAngle={Math.PI / 2}
              autoRotate
              autoRotateSpeed={1.5}
            />

            <Suspense fallback={null}>
              <Model color={tshirtColor} />
            </Suspense>
          </Canvas>
          <div className="heroColorBtn">
            {colors.map((c) => (
              <button
                key={c.hex}
                onClick={() => changeColor(c.hex)}
                className={tshirtColor === c.hex ? "selectedColor" : ""}
                style={{
                  backgroundColor: c.hex,
                }}
                title={c.label}
              />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default HeroSection;
