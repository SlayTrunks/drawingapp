import axios from "axios";
import { HTTP_BACKEND } from "@/config";

// Add text shape type here
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
        beginX: number;
        beginY: number;
        endX: number;
        endY: number;
    }
    // --- TEXT SHAPE TYPE ADDED ---
    | {
        type: "text";
        x: number;
        y: number;
        width: number;
        height: number;
        text: string;
    };

export async function draw(
    canvas: HTMLCanvasElement,
    roomId: string,
    socket: WebSocket,
) {
    const ctx = canvas.getContext("2d");
    let existingShapes: Shape[] = await getExistingShapes(roomId);
    if (!ctx) return;

    socket.onmessage = (event) => {
        const message = JSON.parse(event.data);
        if (message.type === "chat") {
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
        const { x, y } = getMousePos(canvas, e);
        spaceX = x;
        spaceY = y;
    });

    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const { x, y, rect } = getMousePos(canvas, e);
        const width = x - spaceX;
        const height = y - spaceY;
        const radius = Math.sqrt(width * width + height * height);

        const shp = localStorage.getItem("shape");

        if (shp == null || shp === "rect") {
            const shape: Shape = {
                type: "rect",
                x: spaceX,
                y: spaceY,
                width,
                height,
            };
            socket.send(
                JSON.stringify({
                    type: "chat",
                    message: JSON.stringify(shape),
                    roomId,
                }),
            );
        } else if (shp === "circle") {
            const shape: Shape = {
                type: "circle",
                centerX: spaceX,
                centerY: spaceY,
                radius,
            };
            socket.send(
                JSON.stringify({
                    type: "chat",
                    message: JSON.stringify(shape),
                    roomId,
                }),
            );
        } else if (shp === "line") {
            const shape: Shape = {
                type: "line",
                beginX: spaceX,
                beginY: spaceY,
                endX: x,
                endY: y,
            };
            socket.send(
                JSON.stringify({
                    type: "chat",
                    message: JSON.stringify(shape),
                    roomId,
                }),
            );
        }
        // --- TEXT TOOL LOGIC START ---
        else if (shp === "text") {
            // Create a styled textarea positioned and sized like the drawn box
            const input = document.createElement("textarea");
            input.style.position = "absolute";
            input.style.left = `${rect.left + spaceX}px`;
            input.style.top = `${rect.top + spaceY}px`;
            input.style.width = `${Math.abs(x - spaceX) || 240}px`;
            input.style.height = `${Math.abs(y - spaceY) || 40}px`;
            input.style.font = "20px sans-serif";
            input.style.background = "rgba(0,0,0,0.8)";
            input.style.color = "#fff";
            input.style.border = "1.5px solid #fff";
            input.style.outline = "2px solid #888";
            input.style.caretColor = "#fff";
            input.style.overflow = "hidden";
            input.style.zIndex = "9999";
            input.style.resize = "none";
            input.autofocus = true;

            document.body.appendChild(input);
            input.focus();

            // Helper to commit the text: draw to canvas and send to backend
            function commitText() {
                const text = input.value;
                if (text && ctx) {
                    ctx.font = "20px sans-serif";
                    ctx.fillStyle = "#fff";
                    // Draw wrapped text in the box
                    drawWrappedText(
                        ctx,
                        text,
                        spaceX + 4,
                        spaceY + 24,
                        Math.abs(x - spaceX) - 8,
                        24,
                    );
                    // Send text shape to backend
                    const shape = {
                        type: "text",
                        x: spaceX,
                        y: spaceY,
                        width: Math.abs(x - spaceX) || 240,
                        height: Math.abs(y - spaceY) || 40,
                        text,
                    };
                    socket.send(
                        JSON.stringify({
                            type: "chat",
                            message: JSON.stringify(shape),
                            roomId,
                        }),
                    );
                }
                document.body.removeChild(input);
            }

            input.addEventListener("keydown", function(e) {
                if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    commitText();
                }
            });
            input.addEventListener("blur", commitText);
        }
        // --- TEXT TOOL LOGIC END ---
    });

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const { x, y } = getMousePos(canvas, e);
            const width = x - spaceX;
            const height = y - spaceY;
            const shp = localStorage.getItem("shape");
            const radius = Math.sqrt(width * width + height * height);

            ctx.strokeStyle = "rgba(255,255,255)";
            clearCanvas(existingShapes, canvas, ctx);

            if (shp == null) {
                ctx.beginPath();
                ctx.moveTo(spaceX, spaceY);
                ctx.lineTo(x, y);
                ctx.stroke();
            } else if (shp === "rect") {
                ctx.strokeRect(spaceX, spaceY, width, height);
            } else if (shp === "circle") {
                ctx.beginPath();
                ctx.arc(spaceX, spaceY, radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (shp === "line") {
                ctx.beginPath();
                ctx.moveTo(spaceX, spaceY);
                ctx.lineTo(x, y);
                ctx.stroke();
            }
            else if (shp === "text") {
                ctx.strokeStyle = "#888";
                ctx.strokeRect(spaceX, spaceY, x - spaceX, y - spaceY);
    }
        }
    });

    // --- TEXT REDRAW SUPPORT ADDED HERE ---
    function clearCanvas(
        existingShapes: Shape[],
        canvas: HTMLCanvasElement,
        ctx: CanvasRenderingContext2D,
    ) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "rgba(0,0,0)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        existingShapes.map((shape) => {
            ctx.strokeStyle = "rgba(255,255,255)";
            if (shape.type === "rect") {
                ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
            } else if (shape.type === "circle") {
                ctx.beginPath();
                ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, 2 * Math.PI);
                ctx.stroke();
            } else if (shape.type === "line") {
                ctx.beginPath();
                ctx.moveTo(shape.beginX, shape.beginY);
                ctx.lineTo(shape.endX, shape.endY);
                ctx.stroke();
            }
            // --- REDRAW TEXT SHAPE ---
            else if (shape.type === "text") {
                ctx.font = "20px sans-serif";
                ctx.fillStyle = "#fff";
                drawWrappedText(
                    ctx,
                    shape.text,
                    shape.x + 4,
                    shape.y + 24,
                    shape.width - 8,
                    24,
                );
            }
            return null; // map return value (not used)
        });
    }
}

// --- TEXT WRAPPING HELPER FUNCTION ---
function drawWrappedText(
    ctx: CanvasRenderingContext2D,
    text: string,
    x: number,
    y: number,
    maxWidth: number,
    lineHeight: number,
) {
    const words = text.split(" ");
    let line = "";
    for (let n = 0; n < words.length; n++) {
        const testLine = line + words[n] + " ";
        const metrics = ctx.measureText(testLine);
        const testWidth = metrics.width;
        if (testWidth > maxWidth && n > 0) {
            ctx.fillText(line, x, y);
            line = words[n] + " ";
            y += lineHeight;
        } else {
            line = testLine;
        }
    }
    ctx.fillText(line, x, y);
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data;
    console.log(messages);
    const shapes = messages.map((x: { message: string }) => {
        return JSON.parse(x.message);
    });
    return shapes;
}

function getMousePos(canvas: HTMLCanvasElement, evt: MouseEvent) {
    const rect = canvas.getBoundingClientRect();
    return {
        x: evt.clientX - rect.left,
        y: evt.clientY - rect.top,
        rect,
    };
}
