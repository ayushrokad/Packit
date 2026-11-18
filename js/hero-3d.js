/* =========================================================
   PackIt — Hero 3D Interactive Packaging Engine (Three.js)
   - Real-time 3D Stand-Up Pouch with studio lighting & contact shadows
   - Complete, vibrant, high-contrast packaging artwork (Front, Back, Gussets, Seals)
   - Deep tactile substrate, bold Space Grotesk typography & gold foil accents
   - Spot UV gloss clearcoat & brushed foil reflection mapping
   - Interactive mouse & touch 360° drag rotation
   - Preset camera view angles: Front, 3/4 Isometric Angle, Back
   ========================================================= */

(function () {
  'use strict';

  const container = document.querySelector('.hero__canvas-wrap');
  if (!container || typeof THREE === 'undefined') return;

  // Setup Scene, Camera, Renderer
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(38, container.offsetWidth / container.offsetHeight, 0.1, 100);
  camera.position.set(0, 0, 7.8);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setSize(container.offsetWidth, container.offsetHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  // Replace existing 2D canvas with WebGL canvas
  const oldCanvas = document.getElementById('hero-canvas');
  if (oldCanvas) oldCanvas.remove();
  renderer.domElement.id = 'hero-canvas';
  renderer.domElement.style.position = 'absolute';
  renderer.domElement.style.inset = '0';
  renderer.domElement.style.pointerEvents = 'auto';
  renderer.domElement.style.cursor = 'grab';
  container.appendChild(renderer.domElement);

  /* ——— High-Contrast Studio Lighting Rig ——— */
  // Ambient tuned to 0.72 so dark inks stay true jet black without milky washout
  const ambientLight = new THREE.AmbientLight(0xfffdf7, 0.75);
  scene.add(ambientLight);

  // Key directional light from upper right
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.7);
  keyLight.position.set(4.5, 6, 6);
  keyLight.castShadow = true;
  keyLight.shadow.mapSize.width = 1024;
  keyLight.shadow.mapSize.height = 1024;
  keyLight.shadow.bias = -0.001;
  scene.add(keyLight);

  // Soft warm fill light
  const fillLight = new THREE.DirectionalLight(0xfff5e6, 0.65);
  fillLight.position.set(-5, 2.5, 4);
  scene.add(fillLight);

  // Signature PackIt Yellow Rim Light — strong rim to pop the pouch silhouette off the background!
  const rimLight = new THREE.DirectionalLight(0xf5c842, 2.5);
  rimLight.position.set(-2, -3, -4.5);
  scene.add(rimLight);

  // Overhead light for heat seal highlights
  const topLight = new THREE.DirectionalLight(0xffffff, 0.9);
  topLight.position.set(0, 7, 1);
  scene.add(topLight);

  // Group for the entire 3D pack assembly
  const packageGroup = new THREE.Group();
  scene.add(packageGroup);

  // Position package towards right column in desktop layout (large & prominent)
  function updateLayout() {
    const isDesktop = window.innerWidth > 900;
    packageGroup.position.set(
      isDesktop ? 1.45 : 0,
      isDesktop ? 0.05 : (window.innerWidth < 600 ? -0.55 : -0.7),
      0
    );
    // Increased scale so package is bolder and more commanding
    const scale = isDesktop ? 1.08 : (window.innerWidth < 500 ? 0.72 : 0.85);
    packageGroup.scale.set(scale, scale, scale);
  }
  updateLayout();

  /* =========================================================
     CANVAS TEXTURE GENERATOR ENGINES
     ========================================================= */

  // Helper: Round Rectangle with fallback
  function drawRoundedRect(ctx, x, y, width, height, radius) {
    if (typeof ctx.roundRect === 'function') {
      ctx.beginPath();
      ctx.roundRect(x, y, width, height, radius);
    } else {
      ctx.beginPath();
      ctx.moveTo(x + radius, y);
      ctx.lineTo(x + width - radius, y);
      ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
      ctx.lineTo(x + width, y + height - radius);
      ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
      ctx.lineTo(x + radius, y + height);
      ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
      ctx.lineTo(x, y + radius);
      ctx.quadraticCurveTo(x, y, x + radius, y);
      ctx.closePath();
    }
  }

  // Helper: High-Contrast Tactile Paper Substrate with distinct silhouette borders
  function drawPaperSubstrate(ctx, width, height, baseColor) {
    // Rich natural artisan kraft base
    ctx.fillStyle = baseColor || '#EAE1CE';
    ctx.fillRect(0, 0, width, height);

    // Radial center warmth for volume
    const rad = ctx.createRadialGradient(width / 2, height / 2, 50, width / 2, height / 2, width * 0.7);
    rad.addColorStop(0, 'rgba(255, 252, 245, 0.45)');
    rad.addColorStop(1, 'rgba(0, 0, 0, 0.06)');
    ctx.fillStyle = rad;
    ctx.fillRect(0, 0, width, height);

    // Subtle paper micro-fibers
    ctx.fillStyle = 'rgba(30, 24, 16, 0.035)';
    for (let i = 0; i < 400; i++) {
      const rx = Math.random() * width;
      const ry = Math.random() * height;
      ctx.fillRect(rx, ry, Math.random() * 2.5 + 0.5, Math.random() * 2.5 + 0.5);
    }

    // Micro fiber strokes
    ctx.strokeStyle = 'rgba(40, 30, 20, 0.025)';
    ctx.lineWidth = 1;
    for (let i = 0; i < 80; i++) {
      const sx = Math.random() * width;
      const sy = Math.random() * height;
      ctx.beginPath();
      ctx.moveTo(sx, sy);
      ctx.lineTo(sx + (Math.random() - 0.5) * 8, sy + Math.random() * 6);
      ctx.stroke();
    }

    // Bold Edge Shading to give unmistakable 3D silhouette definition against the canvas
    const edgeGradL = ctx.createLinearGradient(0, 0, 95, 0);
    edgeGradL.addColorStop(0, 'rgba(15, 12, 8, 0.22)');
    edgeGradL.addColorStop(1, 'rgba(15, 12, 8, 0)');
    ctx.fillStyle = edgeGradL;
    ctx.fillRect(0, 0, 95, height);

    const edgeGradR = ctx.createLinearGradient(width - 95, 0, width, 0);
    edgeGradR.addColorStop(0, 'rgba(15, 12, 8, 0)');
    edgeGradR.addColorStop(1, 'rgba(15, 12, 8, 0.22)');
    ctx.fillStyle = edgeGradR;
    ctx.fillRect(width - 95, 0, 95, height);

    // Bottom fold crease depth
    const bottomGrad = ctx.createLinearGradient(0, height - 120, 0, height);
    bottomGrad.addColorStop(0, 'rgba(15, 12, 8, 0)');
    bottomGrad.addColorStop(1, 'rgba(15, 12, 8, 0.28)');
    ctx.fillStyle = bottomGrad;
    ctx.fillRect(0, height - 120, width, 120);

    // Crisp outer edge bevel border
    ctx.strokeStyle = 'rgba(20, 16, 12, 0.35)';
    ctx.lineWidth = 2.5;
    ctx.strokeRect(1, 1, width - 2, height - 2);
  }

  // Helper: Top heat-seal thermal ribs, hang-hole, and tear notches
  function drawThermalCrimpHeader(ctx, uvCtx, width) {
    const sealH = 205;

    // Solid deep graphite/black header band
    ctx.fillStyle = '#0E0E0E';
    ctx.fillRect(0, 0, width, sealH);

    // Embossed horizontal thermal crimp ribs with high contrast
    for (let y = 14; y < sealH - 30; y += 7) {
      ctx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      ctx.fillRect(0, y, width, 2);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
      ctx.fillRect(0, y + 2, width, 2);
    }

    // Euro-Slot / Sombrero Hang Hole die-cut (Cutout centered at x = width / 2, y = 78)
    const hx = width / 2;
    const hy = 78;
    ctx.save();
    ctx.fillStyle = '#FAF8F4'; // canvas background color
    ctx.beginPath();
    ctx.moveTo(hx - 44, hy);
    ctx.lineTo(hx - 20, hy - 14);
    ctx.arc(hx, hy - 14, 20, Math.PI, 0, false);
    ctx.lineTo(hx + 44, hy);
    ctx.arc(hx + 44, hy + 8, 9, -Math.PI / 2, Math.PI / 2, false);
    ctx.lineTo(hx - 44, hy + 17);
    ctx.arc(hx - 44, hy + 8, 9, Math.PI / 2, -Math.PI / 2, false);
    ctx.closePath();
    ctx.fill();

    // Inner shadow border around hole
    ctx.strokeStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.lineWidth = 3.5;
    ctx.stroke();
    ctx.restore();

    // Left Tear Notch
    ctx.fillStyle = '#FAF8F4';
    ctx.beginPath();
    ctx.moveTo(0, 150);
    ctx.lineTo(28, 162);
    ctx.lineTo(0, 174);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#F5C842';
    ctx.font = '700 13px "Space Grotesk", "Space Grotesk", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('◀ TEAR', 38, 167);

    // Right Tear Notch
    ctx.fillStyle = '#FAF8F4';
    ctx.beginPath();
    ctx.moveTo(width, 150);
    ctx.lineTo(width - 28, 162);
    ctx.lineTo(width, 174);
    ctx.closePath();
    ctx.fill();

    ctx.textAlign = 'right';
    ctx.fillText('TEAR ▶', width - 38, 167);

    // Resealable zipper indicator line
    ctx.strokeStyle = '#F5C842';
    ctx.lineWidth = 2;
    ctx.setLineDash([7, 6]);
    ctx.beginPath();
    ctx.moveTo(90, 190);
    ctx.lineTo(width - 90, 190);
    ctx.stroke();
    ctx.setLineDash([]);

    // Zipper pill badge
    const badgeW = 310;
    const badgeH = 22;
    const bx = (width - badgeW) / 2;
    const by = 179;
    drawRoundedRect(ctx, bx, by, badgeW, badgeH, 11);
    ctx.fillStyle = '#F5C842';
    ctx.fill();

    ctx.fillStyle = '#0E0E0E';
    ctx.font = '800 11px "Space Grotesk", "Space Grotesk", sans-serif';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '2px';
    ctx.fillText('✦ FRESH-LOCK HERMETIC ZIPPER ✦', width / 2, by + 15);

    if (uvCtx) {
      drawRoundedRect(uvCtx, bx, by, badgeW, badgeH, 11);
      uvCtx.fillStyle = '#FFFFFF';
      uvCtx.fill();
    }
  }

  /* ——— 1. FRONT TEXTURE RENDERER ——— */
  const frontCanvas = document.createElement('canvas');
  frontCanvas.width = 1024;
  frontCanvas.height = 1536;
  const fCtx = frontCanvas.getContext('2d');

  // Spot UV Gloss Map Canvas (High reflection on foil/logos)
  const frontUvCanvas = document.createElement('canvas');
  frontUvCanvas.width = 1024;
  frontUvCanvas.height = 1536;
  const fUvCtx = frontUvCanvas.getContext('2d');

  function renderFrontArtwork() {
    const W = frontCanvas.width;
    const H = frontCanvas.height;

    // Reset UV Map to black (matte substrate)
    fUvCtx.fillStyle = '#000000';
    fUvCtx.fillRect(0, 0, W, H);

    // Draw Kraft Paper Substrate
    drawPaperSubstrate(fCtx, W, H, '#EAE1CE');

    // Draw Heat Seal Header
    drawThermalCrimpHeader(fCtx, fUvCtx, W);

    // Upper Studio Origin Badge
    fCtx.fillStyle = '#4A4033';
    fCtx.font = '700 13px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.textAlign = 'center';
    fCtx.letterSpacing = '5px';
    fCtx.fillText('EST. 2024 · COPENHAGEN & BROOKLYN · INDEPENDENT', W / 2, 255);

    // Brand Wordmark: "Bloom" in deep jet black
    fCtx.fillStyle = '#0A0A0A';
    fCtx.font = 'italic 136px "Instrument Serif", Georgia, serif';
    fCtx.textAlign = 'center';
    fCtx.fillText('Bloom', W / 2, 385);

    // Gold Leaf Dot Accent on letter 'o'
    fCtx.save();
    fCtx.fillStyle = '#F5C842';
    fCtx.beginPath();
    fCtx.ellipse(W / 2 + 10, 310, 11, 18, Math.PI / 4, 0, Math.PI * 2);
    fCtx.fill();
    fCtx.strokeStyle = '#0A0A0A';
    fCtx.lineWidth = 1.5;
    fCtx.stroke();
    fCtx.restore();

    // Spot UV on Bloom wordmark & gold leaf
    fUvCtx.fillStyle = '#FFFFFF';
    fUvCtx.font = 'italic 136px "Instrument Serif", Georgia, serif';
    fUvCtx.textAlign = 'center';
    fUvCtx.fillText('Bloom', W / 2, 385);
    fUvCtx.beginPath();
    fUvCtx.ellipse(W / 2 + 10, 310, 11, 18, Math.PI / 4, 0, Math.PI * 2);
    fUvCtx.fill();

    // Category Descriptor in bold black
    fCtx.fillStyle = '#1A1814';
    fCtx.font = '800 18px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.letterSpacing = '9px';
    fCtx.fillText('ORGANIC ARTISAN BOTANICALS', W / 2, 428);

    // CENTER EMBLEM & BOTANICAL ILLUSTRATION
    const emblemCx = W / 2;
    const emblemCy = 650;
    const emblemR = 155;

    // Outer Gold Foil Ring (thicker & bolder)
    fCtx.strokeStyle = '#F5C842';
    fCtx.lineWidth = 6;
    fCtx.beginPath();
    fCtx.arc(emblemCx, emblemCy, emblemR, 0, Math.PI * 2);
    fCtx.stroke();

    // Inner Solid Geometric Ring
    fCtx.strokeStyle = '#0E0E0E';
    fCtx.lineWidth = 2.5;
    fCtx.beginPath();
    fCtx.arc(emblemCx, emblemCy, emblemR - 10, 0, Math.PI * 2);
    fCtx.stroke();

    // Inner Dashed Geometric Ring
    fCtx.strokeStyle = '#0E0E0E';
    fCtx.lineWidth = 1.8;
    fCtx.setLineDash([5, 5]);
    fCtx.beginPath();
    fCtx.arc(emblemCx, emblemCy, emblemR - 18, 0, Math.PI * 2);
    fCtx.stroke();
    fCtx.setLineDash([]);

    // Radial Sunburst Rays
    fCtx.strokeStyle = 'rgba(245, 200, 66, 0.45)';
    fCtx.lineWidth = 1.8;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 12) {
      fCtx.beginPath();
      fCtx.moveTo(emblemCx + Math.cos(a) * (emblemR - 38), emblemCy + Math.sin(a) * (emblemR - 38));
      fCtx.lineTo(emblemCx + Math.cos(a) * (emblemR - 20), emblemCy + Math.sin(a) * (emblemR - 20));
      fCtx.stroke();
    }

    // Spot UV on Gold Ring
    fUvCtx.strokeStyle = '#FFFFFF';
    fUvCtx.lineWidth = 6;
    fUvCtx.beginPath();
    fUvCtx.arc(emblemCx, emblemCy, emblemR, 0, Math.PI * 2);
    fUvCtx.stroke();

    // Botanical Vector Branch Artwork
    fCtx.save();
    fCtx.strokeStyle = '#0A0A0A';
    fCtx.fillStyle = '#F5C842';
    fCtx.lineWidth = 4;
    fCtx.lineCap = 'round';

    // Central Stem
    fCtx.beginPath();
    fCtx.moveTo(emblemCx, emblemCy + 90);
    fCtx.quadraticCurveTo(emblemCx - 15, emblemCy, emblemCx, emblemCy - 75);
    fCtx.stroke();

    // Left Leaves
    [-40, -10, 25, 60].forEach((yOff, idx) => {
      fCtx.beginPath();
      const lx = emblemCx - 8;
      const ly = emblemCy + yOff;
      fCtx.ellipse(lx - 34, ly - 10, 26, 12, -Math.PI / 3.5, 0, Math.PI * 2);
      fCtx.fillStyle = idx % 2 === 0 ? '#0A0A0A' : '#F5C842';
      fCtx.fill();
      fCtx.stroke();
    });

    // Right Leaves
    [-45, -15, 20, 55].forEach((yOff, idx) => {
      fCtx.beginPath();
      const rx = emblemCx + 8;
      const ry = emblemCy + yOff;
      fCtx.ellipse(rx + 34, ry - 10, 26, 12, Math.PI / 3.5, 0, Math.PI * 2);
      fCtx.fillStyle = idx % 2 === 1 ? '#0A0A0A' : '#F5C842';
      fCtx.fill();
      fCtx.stroke();
    });

    // Center Gold Cacao Pod Blossom
    fCtx.beginPath();
    fCtx.ellipse(emblemCx, emblemCy - 20, 18, 30, 0, 0, Math.PI * 2);
    fCtx.fillStyle = '#F5C842';
    fCtx.fill();
    fCtx.stroke();
    fCtx.restore();

    // Spot UV on Center Botanical Blossom
    fUvCtx.save();
    fUvCtx.fillStyle = '#FFFFFF';
    fUvCtx.beginPath();
    fUvCtx.ellipse(emblemCx, emblemCy - 20, 18, 30, 0, 0, Math.PI * 2);
    fUvCtx.fill();
    fUvCtx.restore();

    // Arched Ribbon Badges inside emblem
    fCtx.fillStyle = '#0A0A0A';
    fCtx.font = '800 13px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.letterSpacing = '3px';
    fCtx.fillText('★ SINGLE ESTATE HARVEST ★', emblemCx, emblemCy + 115);

    // PRODUCT TITLE & SPECS (Bold, Deep Black)
    fCtx.fillStyle = '#0A0A0A';
    fCtx.font = '900 48px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.letterSpacing = '2px';
    fCtx.fillText('GOLDEN CACAO CRUNCH', W / 2, 880);

    fCtx.fillStyle = '#2A241C';
    fCtx.font = '700 18px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.letterSpacing = '2px';
    fCtx.fillText('ALTO BENI CRUNCH · INFUSED WITH HEIRLOOM BOURBON VANILLA', W / 2, 915);

    // Spot UV on Product Headline
    fUvCtx.fillStyle = '#E0E0E0';
    fUvCtx.font = '900 48px "Space Grotesk", "Space Grotesk", sans-serif';
    fUvCtx.letterSpacing = '2px';
    fUvCtx.fillText('GOLDEN CACAO CRUNCH', W / 2, 880);

    // 3 Benefit Capsule Pills with high contrast
    const pills = [
      { text: '🌱 100% PLANT BASED', x: W / 2 - 275 },
      { text: '🌾 GLUTEN FREE', x: W / 2 },
      { text: '✨ ZERO REFINED SUGAR', x: W / 2 + 275 }
    ];

    pills.forEach((p) => {
      const pw = 245;
      const ph = 44;
      const px = p.x - pw / 2;
      const py = 955;

      drawRoundedRect(fCtx, px, py, pw, ph, 22);
      fCtx.fillStyle = '#FAF7EE';
      fCtx.fill();
      fCtx.strokeStyle = '#1A1814';
      fCtx.lineWidth = 2;
      fCtx.stroke();

      fCtx.fillStyle = '#0A0A0A';
      fCtx.font = '800 13px "Space Grotesk", "Space Grotesk", sans-serif';
      fCtx.letterSpacing = '1px';
      fCtx.fillText(p.text, p.x, py + 28);
    });

    // SIGNATURE PACKIT YELLOW HERO BANNER (Vibrant & Punchy)
    const bannerW = 860;
    const bannerH = 104;
    const bannerX = (W - bannerW) / 2;
    const bannerY = 1040;

    drawRoundedRect(fCtx, bannerX, bannerY, bannerW, bannerH, 18);
    fCtx.fillStyle = '#F5C842';
    fCtx.fill();
    fCtx.strokeStyle = '#0E0E0E';
    fCtx.lineWidth = 3;
    fCtx.stroke();

    fCtx.fillStyle = '#0A0A0A';
    fCtx.font = '900 25px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.letterSpacing = '3px';
    fCtx.fillText('STAND-UP BIO-BARRIER POUCH · HOME COMPOSTABLE', W / 2, bannerY + 45);

    fCtx.font = '800 18px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.letterSpacing = '4px';
    fCtx.fillStyle = '#1A1814';
    fCtx.fillText('NET WT. 250G · 8.8 OZ', W / 2, bannerY + 78);

    // Spot UV on Yellow Banner
    drawRoundedRect(fUvCtx, bannerX, bannerY, bannerW, bannerH, 18);
    fUvCtx.fillStyle = '#FFFFFF';
    fUvCtx.fill();

    // 4 OFFICIAL PACKAGING CERTIFICATION STAMPS (High contrast)
    const stampY = 1225;
    const stampConfigs = [
      { x: W / 2 - 315, title: 'USDA', sub: 'ORGANIC', icon: 'leaf' },
      { x: W / 2 - 105, title: 'NON-GMO', sub: 'PROJECT', icon: 'check' },
      { x: W / 2 + 105, title: '100% BIO', sub: 'COMPOST', icon: 'recycle' },
      { x: W / 2 + 315, title: 'FAIR', sub: 'FOR LIFE', icon: 'scale' }
    ];

    stampConfigs.forEach((st) => {
      const sR = 46;
      fCtx.save();
      fCtx.fillStyle = '#FAF7EE';
      fCtx.beginPath();
      fCtx.arc(st.x, stampY, sR, 0, Math.PI * 2);
      fCtx.fill();

      fCtx.strokeStyle = '#0A0A0A';
      fCtx.lineWidth = 2.5;
      fCtx.stroke();

      fCtx.strokeStyle = '#F5C842';
      fCtx.lineWidth = 2;
      fCtx.beginPath();
      fCtx.arc(st.x, stampY, sR - 6, 0, Math.PI * 2);
      fCtx.stroke();

      fCtx.fillStyle = '#0A0A0A';
      fCtx.font = '900 13px "Space Grotesk", "Space Grotesk", sans-serif';
      fCtx.letterSpacing = '1px';
      fCtx.fillText(st.title, st.x, stampY - 8);

      fCtx.font = '700 11px "Space Grotesk", "Space Grotesk", sans-serif';
      fCtx.fillStyle = '#3A3225';
      fCtx.fillText(st.sub, st.x, stampY + 9);

      // Mini Icon Motif
      fCtx.fillStyle = '#F5C842';
      fCtx.beginPath();
      fCtx.arc(st.x, stampY + 23, 4.5, 0, Math.PI * 2);
      fCtx.fill();
      fCtx.restore();

      // Spot UV on stamps
      fUvCtx.strokeStyle = '#E0E0E0';
      fUvCtx.lineWidth = 2.5;
      fUvCtx.beginPath();
      fUvCtx.arc(st.x, stampY, sR, 0, Math.PI * 2);
      fUvCtx.stroke();
    });

    // FOOTER SHELF DETAIL BAR & BARCODE
    const footY = 1360;
    fCtx.strokeStyle = '#0A0A0A';
    fCtx.lineWidth = 2;
    fCtx.beginPath();
    fCtx.moveTo(80, footY);
    fCtx.lineTo(W - 80, footY);
    fCtx.stroke();

    // Retail Barcode Graphic
    const barX = 110;
    const barY = footY + 25;
    fCtx.fillStyle = '#0A0A0A';
    for (let i = 0; i < 48; i++) {
      const bw = (i % 4 === 0 || i % 7 === 0) ? 6 : (i % 2 === 0 ? 3 : 2);
      fCtx.fillRect(barX + i * 7.5, barY, bw, 52);
    }
    fCtx.font = '700 12px "Space Grotesk", monospace';
    fCtx.letterSpacing = '3px';
    fCtx.fillText('8 410294 008124', barX + 180, barY + 70);

    // Center FSC Stamp
    fCtx.fillStyle = '#1A1814';
    fCtx.font = '800 13px "Space Grotesk", "Space Grotesk", sans-serif';
    fCtx.letterSpacing = '2px';
    fCtx.fillText('FSC™ C012845 · RECYCLED PACKAGING', W / 2 + 30, barY + 25);
    fCtx.font = '700 12px "Space Grotesk", "Inter", sans-serif';
    fCtx.fillStyle = '#4A4033';
    fCtx.fillText('DIN CERTCO EN 13432 HOME COMPOSTABLE', W / 2 + 30, barY + 46);

    // Studio credit & brand logo
    if (packitLogoLoaded) {
      fCtx.drawImage(packitLogoImg, W - 200, barY + 12, 110, 42);
    } else {
      fCtx.textAlign = 'right';
      fCtx.fillStyle = '#0A0A0A';
      fCtx.font = '800 14px "Space Grotesk", "Space Grotesk", sans-serif';
      fCtx.fillText('PACKIT STUDIO', W - 100, barY + 25);
      fCtx.font = '600 11px "Space Grotesk", "Inter", sans-serif';
      fCtx.fillStyle = '#4A4033';
      fCtx.fillText('STRUCTURAL DESIGN', W - 100, barY + 44);
    }
  }

  /* ——— 2. BACK TEXTURE RENDERER (VIBRANT, HIGH-CONTRAST & ULTRA-READABLE) ——— */
  const backCanvas = document.createElement('canvas');
  backCanvas.width = 1024;
  backCanvas.height = 1536;
  const bCtx = backCanvas.getContext('2d');

  function renderBackArtwork() {
    const W = backCanvas.width;
    const H = backCanvas.height;

    // Rich Kraft Paper Substrate
    drawPaperSubstrate(bCtx, W, H, '#EAE1CE');

    // Heat Seal Header with Back Reseal Instructions
    drawThermalCrimpHeader(bCtx, null, W);

    // Back Header Reseal Callout
    bCtx.fillStyle = '#F5C842';
    bCtx.font = '800 13px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.letterSpacing = '2px';
    bCtx.fillText('TO OPEN: TEAR NOTCH & PULL ZIPPER · PRESS FIRMLY TO RESEAL', W / 2, 240);

    // HARVEST STORY PANEL (Bold, Crisp & Punchy)
    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '900 26px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.letterSpacing = '4px';
    bCtx.textAlign = 'left';
    bCtx.fillText('THE BLOOM HARVEST STORY', 80, 295);

    // Bright Gold accent bar
    bCtx.fillStyle = '#F5C842';
    bCtx.fillRect(80, 310, 100, 6);

    bCtx.fillStyle = '#111111';
    bCtx.font = '600 19px "Space Grotesk", "Inter", sans-serif';
    const storyLines = [
      'We partner directly with family-run regenerative agroforestry cooperatives in the',
      'Alto Beni river basin. Every cacao harvest is shade-grown beneath native forest canopy,',
      'hand-gathered, and slowly stone-ground at low temperatures to protect delicate flavonoids.',
      'Our stand-up pouch uses plant-derived bio-barrier film that locks in peak roasted crunch',
      'while returning harmlessly to the soil in home compost.'
    ];
    storyLines.forEach((line, idx) => {
      bCtx.fillText(line, 80, 350 + idx * 30);
    });

    // NUTRITION FACTS PANEL (Clean Crisp White Card with Solid 4px Black Border)
    const nX = 80;
    const nY = 520;
    const nW = 430;
    const nH = 590;

    // Pure white background
    bCtx.fillStyle = '#FFFFFF';
    bCtx.fillRect(nX, nY, nW, nH);
    bCtx.strokeStyle = '#0A0A0A';
    bCtx.lineWidth = 4;
    bCtx.strokeRect(nX, nY, nW, nH);

    // Nutrition text in true black
    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '900 38px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.fillText('Nutrition Facts', nX + 16, nY + 44);

    bCtx.font = '600 14px "Space Grotesk", "Inter", sans-serif';
    bCtx.fillText('8 servings per container', nX + 16, nY + 68);
    bCtx.font = '800 15px "Space Grotesk", "Inter", sans-serif';
    bCtx.fillText('Serving size        1/4 cup (30g)', nX + 16, nY + 90);

    // Solid thick black divider bar
    bCtx.fillRect(nX + 16, nY + 98, nW - 32, 12);

    bCtx.font = '800 14px "Space Grotesk", "Inter", sans-serif';
    bCtx.fillText('Amount per serving', nX + 16, nY + 126);
    bCtx.font = '900 36px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.fillText('Calories            140', nX + 16, nY + 160);

    // Medium black bar
    bCtx.fillRect(nX + 16, nY + 170, nW - 32, 6);

    bCtx.font = '800 13px "Space Grotesk", "Inter", sans-serif';
    bCtx.textAlign = 'right';
    bCtx.fillText('% Daily Value*', nX + nW - 20, nY + 190);
    bCtx.textAlign = 'left';

    const nutrients = [
      { name: 'Total Fat 7g', dv: '9%', indent: false },
      { name: 'Saturated Fat 3.5g', dv: '18%', indent: true },
      { name: 'Trans Fat 0g', dv: '', indent: true },
      { name: 'Cholesterol 0mg', dv: '0%', indent: false },
      { name: 'Sodium 35mg', dv: '2%', indent: false },
      { name: 'Total Carbohydrate 18g', dv: '7%', indent: false },
      { name: 'Dietary Fiber 5g', dv: '18%', indent: true },
      { name: 'Total Sugars 2g', dv: '', indent: true },
      { name: 'Protein 4g', dv: '', indent: false }
    ];

    nutrients.forEach((nut, i) => {
      const rowY = nY + 212 + i * 26;
      bCtx.strokeStyle = '#0A0A0A';
      bCtx.lineWidth = 1.2;
      bCtx.beginPath();
      bCtx.moveTo(nX + 16, rowY + 6);
      bCtx.lineTo(nX + nW - 16, rowY + 6);
      bCtx.stroke();

      bCtx.font = nut.indent ? '600 13px "Space Grotesk", sans-serif' : '800 14px "Space Grotesk", sans-serif';
      bCtx.fillStyle = '#0A0A0A';
      bCtx.fillText((nut.indent ? '    ' : '') + nut.name, nX + 16, rowY);

      if (nut.dv) {
        bCtx.font = '800 14px "Space Grotesk", sans-serif';
        bCtx.textAlign = 'right';
        bCtx.fillText(nut.dv, nX + nW - 20, rowY);
        bCtx.textAlign = 'left';
      }
    });

    // Footnote
    bCtx.fillRect(nX + 16, nY + 452, nW - 32, 6);
    bCtx.font = '700 12px "Space Grotesk", sans-serif';
    bCtx.fillStyle = '#1A1814';
    bCtx.fillText('Vitamin D 0%  ·  Calcium 4%  ·  Iron 14%  ·  Potassium 8%', nX + 16, nY + 474);
    bCtx.font = '500 11px "Space Grotesk", sans-serif';
    bCtx.fillText('*The % Daily Value (DV) tells you how much a nutrient in', nX + 16, nY + 496);
    bCtx.fillText('a serving of food contributes to a daily 2,000 calorie diet.', nX + 16, nY + 512);

    // RIGHT SIDE: INGREDIENTS & ALLERGENS PANEL (Framed card for high visibility)
    const iX = 545;
    const iY = 520;
    const iW = 400;
    const iH = 590;

    // Framed card
    drawRoundedRect(bCtx, iX - 15, iY, iW + 30, iH, 16);
    bCtx.fillStyle = '#FAF7EE';
    bCtx.fill();
    bCtx.strokeStyle = '#0A0A0A';
    bCtx.lineWidth = 2.5;
    bCtx.stroke();

    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '900 19px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.letterSpacing = '2px';
    bCtx.fillText('✦ INGREDIENTS:', iX, iY + 36);

    bCtx.fillStyle = '#111111';
    bCtx.font = '600 16px "Space Grotesk", "Inter", sans-serif';
    const ingLines = [
      'Organic Wild Harvested Cacao Nibs,',
      'Organic Coconut Flower Blossom Nectar,',
      'Organic Puffed Andean Quinoa,',
      'Pink Himalayan Salt,',
      'Organic Bourbon Vanilla Bean Pod.'
    ];
    ingLines.forEach((il, idx) => {
      bCtx.fillText(il, iX, iY + 70 + idx * 28);
    });

    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '900 17px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.fillText('✦ ALLERGEN INFORMATION:', iX, iY + 240);

    bCtx.fillStyle = '#111111';
    bCtx.font = '600 15px "Space Grotesk", "Inter", sans-serif';
    bCtx.fillText('Free from dairy, gluten, peanuts, tree nuts, and soy.', iX, iY + 268);
    bCtx.fillText('Crafted in an exclusively allergen-free clean facility.', iX, iY + 292);

    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '900 17px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.fillText('✦ STORAGE & CARE:', iX, iY + 350);

    bCtx.fillStyle = '#111111';
    bCtx.font = '600 15px "Space Grotesk", "Inter", sans-serif';
    bCtx.fillText('Store in a cool, dry cupboard away from direct light.', iX, iY + 378);
    bCtx.fillText('Keep sealed after opening to retain peak freshness.', iX, iY + 402);

    // Eco badge pill
    drawRoundedRect(bCtx, iX, iY + 460, iW, 60, 12);
    bCtx.fillStyle = '#F5C842';
    bCtx.fill();
    bCtx.strokeStyle = '#0A0A0A';
    bCtx.lineWidth = 2;
    bCtx.stroke();

    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '900 14px "Space Grotesk", sans-serif';
    bCtx.letterSpacing = '1px';
    bCtx.fillText('🌱 100% HOME COMPOSTABLE PACKAGING', iX + 15, iY + 496);

    // QR CODE TRACEABILITY & BARCODE SECTION (Pure White Card)
    const qrY = 1145;
    bCtx.strokeStyle = '#0A0A0A';
    bCtx.lineWidth = 2;
    bCtx.beginPath();
    bCtx.moveTo(80, qrY);
    bCtx.lineTo(W - 80, qrY);
    bCtx.stroke();

    // Stylized QR Matrix
    const qBoxX = 80;
    const qBoxY = qrY + 25;
    const qSize = 120;
    bCtx.fillStyle = '#FFFFFF';
    bCtx.fillRect(qBoxX, qBoxY, qSize, qSize);
    bCtx.strokeStyle = '#0A0A0A';
    bCtx.lineWidth = 2.5;
    bCtx.strokeRect(qBoxX, qBoxY, qSize, qSize);

    // QR simulation modules in deep black
    bCtx.fillStyle = '#0A0A0A';
    [[qBoxX + 10, qBoxY + 10], [qBoxX + qSize - 35, qBoxY + 10], [qBoxX + 10, qBoxY + qSize - 35]].forEach(([cx, cy]) => {
      bCtx.fillRect(cx, cy, 25, 25);
      bCtx.fillStyle = '#FFFFFF';
      bCtx.fillRect(cx + 5, cy + 5, 15, 15);
      bCtx.fillStyle = '#0A0A0A';
      bCtx.fillRect(cx + 8, cy + 8, 9, 9);
    });

    for (let r = 0; r < 7; r++) {
      for (let c = 0; c < 7; c++) {
        if ((r + c) % 2 === 0 || (r * c) % 3 === 0) {
          bCtx.fillRect(qBoxX + 38 + c * 6.5, qBoxY + 38 + r * 6.5, 5.5, 5.5);
        }
      }
    }

    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '900 16px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.letterSpacing = '1px';
    bCtx.fillText('SCAN FOR BATCH TRACEABILITY', qBoxX + qSize + 25, qBoxY + 35);

    bCtx.fillStyle = '#1A1814';
    bCtx.font = '600 14px "Space Grotesk", "Inter", sans-serif';
    bCtx.fillText('View farmer cooperative partner, harvest timestamp, and lab analysis.', qBoxX + qSize + 25, qBoxY + 62);

    bCtx.font = '800 14px "Space Grotesk", monospace';
    bCtx.fillStyle = '#0A0A0A';
    bCtx.fillText('BATCH: LOT-ALB-2026-048  ·  BEST BEFORE: 10/2027', qBoxX + qSize + 25, qBoxY + 95);

    // Full Barcode on clean white card
    const bBarCardX = W - 340;
    const bBarCardY = qrY + 25;
    const bBarCardW = 260;
    const bBarCardH = 120;
    bCtx.fillStyle = '#FFFFFF';
    bCtx.fillRect(bBarCardX, bBarCardY, bBarCardW, bBarCardH);
    bCtx.strokeStyle = '#0A0A0A';
    bCtx.lineWidth = 2;
    bCtx.strokeRect(bBarCardX, bBarCardY, bBarCardW, bBarCardH);

    bCtx.fillStyle = '#0A0A0A';
    const bBarX = bBarCardX + 20;
    const bBarY = bBarCardY + 15;
    for (let i = 0; i < 36; i++) {
      const bw = (i % 3 === 0) ? 5 : 2.5;
      bCtx.fillRect(bBarX + i * 6.2, bBarY, bw, 62);
    }
    bCtx.font = '700 13px "Space Grotesk", monospace';
    bCtx.letterSpacing = '2px';
    bCtx.fillText('8 410294 008124', bBarX + 35, bBarY + 86);

    // Bottom Studio Attribution & Brand Logo
    if (packitLogoLoaded) {
      bCtx.drawImage(packitLogoImg, W / 2 - 70, 1400, 140, 54);
    }
    bCtx.fillStyle = '#1A1814';
    bCtx.font = '700 13px "Space Grotesk", "Inter", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.fillText('STRUCTURAL DESIGN & SUSTAINABLE BRANDING BY PACKIT STUDIO', W / 2, 1475);
  }

  /* ——— 3. SIDE GUSSET TEXTURE RENDERER ——— */
  function createSideGussetTexture(isLeft) {
    const sCanvas = document.createElement('canvas');
    sCanvas.width = 384;
    sCanvas.height = 1536;
    const sCtx = sCanvas.getContext('2d');

    // Rich Kraft Paper Substrate
    drawPaperSubstrate(sCtx, 384, 1536, '#EAE1CE');

    // Solid Black Header
    sCtx.fillStyle = '#0E0E0E';
    sCtx.fillRect(0, 0, 384, 205);
    for (let y = 14; y < 180; y += 7) {
      sCtx.fillStyle = 'rgba(255, 255, 255, 0.12)';
      sCtx.fillRect(0, y, 384, 2);
    }

    // Signature PackIt Yellow vertical ribbon stripe (vibrant 20px band)
    sCtx.fillStyle = '#F5C842';
    sCtx.fillRect(isLeft ? 364 : 0, 205, 20, 1331);

    // Rotated Vertical Typography along the gusset in deep black
    sCtx.save();
    sCtx.translate(192, 850);
    sCtx.rotate(-Math.PI / 2);

    sCtx.fillStyle = '#0A0A0A';
    sCtx.font = '900 22px "Space Grotesk", "Space Grotesk", sans-serif';
    sCtx.textAlign = 'center';
    sCtx.letterSpacing = '6px';

    if (isLeft) {
      sCtx.fillText('✦ 100% HOME COMPOSTABLE · FSC™ KRAFT · BIO-BARRIER FILM ✦', 0, 0);
    } else {
      sCtx.fillText('BLOOM ARTISAN BOTANICALS · SMALL BATCH CRAFT · PACKIT DESIGN', 0, 0);
    }
    sCtx.restore();

    const tex = new THREE.CanvasTexture(sCanvas);
    tex.anisotropy = renderer.capabilities.getMaxAnisotropy();
    return { canvas: sCanvas, texture: tex };
  }

  /* ——— 4. TOP & BOTTOM GUSSET TEXTURES ——— */
  function createTopTexture() {
    const tCanvas = document.createElement('canvas');
    tCanvas.width = 1024;
    tCanvas.height = 384;
    const tCtx = tCanvas.getContext('2d');

    tCtx.fillStyle = '#0E0E0E';
    tCtx.fillRect(0, 0, 1024, 384);

    // Thermal Crimp grooves
    for (let y = 20; y < 360; y += 12) {
      tCtx.fillStyle = 'rgba(255, 255, 255, 0.15)';
      tCtx.fillRect(0, y, 1024, 3);
      tCtx.fillStyle = 'rgba(0, 0, 0, 0.9)';
      tCtx.fillRect(0, y + 3, 1024, 3);
    }

    // Euro slot center cutout
    tCtx.fillStyle = '#FAF8F4';
    tCtx.beginPath();
    tCtx.arc(512, 192, 20, 0, Math.PI * 2);
    tCtx.fill();

    const tex = new THREE.CanvasTexture(tCanvas);
    return tex;
  }

  function createBottomTexture() {
    const bCanvas = document.createElement('canvas');
    bCanvas.width = 1024;
    bCanvas.height = 384;
    const bCtx = bCanvas.getContext('2d');

    drawPaperSubstrate(bCtx, 1024, 384, '#E5DCB8');

    // Oval base gusset fold crease
    bCtx.strokeStyle = 'rgba(10, 8, 5, 0.35)';
    bCtx.lineWidth = 3.5;
    bCtx.beginPath();
    bCtx.ellipse(512, 192, 420, 140, 0, 0, Math.PI * 2);
    bCtx.stroke();

    bCtx.fillStyle = '#0A0A0A';
    bCtx.font = '800 16px "Space Grotesk", "Space Grotesk", sans-serif';
    bCtx.textAlign = 'center';
    bCtx.letterSpacing = '3px';
    bCtx.fillText('FSC™ STAND-UP POUCH BASE · COMPOST WITH FOOD ORGANICS', 512, 196);

    const tex = new THREE.CanvasTexture(bCanvas);
    return tex;
  }

  // Load Official PackIt Brand Logo Image for 3D packaging proof
  const packitLogoImg = new Image();
  let packitLogoLoaded = false;
  packitLogoImg.onload = () => {
    packitLogoLoaded = true;
    renderFrontArtwork();
    renderBackArtwork();
    if (typeof frontTexture !== 'undefined') frontTexture.needsUpdate = true;
    if (typeof backTexture !== 'undefined') backTexture.needsUpdate = true;
  };
  packitLogoImg.src = 'assets/images/logo.png';

  // Generate All Textures Initially
  renderFrontArtwork();
  renderBackArtwork();

  const frontTexture = new THREE.CanvasTexture(frontCanvas);
  frontTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const frontUvTexture = new THREE.CanvasTexture(frontUvCanvas);
  frontUvTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const backTexture = new THREE.CanvasTexture(backCanvas);
  backTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();

  const leftGusset = createSideGussetTexture(true);
  const rightGusset = createSideGussetTexture(false);
  const topTexture = createTopTexture();
  const bottomTexture = createBottomTexture();

  // Re-render when Space Grotesk font is loaded
  if (document.fonts) {
    document.fonts.ready.then(() => {
      renderFrontArtwork();
      renderBackArtwork();
      frontTexture.needsUpdate = true;
      frontUvTexture.needsUpdate = true;
      backTexture.needsUpdate = true;
    });
  }

  /* =========================================================
     BUILD 3D POUCH GEOMETRY & PHYSICAL MATERIALS
     ========================================================= */
  const pouchWidth = 2.4;
  const pouchHeight = 3.6;
  const pouchDepth = 0.9;

  // Box Geometry with vertex deformation for authentic pouch ergonomics
  const pouchGeo = new THREE.BoxGeometry(pouchWidth, pouchHeight, pouchDepth, 32, 32, 16);

  const pos = pouchGeo.attributes.position;
  for (let i = 0; i < pos.count; i++) {
    const x = pos.getX(i);
    const y = pos.getY(i);
    const z = pos.getZ(i);

    // Subtle ergonomic belly bulge in lower-middle
    const heightFactor = Math.sin(((y + pouchHeight * 0.5) / pouchHeight) * Math.PI);
    const depthExpand = (1 - Math.abs(x / (pouchWidth * 0.5))) * heightFactor * 0.22;
    if (z > 0) pos.setZ(i, z + depthExpand);
    if (z < 0) pos.setZ(i, z - depthExpand);

    // Taper at upper heat seal
    if (y > pouchHeight * 0.35) {
      const taper = (y - pouchHeight * 0.35) / (pouchHeight * 0.15);
      pos.setZ(i, z * Math.max(0.18, 1 - taper * 0.8));
    }
  }
  pouchGeo.computeVertexNormals();

  // Multi-material setup: BoxGeometry 6 faces
  const frontMat = new THREE.MeshPhysicalMaterial({
    map: frontTexture,
    roughness: 0.35,
    metalness: 0.03,
    clearcoat: 0.9,
    clearcoatRoughnessMap: frontUvTexture,
    clearcoatRoughness: 0.12,
    reflectivity: 0.6
  });

  const backMat = new THREE.MeshPhysicalMaterial({
    map: backTexture,
    roughness: 0.38,
    metalness: 0.03,
    clearcoat: 0.45,
    clearcoatRoughness: 0.2,
    reflectivity: 0.5
  });

  const sideLeftMat = new THREE.MeshPhysicalMaterial({
    map: leftGusset.texture,
    roughness: 0.45,
    metalness: 0.02,
    clearcoat: 0.3
  });

  const sideRightMat = new THREE.MeshPhysicalMaterial({
    map: rightGusset.texture,
    roughness: 0.45,
    metalness: 0.02,
    clearcoat: 0.3
  });

  const topMat = new THREE.MeshPhysicalMaterial({
    map: topTexture,
    roughness: 0.55,
    metalness: 0.02
  });

  const bottomMat = new THREE.MeshPhysicalMaterial({
    map: bottomTexture,
    roughness: 0.55,
    metalness: 0.02
  });

  const pouchMaterials = [
    sideRightMat, // 0: +X
    sideLeftMat,  // 1: -X
    topMat,       // 2: +Y
    bottomMat,    // 3: -Y
    frontMat,     // 4: +Z (Front)
    backMat       // 5: -Z (Back)
  ];

  const pouchMesh = new THREE.Mesh(pouchGeo, pouchMaterials);
  pouchMesh.castShadow = true;
  pouchMesh.receiveShadow = true;
  packageGroup.add(pouchMesh);

  // Soft Ground Contact Shadow (richer falloff)
  const shadowGeo = new THREE.PlaneGeometry(6, 6);
  const shadowCanvas = document.createElement('canvas');
  shadowCanvas.width = 256;
  shadowCanvas.height = 256;
  const sctx = shadowCanvas.getContext('2d');
  const grad = sctx.createRadialGradient(128, 128, 10, 128, 128, 120);
  grad.addColorStop(0, 'rgba(15, 12, 10, 0.55)');
  grad.addColorStop(0.4, 'rgba(15, 12, 10, 0.22)');
  grad.addColorStop(1, 'rgba(15, 12, 10, 0)');
  sctx.fillStyle = grad;
  sctx.fillRect(0, 0, 256, 256);
  const shadowTexture = new THREE.CanvasTexture(shadowCanvas);

  const shadowMat = new THREE.MeshBasicMaterial({
    map: shadowTexture,
    transparent: true,
    opacity: 0.75,
    depthWrite: false
  });
  const shadowPlane = new THREE.Mesh(shadowGeo, shadowMat);
  shadowPlane.rotation.x = -Math.PI / 2;
  shadowPlane.position.y = -pouchHeight * 0.5 - 0.05;
  shadowPlane.scale.set(1.4, 0.75, 1);
  packageGroup.add(shadowPlane);

  /* =========================================================
     INTERACTION & VIEW CONTROLS
     ========================================================= */
  let mouseX = 0, mouseY = 0;
  // Default: Front view with slight beauty angle
  let targetRotX = 0, targetRotY = 0;
  let isDragging = false;
  let prevMouseX = 0, prevMouseY = 0;

  window.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
  });

  // Mouse Drag to 360° Rotate
  renderer.domElement.addEventListener('mousedown', (e) => {
    isDragging = true;
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
    renderer.domElement.style.cursor = 'grabbing';
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
    renderer.domElement.style.cursor = 'grab';
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - prevMouseX;
    const deltaY = e.clientY - prevMouseY;
    targetRotY += deltaX * 0.008;
    targetRotX += deltaY * 0.008;
    // Constrain pitch
    targetRotX = Math.max(-0.45, Math.min(0.45, targetRotX));
    prevMouseX = e.clientX;
    prevMouseY = e.clientY;
  });

  // Touch Support for Mobile / Tablet Drag
  renderer.domElement.addEventListener('touchstart', (e) => {
    if (e.touches.length === 1) {
      isDragging = true;
      prevMouseX = e.touches[0].clientX;
      prevMouseY = e.touches[0].clientY;
    }
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || e.touches.length !== 1) return;
    const deltaX = e.touches[0].clientX - prevMouseX;
    const deltaY = e.touches[0].clientY - prevMouseY;
    targetRotY += deltaX * 0.009;
    targetRotX += deltaY * 0.009;
    targetRotX = Math.max(-0.45, Math.min(0.45, targetRotX));
    prevMouseX = e.touches[0].clientX;
    prevMouseY = e.touches[0].clientY;
  }, { passive: true });

  // Angle Preset Buttons
  const btnFront = document.getElementById('piBtnFront');
  const btnAngle = document.getElementById('piBtnAngle');
  const btnBack = document.getElementById('piBtnBack');

  function setActiveBtn(activeBtn) {
    [btnFront, btnAngle, btnBack].forEach(b => b?.classList.remove('active'));
    activeBtn?.classList.add('active');
  }

  btnFront?.addEventListener('click', (e) => {
    e.stopPropagation();
    targetRotY = 0;
    targetRotX = 0;
    setActiveBtn(btnFront);
  });

  btnAngle?.addEventListener('click', (e) => {
    e.stopPropagation();
    targetRotY = 0.55;
    targetRotX = 0.08;
    setActiveBtn(btnAngle);
  });

  btnBack?.addEventListener('click', (e) => {
    e.stopPropagation();
    targetRotY = Math.PI;
    targetRotX = 0;
    setActiveBtn(btnBack);
  });

  // Scroll Listener
  let scrollProgress = 0;
  let targetScrollProgress = 0;

  function onScroll() {
    const hero = document.getElementById('hero');
    if (!hero) return;
    const scroll = window.scrollY;
    const heroH = hero.offsetHeight;
    targetScrollProgress = Math.max(0, Math.min(scroll / heroH, 1));
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Resize Handler
  window.addEventListener('resize', () => {
    if (!container) return;
    camera.aspect = container.offsetWidth / container.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.offsetWidth, container.offsetHeight);
    updateLayout();
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const delta = clock.getDelta();
    const elapsedTime = clock.getElapsedTime();

    // Smooth scroll interpolation
    scrollProgress += (targetScrollProgress - scrollProgress) * 0.08;

    // Gentle floating breathing animation
    const floatY = Math.sin(elapsedTime * 1.5) * 0.055;
    pouchMesh.position.y = floatY;

    // Rotation from mouse parallax + target rotation
    const mouseRotY = mouseX * 0.16;
    const mouseRotX = mouseY * 0.1;

    pouchMesh.rotation.y += (targetRotY + mouseRotY - pouchMesh.rotation.y) * 0.09;
    pouchMesh.rotation.x += (targetRotX + mouseRotX - pouchMesh.rotation.x) * 0.09;
    pouchMesh.rotation.z = Math.sin(elapsedTime * 0.8) * 0.015;

    // Dynamically highlight active view button
    if (!isDragging) {
      const normalizedRotY = ((pouchMesh.rotation.y % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
      if (normalizedRotY < 0.28 || normalizedRotY > Math.PI * 2 - 0.28) {
        setActiveBtn(btnFront);
      } else if (Math.abs(normalizedRotY - Math.PI) < 0.35) {
        setActiveBtn(btnBack);
      } else if (Math.abs(normalizedRotY - 0.55) < 0.3) {
        setActiveBtn(btnAngle);
      }
    }

    renderer.render(scene, camera);
  }

  animate();
  console.log('✦ PackIt 3D Studio Engine Initialized — High Visibility Packaging Loaded');
})();
