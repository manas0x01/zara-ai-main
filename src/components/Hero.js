import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

const Hero = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    let scene, camera, renderer, particles;

    function initThreeJS() {
      scene = new THREE.Scene();
      camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
      renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current, alpha: true });
      renderer.setSize(window.innerWidth, window.innerHeight);

      const particleCount = 200;
      const positions = new Float32Array(particleCount * 3);
      const colors = new Float32Array(particleCount * 3);

      for (let i = 0; i < particleCount * 3; i += 3) {
        positions[i] = (Math.random() - 0.5) * 50;
        positions[i + 1] = (Math.random() - 0.5) * 50;
        positions[i + 2] = (Math.random() - 0.5) * 50;

        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.6);
        colors[i] = color.r;
        colors[i + 1] = color.g;
        colors[i + 2] = color.b;
      }

      const geometry = new THREE.BufferGeometry();
      geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
      geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

      const material = new THREE.PointsMaterial({
        size: 0.1,
        vertexColors: true,
        transparent: true,
        opacity: 0.8
      });

      particles = new THREE.Points(geometry, material);
      scene.add(particles);

      camera.position.z = 10;

      animate();
    }

    function animate() {
      requestAnimationFrame(animate);
      
      if (particles) {
        particles.rotation.x += 0.001;
        particles.rotation.y += 0.002;
      }

      renderer.render(scene, camera);
    }

    function handleResize() {
      if (renderer && camera) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
      }
    }

    initThreeJS();
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    }

  }, []);

  return (
    <section className="hero" id="home">
      <canvas ref={canvasRef} id="three-canvas"></canvas>
      <div className="container">
        <div className="hero-content">
          <h1>Meet Zara AI</h1>
          <p>Experience the future of AI conversation. Zara AI combines natural language understanding, advanced image analysis, and creative intelligence to become your perfect digital companion - completely free to use.</p>
          <div className="hero-buttons">
            <a href="#demo" className="cta-button">Try Demo</a>
            <a href="#features" className="secondary-button">Explore Features</a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;