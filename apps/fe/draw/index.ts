import axios from "axios";
import { HTTP_BACKEND } from "@/config";
type Shape =
  | {
      type: "rect";
      x: number;
      y: number;
      width: number;
      height: number;
    }
  | {
      type: "circle";
      centerX: number;
      centerY: number;
      radius: number;
    }
  | {
      type: "line";
      x: number;
      y: number;
    };
export async function draw(
  canvas: HTMLCanvasElement,
  roomId: string,
  socket: WebSocket,
) {
  const ctx = canvas.getContext("2d");
  let existingShapes: Shape[] = await getExistingShapes(roomId);
  if (!ctx) {
    return;
  }
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    if (message.type == "chat") {
      const parsedShape = JSON.parse(message.message);
      existingShapes.push(parsedShape);
      clearCanvas(existingShapes, canvas, ctx);
    }
  };
  clearCanvas(existingShapes, canvas, ctx);
  let clicked = false;
  let spaceX = 0;
  let spaceY = 0;
  canvas.addEventListener("mousedown", (e) => {
    clicked = true;
    spaceX = Number(e.clientX);
    spaceY = Number(e.clientY);
  });
  canvas.addEventListener("mouseup", (e) => {
    clicked = false;
    let width = e.clientX - spaceX;
    let height = e.clientY - spaceY;
    const shape: Shape = {
      type: "rect",
      x: spaceX,
      y: spaceY,
      height,
      width,
    };
    socket.send(
      JSON.stringify({
        type: "chat",
        message: JSON.stringify(shape),
        roomId,
      }),
    );
  });
  canvas.addEventListener("mousemove", (e) => {
    if (clicked) {
      let width = e.clientX - spaceX;
      let height = e.clientY - spaceY;
      ctx.strokeStyle = "rgba(255,255,255)";
      clearCanvas(existingShapes, canvas, ctx);
      ctx.strokeRect(spaceX, spaceY, width, height);
    }
  });
  function clearCanvas(
    existingShapes: Shape[],
    canvas: HTMLCanvasElement,
    ctx: CanvasRenderingContext2D,
  ) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0,0,0)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    existingShapes.map((shape) => {
      if (shape.type == "rect") {
        ctx.strokeStyle = "rgba(255,255,255)";
        ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
      }
    });
  }
}
async function getExistingShapes(roomId: string) {
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
  const messages = res.data; // Access res.data directly (the array)
  console.log(messages);
  const shapes = messages.map((x: { message: string }) => {
    // Parse the message string (if it's JSON)
    return JSON.parse(x.message);
  });

  return shapes;
}
