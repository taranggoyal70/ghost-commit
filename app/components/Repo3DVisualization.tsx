"use client";

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Box, GitBranch, Zap, Star } from 'lucide-react';

interface Node {
  id: string;
  label: string;
  x: number;
  y: number;
  z: number;
  color: string;
  size: number;
  connections: string[];
}

export default function Repo3DVisualization({ isActive }: { isActive: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [rotation, setRotation] = useState(0);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const nodes: Node[] = [
    { id: 'root', label: 'Root', x: 0, y: 0, z: 0, color: '#9333ea', size: 20, connections: ['components', 'pages', 'api'] },
    { id: 'components', label: 'Components', x: -100, y: 50, z: 50, color: '#ec4899', size: 15, connections: ['button', 'card'] },
    { id: 'pages', label: 'Pages', x: 100, y: 50, z: -50, color: '#3b82f6', size: 15, connections: ['home', 'about'] },
    { id: 'api', label: 'API', x: 0, y: -50, z: 100, color: '#10b981', size: 15, connections: ['auth', 'data'] },
    { id: 'button', label: 'Button.tsx', x: -150, y: 100, z: 80, color: '#f59e0b', size: 10, connections: [] },
    { id: 'card', label: 'Card.tsx', x: -50, y: 100, z: 20, color: '#f59e0b', size: 10, connections: [] },
    { id: 'home', label: 'index.tsx', x: 150, y: 100, z: -80, color: '#06b6d4', size: 10, connections: [] },
    { id: 'about', label: 'about.tsx', x: 50, y: 100, z: -20, color: '#06b6d4', size: 10, connections: [] },
    { id: 'auth', label: 'auth.ts', x: -50, y: -100, z: 130, color: '#84cc16', size: 10, connections: [] },
    { id: 'data', label: 'data.ts', x: 50, y: -100, z: 70, color: '#84cc16', size: 10, connections: [] },
  ];

  useEffect(() => {
    if (!isActive || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Update rotation
      setRotation(prev => (prev + 0.005) % (Math.PI * 2));

      // Draw connections
      nodes.forEach(node => {
        node.connections.forEach(connId => {
          const targetNode = nodes.find(n => n.id === connId);
          if (!targetNode) return;

          const x1 = centerX + node.x * Math.cos(rotation) - node.z * Math.sin(rotation);
          const y1 = centerY + node.y;
          const x2 = centerX + targetNode.x * Math.cos(rotation) - targetNode.z * Math.sin(rotation);
          const y2 = centerY + targetNode.y;

          ctx.beginPath();
          ctx.moveTo(x1, y1);
          ctx.lineTo(x2, y2);
          ctx.strokeStyle = 'rgba(147, 51, 234, 0.3)';
          ctx.lineWidth = 2;
          ctx.stroke();
        });
      });

      // Draw nodes
      nodes.forEach(node => {
        const x = centerX + node.x * Math.cos(rotation) - node.z * Math.sin(rotation);
        const y = centerY + node.y;
        const scale = 1 + (node.z * Math.sin(rotation)) / 500;

        // Glow effect
        const gradient = ctx.createRadialGradient(x, y, 0, x, y, node.size * scale * 2);
        gradient.addColorStop(0, node.color + '80');
        gradient.addColorStop(1, node.color + '00');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, node.size * scale * 2, 0, Math.PI * 2);
        ctx.fill();

        // Node circle
        ctx.fillStyle = node.color;
        ctx.beginPath();
        ctx.arc(x, y, node.size * scale, 0, Math.PI * 2);
        ctx.fill();

        // Node border
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Label
        if (hoveredNode === node.id || node.size > 12) {
          ctx.fillStyle = '#ffffff';
          ctx.font = '12px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(node.label, x, y - node.size * scale - 10);
        }
      });

      requestAnimationFrame(animate);
    };

    animate();
  }, [isActive, rotation, hoveredNode]);

  return (
    <div className="relative w-full h-[600px] bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 rounded-2xl border border-purple-500/30 overflow-hidden">
      {/* Header */}
      <div className="absolute top-6 left-6 z-10">
        <div className="flex items-center space-x-3">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          >
            <Box className="w-8 h-8 text-purple-400" />
          </motion.div>
          <div>
            <h3 className="text-xl font-bold text-white">3D Repository Structure</h3>
            <p className="text-sm text-gray-400">Interactive dependency graph</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="absolute top-6 right-6 z-10 space-y-2">
        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <GitBranch className="w-4 h-4 text-green-400" />
            <span className="text-sm text-white font-medium">10 Files</span>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-white font-medium">AI Analyzing</span>
          </div>
        </div>
        <div className="bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg px-4 py-2">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-blue-400" />
            <span className="text-sm text-white font-medium">3 Issues</span>
          </div>
        </div>
      </div>

      {/* Canvas */}
      <canvas
        ref={canvasRef}
        width={1200}
        height={600}
        className="w-full h-full"
        onMouseMove={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const x = e.clientX - rect.left;
          const y = e.clientY - rect.top;
          
          // Simple hover detection
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;
          
          let found = false;
          nodes.forEach(node => {
            const nodeX = centerX + node.x * Math.cos(rotation) - node.z * Math.sin(rotation);
            const nodeY = centerY + node.y;
            const distance = Math.sqrt((x - nodeX) ** 2 + (y - nodeY) ** 2);
            
            if (distance < node.size * 2) {
              setHoveredNode(node.id);
              found = true;
            }
          });
          
          if (!found) setHoveredNode(null);
        }}
      />

      {/* Legend */}
      <div className="absolute bottom-6 left-6 z-10 bg-black/50 backdrop-blur-sm border border-purple-500/30 rounded-lg p-4">
        <p className="text-xs text-gray-400 mb-2">Legend:</p>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-purple-500"></div>
            <span className="text-xs text-white">Root</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-pink-500"></div>
            <span className="text-xs text-white">Components</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-blue-500"></div>
            <span className="text-xs text-white">Pages</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-green-500"></div>
            <span className="text-xs text-white">API</span>
          </div>
        </div>
      </div>

      {/* Particle effects */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
