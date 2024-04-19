  import React, { useEffect, useLayoutEffect, useState } from "react";
import rough from "roughjs/bundled/rough.esm";

const generator = rough.generator();

const Canvas = ({
  canvasRef,
  ctx,
  color,
  setElements,
  elements,
  tool,
  socket,
}) => {
  const [isDrawing, setIsDrawing] = useState(false);

  const handleMouseDown = (e) => {
    // Getting the mouse coordinates from the event
    const { offsetX, offsetY } = e.nativeEvent;

    // Checking the current tool
    if (tool === "pencil") {
      // If the tool is a pencil, add a new element to the elements array
      setElements((prevElements) => [
        ...prevElements,
        {
          offsetX,
          offsetY,
          path: [[offsetX, offsetY]],
          stroke: color,
          element: tool,
        },
      ]);
    } else {
      // If the tool is not a pencil, add a new element to the elements array
      setElements((prevElements) => [
        ...prevElements,
        { offsetX, offsetY, stroke: color, element: tool },
      ]);
    }

    // Set the isDrawing state to true
    setIsDrawing(true);
  };

  const handleMouseMove = (e) => {
    // If the user is not drawing, return early
    if (!isDrawing) {
      return;
    }
    // Getting the mouse coordinates from the event
    const { offsetX, offsetY } = e.nativeEvent;

    if (tool === "rect") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX - ele.offsetX,
                height: offsetY - ele.offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (tool === "line") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                width: offsetX,
                height: offsetY,
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    } else if (tool === "pencil") {
      setElements((prevElements) =>
        prevElements.map((ele, index) =>
          index === elements.length - 1
            ? {
                offsetX: ele.offsetX,
                offsetY: ele.offsetY,
                path: [...ele.path, [offsetX, offsetY]],
                stroke: ele.stroke,
                element: ele.element,
              }
            : ele
        )
      );
    }
  };
  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  // This useEffect hook is used for setting up the canvas and context when the component mounts
  useEffect(() => {
    // Get a reference to the canvas element
    const canvas = canvasRef.current;
    // Set the canvas dimensions to be twice the window's inner dimensions
    // This is done to handle high DPI displays (retina displays)
    canvas.height = window.innerHeight * 2;
    canvas.width = window.innerWidth * 2;
    // Set the canvas style dimensions to be the window's inner dimensions
    // This scales the canvas back down to the correct size for CSS pixels
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;
    // Get the 2D rendering context for the canvas
    const context = canvas.getContext("2d");

    // Set up the context properties
    // The stroke width is set to 5
    context.strokeWidth = 5;
    // The context is scaled by a factor of 2
    // This is done to counteract the earlier scaling of the canvas
    context.scale(2, 2);
    // The lineCap property is set to 'round' to create rounded corners
    context.lineCap = "round";
    // The strokeStyle property is set to the current color
    context.strokeStyle = color;
    // The lineWidth property is set to 5
    context.lineWidth = 5;
    // The context is stored in a ref
    // This allows the context to be accessed elsewhere in the component
    ctx.current = context;
  }, []);

  // This useEffect hook is used for updating the stroke color when the color state variable changes
  useEffect(() => {
    // The strokeStyle property of the context is updated to the new color
    ctx.current.strokeStyle = color;
  }, [color]);

  // The useLayoutEffect hook is similar to useEffect, but it fires synchronously after all DOM mutations
  // This makes it perfect for reading layout from the DOM and synchronously re-rendering
  useLayoutEffect(() => {
    // Create a rough canvas using the canvas reference
    const roughCanvas = rough.canvas(canvasRef.current);
    // If there are elements to draw, clear the canvas first
    if (elements.length > 0) {
      ctx.current.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    }
    // Loop through each element and draw it on the canvas
    elements.forEach((ele, i) => {
      // Check the type of the element and draw accordingly
      if (ele.element === "rect") {
        // Draw a rectangle using the rough.js generator
        roughCanvas.draw(
          generator.rectangle(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "line") {
        // Draw a line using the rough.js generator
        roughCanvas.draw(
          generator.line(ele.offsetX, ele.offsetY, ele.width, ele.height, {
            stroke: ele.stroke,
            roughness: 0,
            strokeWidth: 5,
          })
        );
      } else if (ele.element === "pencil") {
        // Draw a path using the rough.js generator
        roughCanvas.linearPath(ele.path, {
          stroke: ele.stroke,
          roughness: 0,
          strokeWidth: 5,
        });
      }
    });
    // Convert the canvas to a data URL
    const canvasImage = canvasRef.current.toDataURL();
    // Emit a drawing event with the data URL of the canvas image
    socket.emit("drawing", canvasImage);
    // The dependency array includes 'elements' to ensure the effect runs whenever the elements change
  }, [elements]);

  return (
    <div
      className="col-md-8 overflow-hidden border border-dark px-0 mx-auto mt-3"
      style={{ height: "500px" }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default Canvas;
