import { useEffect, useRef } from "react";

const Starfield = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const stars = [];
    const numStars = 120;
    const MAX_TRAIL_LENGTH = 8; // ⭐ fixed trail length

    for (let i = 0; i < numStars; i++) {
      stars.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        size: Math.random() * 1.5 + 0.5,
        speedX: (Math.random() - 0.5) * 0.18, // 🔼 slightly faster
        speedY: (Math.random() - 0.5) * 0.18,
        opacity: Math.random() * 0.6 + 0.3,
        opacityDirection: Math.random() > 0.5 ? 0.004 : -0.004,
        trail: [], // ⭐ store previous positions
      });
    }

    let animationFrameId;

    const animate = () => {
      // Fade background slightly (keeps trails clean)
      ctx.fillStyle = "rgba(10, 10, 20, 0.2)";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      stars.forEach((star) => {
        // Save current position to trail
        star.trail.push({ x: star.x, y: star.y });

        if (star.trail.length > MAX_TRAIL_LENGTH) {
          star.trail.shift(); // ❗ remove from back
        }

        // Move star
        star.x += star.speedX;
        star.y += star.speedY;

        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Opacity pulse
        star.opacity += star.opacityDirection;
        if (star.opacity >= 1 || star.opacity <= 0.25) {
          star.opacityDirection *= -1;
        }

        // Draw trail
        star.trail.forEach((pos, index) => {
          const alpha = (index + 1) / star.trail.length;

          ctx.fillStyle = `rgba(120, 180, 255, ${alpha * 0.4})`;
          ctx.beginPath();
          ctx.arc(pos.x, pos.y, star.size * 1.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Draw star head (brighter)
        const gradient = ctx.createRadialGradient(
          star.x,
          star.y,
          0,
          star.x,
          star.y,
          star.size * 3
        );

        gradient.addColorStop(
          0,
          `rgba(160, 210, 255, ${star.opacity})`
        );
        gradient.addColorStop(
          0.6,
          `rgba(120, 180, 255, ${star.opacity * 0.4})`
        );
        gradient.addColorStop(1, "rgba(120, 180, 255, 0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.size * 2.5, 0, Math.PI * 2);
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{
        background: "linear-gradient(to bottom, #070711 0%, #0f1025 100%)",
      }}
    />
  );
};

export default Starfield;
