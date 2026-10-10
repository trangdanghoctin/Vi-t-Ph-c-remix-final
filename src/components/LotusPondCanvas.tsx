import React, { useEffect, useRef } from 'react';
import lotusPondRegImg from '../assets/images/lotus_pond_reg_1791561126163.jpg';

interface LotusPondCanvasProps {
  className?: string;
  intensity?: number;
}

interface Petal {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  rotation: number;
  vRot: number;
  flip: number;
  vFlip: number;
  swaySpeed: number;
  swayOffset: number;
  opacity: number;
  isFloating: boolean;
  floatTimer: number;
}

interface FairyDust {
  x: number;
  y: number;
  vy: number;
  vx: number;
  size: number;
  baseAlpha: number;
  alpha: number;
  twinkleSpeed: number;
  twinklePhase: number;
  isStar: boolean;
}

interface Firefly {
  x: number;
  y: number;
  targetX: number;
  targetY: number;
  speed: number;
  size: number;
  glowRadius: number;
  pulsePhase: number;
  pulseSpeed: number;
  rgb: { r: number; g: number; b: number };
  alpha: number;
}

interface WaterRipple {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  speed: number;
}

export const LotusPondCanvas: React.FC<LotusPondCanvasProps> = ({
  className = '',
  intensity = 1,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bgImageRef = useRef<HTMLImageElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Background Image Path from newly generated watercolor lotus pond asset
  const bgImageUrl = lotusPondRegImg;

  useEffect(() => {
    const img = new Image();
    img.src = bgImageUrl;
    img.onload = () => {
      bgImageRef.current = img;
    };
  }, [bgImageUrl]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // ================= 1. KHỞI TẠO CÁNH HOA SEN RƠI =================
    // Cánh hoa sen màu hồng đào #FEE2E2 chao nghiêng từ góc trên bên phải sang bên trái
    const petalCount = Math.floor(40 * intensity);
    const petals: Petal[] = [];

    const createPetal = (startY?: number): Petal => {
      // Rơi rụng tự nhiên từ góc trên bên phải sang bên trái
      const x = width * 0.4 + Math.random() * (width * 0.75);
      const y = startY !== undefined ? startY : -25 - Math.random() * 70;
      return {
        x,
        y,
        vx: -(0.8 + Math.random() * 1.3), // Làn gió nhẹ thổi từ trên phải sang trái
        vy: 0.65 + Math.random() * 0.85,  // Chao nghiêng nhẹ nhàng đáp xuống
        size: 10 + Math.random() * 8,
        rotation: Math.random() * Math.PI * 2,
        vRot: (Math.random() - 0.5) * 0.035,
        flip: Math.random() * Math.PI,
        vFlip: 0.02 + Math.random() * 0.035,
        swaySpeed: 0.018 + Math.random() * 0.02,
        swayOffset: Math.random() * Math.PI * 2,
        opacity: 0.8 + Math.random() * 0.2,
        isFloating: false,
        floatTimer: 0,
      };
    };

    for (let i = 0; i < petalCount; i++) {
      petals.push(createPetal(Math.random() * height));
    }

    // ================= 2. KHỞI TẠO BỤI PHẤN TIÊN (FAIRY POLLEN DUST) =================
    const dustCount = Math.floor(135 * intensity);
    const fairyDusts: FairyDust[] = [];

    for (let i = 0; i < dustCount; i++) {
      fairyDusts.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        size: 1.2 + Math.random() * 2.8,
        baseAlpha: 0.35 + Math.random() * 0.65,
        alpha: 0.5,
        twinkleSpeed: 0.025 + Math.random() * 0.05,
        twinklePhase: Math.random() * Math.PI * 2,
        isStar: Math.random() > 0.4, // Nhiều ngôi sao 4 cánh lấp lánh bụi phấn
      });
    }

    // ================= 3. KHỞI TẠO ĐOM ĐÓM (GLOWING FIREFLIES PHÁT QUANG) =================
    const fireflyCount = Math.floor(62 * intensity);
    const fireflies: Firefly[] = [];
    const fireflyRgbPalette = [
      { r: 255, g: 251, b: 227 }, // Vàng kem hừng đông
      { r: 254, g: 240, b: 138 }, // Vàng mai ấm áp
      { r: 245, g: 158, b: 11 },  // Hổ phách hoàng gia
      { r: 190, g: 242, b: 100 }, // Xanh đọt chuối dạ quang
      { r: 134, g: 239, b: 172 }, // Xanh ngọc phát quang
      { r: 251, g: 146, b: 60 },  // Cam hoàng hôn dịu ngọt
    ];

    for (let i = 0; i < fireflyCount; i++) {
      const y = height * 0.15 + Math.random() * (height * 0.82);
      const x = Math.random() * width;
      fireflies.push({
        x,
        y,
        targetX: x + (Math.random() - 0.5) * 180,
        targetY: y + (Math.random() - 0.5) * 120,
        speed: 0.4 + Math.random() * 0.6,
        size: 2.2 + Math.random() * 2.6,
        glowRadius: 16 + Math.random() * 22,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.025 + Math.random() * 0.045,
        rgb: fireflyRgbPalette[Math.floor(Math.random() * fireflyRgbPalette.length)],
        alpha: 0.7 + Math.random() * 0.3,
      });
    }

    // ================= 4. KHỞI TẠO GỢN NƯỚC (WATER RIPPLES) =================
    const ripples: WaterRipple[] = [];
    let rippleTimer = 0;
    const addRipple = (x: number, y: number) => {
      ripples.push({
        x,
        y,
        radius: 2,
        maxRadius: 35 + Math.random() * 40,
        alpha: 0.5,
        speed: 0.4 + Math.random() * 0.3,
      });
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      const clientX = 'touches' in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : (e as MouseEvent).clientY;
      if (clientY > height * 0.35 && Math.random() > 0.7) {
        addRipple(clientX, clientY);
      }
      // Thêm vệt bụi phấn lấp lánh theo con trỏ chuột
      if (Math.random() > 0.65 && fairyDusts.length < dustCount + 30) {
        fairyDusts.push({
          x: clientX + (Math.random() - 0.5) * 20,
          y: clientY + (Math.random() - 0.5) * 20,
          vx: (Math.random() - 0.5) * 0.5,
          vy: -0.3 - Math.random() * 0.5,
          size: 1.5 + Math.random() * 2,
          baseAlpha: 0.8,
          alpha: 0.8,
          twinkleSpeed: 0.06,
          twinklePhase: 0,
          isStar: true,
        });
      }
    };
    window.addEventListener('mousemove', handlePointerMove);
    window.addEventListener('touchmove', handlePointerMove);

    // ================= 5. MAIN RENDER LOOP =================
    let time = 0;

    const render = () => {
      time += 0.016;

      ctx.clearRect(0, 0, width, height);

      // --- LỚP 1: ẢNH NỀN HOA SEN BUỔI SỚM ---
      if (bgImageRef.current && bgImageRef.current.complete) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        const img = bgImageRef.current;
        const imgRatio = img.width / img.height;
        const canvasRatio = width / height;

        let drawW = width;
        let drawH = height;
        let offX = 0;
        let offY = 0;

        if (canvasRatio > imgRatio) {
          drawW = width;
          drawH = width / imgRatio;
          offY = (height - drawH) / 2;
        } else {
          drawH = height;
          drawW = height * imgRatio;
          offX = (width - drawW) / 2;
        }

        // Nhịp thở zoom vi tế (Subtle breathing effect: 1.0 -> 1.008)
        const breatheScale = 1 + Math.sin(time * 0.4) * 0.006;
        ctx.save();
        ctx.translate(width / 2, height / 2);
        ctx.scale(breatheScale, breatheScale);
        ctx.translate(-width / 2, -height / 2);
        ctx.drawImage(img, offX, offY, drawW, drawH);
        ctx.restore();
      } else {
        const dawnGrad = ctx.createLinearGradient(0, 0, 0, height);
        dawnGrad.addColorStop(0, '#FED2B7');
        dawnGrad.addColorStop(0.35, '#FFEAD9');
        dawnGrad.addColorStop(0.65, '#FFFFE3');
        dawnGrad.addColorStop(1, '#6EE7B7');
        ctx.fillStyle = dawnGrad;
        ctx.fillRect(0, 0, width, height);
      }

      // --- LỚP 2: LÀN SƯƠNG MÙ MỎNG LỮNG LỜ TRÔI NGANG QUA MÀN HÌNH (2 LỚP MIST WAVES) ---
      ctx.save();
      // Làn sương 1: Lững lờ ngang sườn núi và chùa cổ
      const mistY1 = height * 0.44;
      const mistOffset1 = (time * 15) % (width + 400);

      const mistGrad1 = ctx.createLinearGradient(0, mistY1 - 50, 0, mistY1 + 75);
      mistGrad1.addColorStop(0, 'rgba(255, 255, 255, 0)');
      mistGrad1.addColorStop(0.5, 'rgba(255, 248, 238, 0.15)');
      mistGrad1.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = mistGrad1;
      ctx.beginPath();
      ctx.moveTo(-200 + mistOffset1, mistY1);
      for (let x = -200; x <= width + 200; x += 50) {
        const y = mistY1 + Math.sin((x + mistOffset1) * 0.008) * 14 + Math.cos(time * 0.8) * 5;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width + 200, mistY1 + 90);
      ctx.lineTo(-200, mistY1 + 90);
      ctx.closePath();
      ctx.fill();

      // Làn sương 2: Sương mai lững lờ sát mặt đầm sen
      const mistY2 = height * 0.64;
      const mistOffset2 = (time * 22) % (width + 400);
      const mistGrad2 = ctx.createLinearGradient(0, mistY2 - 40, 0, mistY2 + 65);
      mistGrad2.addColorStop(0, 'rgba(255, 255, 255, 0)');
      mistGrad2.addColorStop(0.5, 'rgba(255, 242, 232, 0.13)');
      mistGrad2.addColorStop(1, 'rgba(255, 255, 255, 0)');

      ctx.fillStyle = mistGrad2;
      ctx.beginPath();
      ctx.moveTo(-200 + mistOffset2, mistY2);
      for (let x = -200; x <= width + 200; x += 45) {
        const y = mistY2 + Math.sin((x + mistOffset2) * 0.007) * 11 + Math.sin(time * 0.7) * 4;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(width + 200, mistY2 + 75);
      ctx.lineTo(-200, mistY2 + 75);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // --- LỚP 3: GỢN NƯỚC NHẤP NHÔ TRÊN MẶT ĐẦM PHẢN CHIẾU ÁNH HỪNG ĐÔNG ---
      rippleTimer++;
      if (rippleTimer > 42) {
        rippleTimer = 0;
        const rx = width * 0.1 + Math.random() * (width * 0.8);
        const ry = height * 0.48 + Math.random() * (height * 0.46);
        addRipple(rx, ry);
      }

      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.radius += r.speed;
        r.alpha -= 0.005;

        if (r.alpha <= 0 || r.radius >= r.maxRadius) {
          ripples.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.beginPath();
        ctx.ellipse(r.x, r.y, r.radius, r.radius * 0.28, 0, 0, Math.PI * 2);
        // Phản chiếu ánh hừng đông vàng kem #FFFBE3 / #FFFFE3
        ctx.strokeStyle = `rgba(255, 251, 227, ${r.alpha * 0.82})`;
        ctx.lineWidth = 1.2;
        ctx.stroke();
        ctx.restore();
      }

      // --- LỚP 4: BỤI PHẤN TIÊN (FAIRY POLLEN DUST) ---
      for (let i = 0; i < fairyDusts.length; i++) {
        const d = fairyDusts[i];
        d.x += d.vx + Math.sin(time + i) * 0.2;
        d.y += d.vy + Math.cos(time * 0.8 + i) * 0.2;

        if (d.x < -10) d.x = width + 10;
        if (d.x > width + 10) d.x = -10;
        if (d.y < -10) d.y = height + 10;
        if (d.y > height + 10) d.y = -10;

        const twinkle = Math.sin(time * d.twinkleSpeed * 60 + d.twinklePhase);
        d.alpha = Math.max(0.15, d.baseAlpha + twinkle * 0.4);

        ctx.save();
        if (d.isStar && twinkle > 0.5) {
          const starSize = d.size * (1.1 + twinkle * 0.7);
          ctx.fillStyle = `rgba(255, 255, 227, ${d.alpha})`;
          ctx.beginPath();
          ctx.moveTo(d.x, d.y - starSize * 1.6);
          ctx.lineTo(d.x + starSize * 0.4, d.y - starSize * 0.4);
          ctx.lineTo(d.x + starSize * 1.6, d.y);
          ctx.lineTo(d.x + starSize * 0.4, d.y + starSize * 0.4);
          ctx.lineTo(d.x, d.y + starSize * 1.6);
          ctx.lineTo(d.x - starSize * 0.4, d.y + starSize * 0.4);
          ctx.lineTo(d.x - starSize * 1.6, d.y);
          ctx.lineTo(d.x - starSize * 0.4, d.y - starSize * 0.4);
          ctx.closePath();
          ctx.fill();
        } else {
          ctx.fillStyle = `rgba(255, 251, 227, ${d.alpha})`;
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }

      // --- LỚP 5: ĐOM ĐÓM PHÁT QUANG (GLOWING FIREFLIES) ---
      for (let i = 0; i < fireflies.length; i++) {
        const f = fireflies[i];

        const dx = f.targetX - f.x;
        const dy = f.targetY - f.y;
        f.x += dx * 0.016 * f.speed;
        f.y += dy * 0.016 * f.speed;

        if (Math.hypot(dx, dy) < 14 || Math.random() < 0.009) {
          f.targetX = Math.max(20, Math.min(width - 20, f.x + (Math.random() - 0.5) * 150));
          f.targetY = Math.max(
            height * 0.28,
            Math.min(height - 20, f.y + (Math.random() - 0.5) * 110)
          );
        }

        const pulse = (Math.sin(time * 60 * f.pulseSpeed + f.pulsePhase) + 1) / 2;
        const currentAlpha = 0.35 + pulse * 0.65;
        const glowRad = f.glowRadius * (0.8 + pulse * 0.5);

        ctx.save();
        const glowGrad = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, glowRad);
        glowGrad.addColorStop(0, `rgba(${f.rgb.r}, ${f.rgb.g}, ${f.rgb.b}, ${f.alpha})`);
        glowGrad.addColorStop(0.35, `rgba(${f.rgb.r}, ${f.rgb.g}, ${f.rgb.b}, ${f.alpha * 0.45})`);
        glowGrad.addColorStop(1, `rgba(${f.rgb.r}, ${f.rgb.g}, ${f.rgb.b}, 0)`);

        ctx.globalAlpha = currentAlpha;
        ctx.fillStyle = glowGrad;
        ctx.beginPath();
        ctx.arc(f.x, f.y, glowRad, 0, Math.PI * 2);
        ctx.fill();

        // Lõi sáng trắng vàng
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(f.x, f.y, f.size * (0.7 + pulse * 0.3), 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // --- LỚP 6: CÁNH HOA SEN RƠI (FALLING LOTUS PETALS) ---
      const waterLevel = height * 0.72;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];

        if (!p.isFloating) {
          const sway = Math.sin(time * 2 + p.swayOffset) * 0.9;
          p.x += p.vx + sway;
          p.y += p.vy;
          p.rotation += p.vRot;
          p.flip += p.vFlip;

          if (p.y >= waterLevel + Math.sin(p.x * 0.01) * 20) {
            p.isFloating = true;
            p.floatTimer = 0;
            if (Math.random() > 0.4) {
              addRipple(p.x, p.y);
            }
          }
        } else {
          p.floatTimer += 0.016;
          p.x += p.vx * 0.35 + Math.sin(time + p.swayOffset) * 0.3;
          p.y = waterLevel + Math.sin(time * 1.5 + p.x * 0.02) * 4;

          if (p.floatTimer > 6 || p.x < -30) {
            const fresh = createPetal();
            Object.assign(p, fresh);
          }
        }

        if (p.x < -40 || p.y > height + 40) {
          const fresh = createPetal();
          Object.assign(p, fresh);
        }

        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);
        const scaleY = Math.cos(p.flip);
        ctx.scale(1, Math.max(0.15, Math.abs(scaleY)));
        ctx.globalAlpha = p.opacity;

        const petalGrad = ctx.createLinearGradient(0, -p.size, 0, p.size);
        petalGrad.addColorStop(0, '#f43f5e'); // Viền chóp cánh hồng đỏ
        petalGrad.addColorStop(0.2, '#fda4af');
        petalGrad.addColorStop(0.7, '#fee2e2'); // Màu hồng đào #FEE2E2
        petalGrad.addColorStop(1, '#fff1f2');

        ctx.fillStyle = petalGrad;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.2);
        ctx.bezierCurveTo(
          p.size * 0.9, -p.size * 0.5,
          p.size * 0.8, p.size * 0.6,
          0, p.size * 1.1
        );
        ctx.bezierCurveTo(
          -p.size * 0.8, p.size * 0.6,
          -p.size * 0.9, -p.size * 0.5,
          0, -p.size * 1.2
        );
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = 'rgba(244, 63, 94, 0.35)';
        ctx.lineWidth = 0.8;
        ctx.beginPath();
        ctx.moveTo(0, -p.size * 1.0);
        ctx.lineTo(0, p.size * 0.8);
        ctx.stroke();

        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('touchmove', handlePointerMove);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [intensity]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-auto ${className}`}
      style={{ display: 'block', imageRendering: 'pixelated' }}
    />
  );
};
