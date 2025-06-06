/* eslint-disable no-const-assign */
import React, { useRef, useState, useEffect } from "react";

const PlanCanvas = ({
  ptHeight,
  ptWidth,
  // eslint-disable-next-line no-unused-vars
  pxHeight,
  pxWidth,
  dpi,
  imageSource,
  elements,
  selectedIndex,
  style,
  isAiResult,
}) => {
  const canvasRef = useRef(null);
  const divRef = useRef(null);

  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);

  // calculate and set the size of canvas
  const updateCanvasSize = () => {
    if (!divRef.current) return;
    const elWidth = divRef.current.offsetWidth;
    setCanvasWidth(elWidth);
   	if (ptHeight != 0 && ptWidth != 0) {  
        setCanvasHeight(elWidth * (ptHeight / ptWidth)); 
     } 
     else{
        setCanvasHeight(elWidth * (pxHeight / pxWidth));
     }
   
  };

  // listen to window resize event to update canvas size
	// calculate once when component mounts
	// and whenever ptHeight or ptWidth changes
  useEffect(() => {
    updateCanvasSize(); // initial size calculation

    window.addEventListener("resize", updateCanvasSize);
    return () => window.removeEventListener("resize", updateCanvasSize);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ptHeight, ptWidth, pxHeight, pxWidth]);

  //listen to pxHeight and pxWidth changes to update canvas size
  useEffect(() => {
    if (!imageSource) return;
    const canvasEl = canvasRef.current;
    if (!canvasEl) return;

    const ctx = canvasEl.getContext("2d");
    ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
    ctx.imageSmoothingEnabled = false;

    const img = new Image();
    img.onload = () => {
      // set canvas size based on image dimensions and redraw the image
      ctx.clearRect(0, 0, canvasEl.width, canvasEl.height);
      ctx.drawImage(img, 0, 0, canvasEl.width, canvasEl.height);
			if (elements && elements.length > 0 && selectedIndex >= 0) {
          let factor = 1;
        	if (ptHeight != 0 && ptWidth != 0) {            
            factor = dpi / 72 * canvasEl.offsetWidth / pxWidth; // convert pt to px based on dpi and canvas width                
          }
          else{
            factor = canvasEl.offsetWidth / pxWidth;
          }
          const selectedElement = elements[selectedIndex];
            if (selectedElement) {
              console.log("Drawing selected element:", selectedElement);
              if (isAiResult) {
                const cx = (selectedElement.cx - selectedElement.width / 2) * factor;
                const cy = (selectedElement.cy - selectedElement.height / 2) * factor;
                const w = selectedElement.width * factor;
                const h = selectedElement.height * factor;
                ctx.fillStyle = 'rgba(255, 0, 0, 0.3)'; // R,G,B,Alpha
                ctx.fillRect(cx, cy, w, h); // x, y, width, height
                ctx.strokeStyle = 'rgb(255, 0, 0)';
                ctx.lineWidth = 2;
                ctx.strokeRect(cx, cy, w, h);
              } else {
                if(selectedElement.type === "l"){
                  ctx.beginPath();
                  ctx.moveTo(selectedElement.x1 * factor, selectedElement.y1 * factor);
                  ctx.lineTo(selectedElement.x2 * factor, selectedElement.y2 * factor);
                  ctx.strokeStyle = "red";
                  ctx.lineWidth = 2 * factor;
                  ctx.stroke(); 
                }
                if(selectedElement.type==='c'){
                  ctx.beginPath();
                  ctx.strokeStyle = "red";
                  ctx.lineWidth = 2 * factor;
                  ctx.moveTo(selectedElement.x0 * factor, selectedElement.y0 * factor);
                  ctx.bezierCurveTo(
                    selectedElement.x1 * factor,
                    selectedElement.y1 * factor,
                    selectedElement.x2 * factor,
                    selectedElement.y2 * factor,
                    selectedElement.x3 * factor,
                    selectedElement.y3 * factor);
                  ctx.stroke(); 
                }
              }
            } 



			}
    };
    img.src = imageSource;
  }, [imageSource, canvasWidth, canvasHeight, selectedIndex, elements, dpi, pxWidth, isAiResult]);

  return (
    <div ref={divRef} style={{ ...style }}>
      <canvas
        width={canvasWidth}
        height={canvasHeight}
        style={{
          width: canvasWidth + "px",
          height: canvasHeight + "px",
          imageRendering: "pixelated",
        }}
        ref={canvasRef}
      ></canvas>
    </div>
  );
};

export default PlanCanvas;