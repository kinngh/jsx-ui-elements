// Inspired by Creative South's work, which inspired Rach Smith to write the article on Title Effect
// https://rachsmith.com/recreating-creative-south-title/

import React, { useEffect, useRef } from "react";

const WavesComponent = (props) => {
  const containerRef = useRef(null);

  useEffect(() => {
    const mouse = newV2();
    const center = newV2();
    const distanceFromCenter = newV2();
    const distanceLerped = newV2();
    let simulateMouseMovement = true;

    const perspective = 500;
    const translateZ = -12;
    const rotate = 3;
    const skew = 3;

    const container = containerRef.current;
    const copies = container.getElementsByClassName("copy");

    function updateCenter() {
      const rect = container.getBoundingClientRect();
      center.x = rect.left + rect.width / 2;
      center.y = rect.top + rect.height / 2;
    }

    function trackMousePosition(event) {
      simulateMouseMovement = false;
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      distanceFromCenter.x = center.x - mouse.x;
      distanceFromCenter.y = center.y - mouse.y;
    }

    function fakeMousePosition(t) {
      distanceFromCenter.x = Math.sin(t / 500) * window.innerWidth * 0.5;
      distanceFromCenter.y = Math.cos(t / 500) * window.innerWidth * 0.2;
    }

    function updateTextPosition(t) {
      if (simulateMouseMovement) fakeMousePosition(t);

      lerpV2(distanceLerped, distanceFromCenter);

      for (var i = 1; i < copies.length + 1; i++) {
        const copy = copies[i - 1];
        copy.style.transform = makeTransformString(
          i * distanceLerped.y * 0.03,
          i * translateZ,
          i * rotate * (distanceLerped.x * 0.003),
          i * skew * (distanceLerped.x * 0.003)
        );
      }

      requestAnimationFrame(updateTextPosition);
    }

    function makeTransformString(y, z, rotate, skew) {
      return `perspective(${perspective}px) translate3d(0px, ${y}px, ${z}px) rotate(${rotate}deg) skew(${skew}deg)`;
    }

    function lerpV2(position, targetPosition) {
      position.x += (targetPosition.x - position.x) * 0.2;
      position.y += (targetPosition.y - position.y) * 0.2;
    }

    function newV2(x = 0, y = 0) {
      return {
        x: x,
        y: y,
      };
    }

    updateCenter();
    document.addEventListener("mousemove", trackMousePosition);
    window.addEventListener("resize", updateCenter);
    requestAnimationFrame(updateTextPosition);

    return () => {
      document.removeEventListener("mousemove", trackMousePosition);
      window.removeEventListener("resize", updateCenter);
    };
  }, []);

  return (
    <div
      className="container flex items-center justify-center h-screen"
      ref={containerRef}
      id="container"
    >
      <header className="block relative w-[55vw] h-[20vw]">
        <h1
          className="text-[20vw] block absolute top-0 left-0 leading-none h-[20vw] m-0 p-0"
          style={{
            // fontFamily: "'Lilita One', cursive",
            zIndex: 50,
            textShadow:
              "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
          }}
        >
          {props.displayText}
        </h1>
        {["#f24c00", "#9792e3", "#fc7a1e", "#eda96d"].map((color, index) => (
          <span
            key={index}
            aria-hidden="true"
            className={`copy text-[20vw] block absolute top-0 left-0 leading-none h-[20vw] m-0 p-0`}
            style={{
              //   fontFamily: "'Lilita One', cursive",
              zIndex: 50 - (index + 1) * 10,
              color: color,
              textShadow:
                "-2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000",
            }}
          >
            {props.displayText}
          </span>
        ))}
      </header>
    </div>
  );
};

export default WavesComponent;
