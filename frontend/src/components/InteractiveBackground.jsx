import React, { useEffect, useRef } from 'react';

export const InteractiveBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];
    let binaryParticles = [];
    
    const mouse = { x: -1000, y: -1000, radius: 240 }; // mouse web influence radius

    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    // Scroll states for indicator animation
    let lastScrollY = window.scrollY;
    let scrollState = 'idle';
    let scrollActivity = 0;
    let isIdle = true;
    let scrollTimeout;

    const triggerScrollActive = (direction) => {
      scrollState = direction;
      scrollActivity = 1.0;
      isIdle = false;

      if (scrollTimeout) clearTimeout(scrollTimeout);
      scrollTimeout = setTimeout(() => {
        scrollActivity = 0;
        scrollState = 'idle';
        isIdle = true;
      }, 30); // 30ms for instant fade response
    };

    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initParticles();
    };

    window.addEventListener('resize', resize);
    
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };
    const handleMouseOut = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseout', handleMouseOut);

    // CLICK EMISSION: Spawn binary digits at click coordinates
    const handleMouseClick = (e) => {
      const count = Math.floor(Math.random() * 5) + 8; // Spawn 8-12 particles
      for (let i = 0; i < count; i++) {
        binaryParticles.push(new BinaryParticle(e.clientX, e.clientY));
      }
    };
    window.addEventListener('click', handleMouseClick);

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const diff = currentScrollY - lastScrollY;
      lastScrollY = currentScrollY;

      // Ignore low-velocity inertial drift (< 10px) to prevent lingering chevrons
      if (Math.abs(diff) > 10) {
        if (diff > 0) {
          triggerScrollActive('down');
        } else if (diff < 0) {
          triggerScrollActive('up');
        }
      }
    };

    const handleWheel = (e) => {
      // Ignore low-velocity inertial wheel events (< 10px)
      if (Math.abs(e.deltaY) > 10) {
        if (e.deltaY > 0) {
          triggerScrollActive('down');
        } else if (e.deltaY < 0) {
          triggerScrollActive('up');
        }
      }
    };

    const handleScrollEnd = () => {
      scrollActivity = 0;
      scrollState = 'idle';
      isIdle = true;
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('scrollend', handleScrollEnd, { passive: true });

    // Neural Network Node Class
    class NodeParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.dx = (Math.random() - 0.5) * 0.45;
        this.dy = (Math.random() - 0.5) * 0.45;
        this.size = Math.random() * 2.2 + 1.8; // node size (radius)
        this.opacity = Math.random() * 0.3 + 0.15;
        this.colorType = Math.random() > 0.72 ? 'crimson' : 'cyan';
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = this.colorType === 'cyan'
          ? `rgba(0, 242, 254, ${this.opacity})`
          : `rgba(244, 63, 94, ${this.opacity})`;
        ctx.fill();
      }

      update() {
        // Drift freely
        this.x += this.dx;
        this.y += this.dy;

        // Wrap around margins
        if (this.x < -10) this.x = width + 10;
        if (this.x > width + 10) this.x = -10;
        if (this.y < -10) this.y = height + 10;
        if (this.y > height + 10) this.y = -10;

        // Mouse Gravitational Pull (Web attraction) - pull disabled to prevent clumping
        if (mouse.x !== -1000 && mouse.y !== -1000) {
          let dx = mouse.x - this.x;
          let dy = mouse.y - this.y;
          let distance = Math.sqrt(dx * dx + dy * dy);
          if (distance < mouse.radius) {
            this.opacity = Math.min(0.85, this.opacity + 0.025);
          } else {
            this.opacity = Math.max(0.18, this.opacity - 0.01);
          }
        } else {
          this.opacity = Math.max(0.18, this.opacity - 0.01);
        }

        this.draw();
      }
    }

    // Binary Particle class (Click response)
    class BinaryParticle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 3.5 + 1.5;
        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed - 0.8;
        this.symbol = Math.random() > 0.5 ? '1' : '0';
        this.size = Math.floor(Math.random() * 8) + 12;
        this.opacity = 1.0;
        this.decay = Math.random() * 0.022 + 0.016;
        this.colorType = Math.random() > 0.35 ? 'cyan' : 'crimson';
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.95;
        this.vy *= 0.95;
        this.opacity -= this.decay;
      }

      draw() {
        ctx.save();
        ctx.font = `bold ${this.size}px var(--font-mono)`;
        ctx.fillStyle = this.colorType === 'cyan'
          ? `rgba(0, 242, 254, ${this.opacity})`
          : `rgba(244, 63, 94, ${this.opacity})`;
        ctx.shadowColor = this.colorType === 'cyan' ? '#00f2fe' : '#f43f5e';
        ctx.shadowBlur = 10;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, this.x, this.y);
        ctx.restore();
      }
    }

    const initParticles = () => {
      particles = [];
      // Sparser elegant neural layout
      let numberOfParticles = Math.floor((width * height) / 20000); 
      for (let i = 0; i < numberOfParticles; i++) {
        let x = Math.random() * width;
        let y = Math.random() * height;
        particles.push(new NodeParticle(x, y));
      }
    };

    // Parallax scrolling grid lines
    const drawGrid = () => {
      const offsetX = mouse.x !== -1000 ? (mouse.x - width / 2) * 0.008 : 0;
      const scrollOffset = typeof window !== 'undefined' ? window.scrollY * 0.08 : 0;
      const offsetY = (mouse.y !== -1000 ? (mouse.y - height / 2) * 0.008 : 0) - scrollOffset;

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.022)';
      ctx.lineWidth = 1;

      const gridSize = 48;
      ctx.beginPath();
      // Vertical lines
      for (let x = (offsetX % gridSize) - gridSize; x < width + gridSize; x += gridSize) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
      }
      // Horizontal lines
      for (let y = (offsetY % gridSize) - gridSize; y < height + gridSize; y += gridSize) {
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
      }
      ctx.stroke();
    };

    // Draw the 6 fixed chevron scroll indicators UNDER the net
    const drawScrollIndicatorChevrons = () => {
      const xLeft = 50;
      const xRight = width - 50;
      const yPositions = [height * 0.25, height * 0.5, height * 0.75];
      const size = 18;
      const halfWidth = size * 0.85;
      const heightOffset = size * 0.35;
      const spacing = 12; // vertical stacking spacing

      const isDown = scrollState === 'down';
      const isUp = scrollState === 'up';
      const intensity = scrollActivity;

      // Base idle color: dim outlines
      const idleColor = 'rgba(255, 255, 255, 0.05)';
      const activeColor = isDown ? '#00f2fe' : '#f43f5e';
      
      // Cascade highlighting speed offset across 4 chevrons
      const phase = Math.floor(Date.now() / 90) % 4; // 0, 1, 2, 3

      ctx.save();
      ctx.lineJoin = 'miter';
      ctx.lineCap = 'square';

      yPositions.forEach(y => {
        [xLeft, xRight].forEach(x => {
          const pointingDown = !isUp; // default points down

          // Draw 4 chevrons: k = 0 (head), k = 1 (tail 1), k = 2 (tail 2), k = 3 (tail 3)
          for (let k = 0; k < 4; k++) {
            let color = idleColor;
            let blur = 0;

            if (!isIdle && intensity > 0) {
              // Scroll cascade: light flows from tail (k = 3) to head (k = 0)
              const isHighlighted = (3 - k) === phase;

              if (isHighlighted) {
                color = activeColor;
                blur = 16;
              } else {
                // Faded ambient active color
                color = isDown 
                  ? `rgba(0, 242, 254, ${intensity * 0.22})` 
                  : `rgba(244, 63, 94, ${intensity * 0.22})`;
                blur = 0;
              }
            }

            ctx.shadowColor = activeColor;
            ctx.shadowBlur = blur;

            // Stack vertically: head is at the leading scroll tip, tails follow behind
            const offsetMultiplier = pointingDown ? 1 : -1;
            const cy = y + ((1.5 - k) * spacing * offsetMultiplier);

            // Draw cyberpunk chevron stroke outline
            ctx.beginPath();
            if (pointingDown) {
              ctx.moveTo(x - halfWidth, cy - heightOffset);
              ctx.lineTo(x, cy + heightOffset);
              ctx.lineTo(x + halfWidth, cy - heightOffset);
            } else {
              ctx.moveTo(x - halfWidth, cy + heightOffset);
              ctx.lineTo(x, cy - heightOffset);
              ctx.lineTo(x + halfWidth, cy + heightOffset);
            }
            ctx.strokeStyle = color;
            // Head (k = 0) is slightly thicker than the tail elements for definition
            ctx.lineWidth = k === 0 ? 4.5 : 3.2;
            ctx.stroke();
          }
        });
      });

      ctx.restore();
    };

    const animate = () => {
      ctx.fillStyle = '#020203';
      ctx.fillRect(0, 0, width, height);

      drawGrid();

      // Render chevron arrows strictly UNDER the net
      drawScrollIndicatorChevrons();

      // Node linkages: Connect close neural particles to each other
      for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
          let dx = particles[a].x - particles[b].x;
          let dy = particles[a].y - particles[b].y;
          let distance = (dx * dx + dy * dy);
          
          if (distance < 14000) { // rich grid connections
            let opacity = 1 - (distance / 14000);
            ctx.strokeStyle = particles[a].colorType === 'cyan' || particles[b].colorType === 'cyan'
              ? `rgba(0, 242, 254, ${opacity * 0.16})`
              : `rgba(244, 63, 94, ${opacity * 0.16})`;
            ctx.lineWidth = 0.55; // thin elegant mesh lines
            ctx.beginPath();
            ctx.moveTo(particles[a].x, particles[a].y);
            ctx.lineTo(particles[b].x, particles[b].y);
            ctx.stroke();
          }
        }
      }

      // Cursor linkages: Connect cursor to nearby nodes (highly visible web connections)
      if (mouse.x !== -1000 && mouse.y !== -1000) {
        for (let i = 0; i < particles.length; i++) {
          let dx = mouse.x - particles[i].x;
          let dy = mouse.y - particles[i].y;
          let distance = (dx * dx + dy * dy);
          
          if (distance < 60000) { // mouse web threshold (approx 245px)
            let opacity = 1 - (distance / 60000);
            ctx.strokeStyle = `rgba(0, 242, 254, ${opacity * 0.44})`;
            ctx.lineWidth = 0.85; // thin elegant web lines to cursor
            ctx.beginPath();
            ctx.moveTo(mouse.x, mouse.y);
            ctx.lineTo(particles[i].x, particles[i].y);
            ctx.stroke();
          }
        }
      }

      // Update nodes
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
      }

      // Update click binary particles
      binaryParticles = binaryParticles.filter(p => {
        p.update();
        p.draw();
        return p.opacity > 0;
      });



      // Ambient glow highlighting around mouse
      if (mouse.x !== -1000 && mouse.y !== -1000) {
        const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 250);
        gradient.addColorStop(0, 'rgba(0, 242, 254, 0.045)');
        gradient.addColorStop(1, 'rgba(0, 242, 254, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    initParticles();
    animate();

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseout', handleMouseOut);
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('wheel', handleWheel);
      window.removeEventListener('scrollend', handleScrollEnd);
      if (scrollTimeout) clearTimeout(scrollTimeout);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed', // align coordinate space with viewport
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
};
