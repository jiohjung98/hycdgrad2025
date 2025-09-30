// "use client";

// import { useEffect } from "react";

// // eslint-disable-next-line @typescript-eslint/no-explicit-any

// interface Bubble {
//   x: number;
//   y: number;
//   size: number;
//   opacity: number;
//   vx: number;
//   vy: number;
//   update: () => void;
//   display: () => void;
// }

// export default function MouseBubbles() {
//   useEffect(() => {
//     // 모바일에서는 보글보글 기능 비활성화
//     if (window.innerWidth <= 768) {
//       return;
//     }

//     const bubbles: Bubble[] = [];
//     // eslint-disable-next-line @typescript-eslint/no-explicit-any
//     let p5Instance: any = null;

//     const initP5 = async () => {
//       const p5 = (await import("p5")).default;

//       // eslint-disable-next-line @typescript-eslint/no-explicit-any
//       const sketch = (p: any) => {
//         p.setup = function () {
//           const cnv = p.createCanvas(p.windowWidth, p.windowHeight);
//           cnv.style("position", "fixed");
//           cnv.style("top", "0");
//           cnv.style("left", "0");
//           cnv.style("z-index", "9999");
//           cnv.style("pointer-events", "none");
//           p.noFill();
//         };

//         p.draw = function () {
//           p.clear();

//           // 매 5 프레임마다 한 개씩 새로운 거품 생성
//           if (p.frameCount % 5 === 0) {
//             bubbles.push(new Bubble(p.mouseX, p.mouseY, p));
//           }

//           // 거품 업데이트 및 표시, 투명도가 0 이하이면 제거
//           for (let i = bubbles.length - 1; i >= 0; i--) {
//             bubbles[i].update();
//             bubbles[i].display();
//             if (bubbles[i].opacity <= 0) {
//               bubbles.splice(i, 1);
//             }
//           }
//         };

//         p.windowResized = function () {
//           p.resizeCanvas(p.windowWidth, p.windowHeight);
//         };

//         class Bubble {
//           x: number;
//           y: number;
//           size: number;
//           opacity: number;
//           vx: number;
//           vy: number;
//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           p: any;

//           // eslint-disable-next-line @typescript-eslint/no-explicit-any
//           constructor(x: number, y: number, p5Instance: any) {
//             this.x = x;
//             this.y = y;
//             this.size = 15; // 초기 크기 15px
//             this.opacity = 255; // 초기 불투명도 255 (완전 불투명)
//             this.vx = p5Instance.random(-0.5, 0.5);
//             this.vy = p5Instance.random(-1.5, -0.5);
//             this.p = p5Instance;
//           }

//           update() {
//             // 좌우로 약간의 진동 효과 추가
//             this.x += this.vx + this.p.random(-0.3, 0.3);
//             this.y += this.vy;
//             // 크기를 서서히 줄임
//             this.size -= 0.1;
//             // 불투명도를 감소시켜 점차 사라지게 함
//             this.opacity -= 3;
//           }

//           display() {
//             // 검정 선(0.5px)으로 원을 그리며, 선의 투명도는 opacity로 조절
//             this.p.stroke(0, this.opacity);
//             this.p.strokeWeight(0.5);
//             this.p.noFill();
//             this.p.ellipse(this.x, this.y, this.size);
//           }
//         }
//       };

//       p5Instance = new p5(sketch);
//     };

//     initP5();

//     return () => {
//       if (p5Instance) {
//         p5Instance.remove();
//       }
//     };
//   }, []);

//   return null;
// }
