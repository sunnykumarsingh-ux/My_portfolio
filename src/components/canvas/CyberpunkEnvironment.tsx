import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const CyberpunkEnvironment = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  // Blockchain Network Nodes and Lines
  const nodeCount = 150;
  
  const { positions, lineGeometry } = useMemo(() => {
    const pos = [];
    const points = [];
    
    // Generate random nodes in a 360-degree sphere around the origin
    for (let i = 0; i < nodeCount; i++) {
      const radius = 10 + Math.random() * 25; 
      const theta = Math.random() * Math.PI * 2; 
      const phi = Math.acos((Math.random() * 2) - 1); 

      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = radius * Math.cos(phi);
      
      pos.push(new THREE.Vector3(x, y, z));
      
      points.push(x, y, z);
    }
    
    // Connect nodes that are close to each other to form a "blockchain" network
    const lineIndices = [];
    const maxConnectionDistance = 8;
    
    for (let i = 0; i < nodeCount; i++) {
      for (let j = i + 1; j < nodeCount; j++) {
        const dist = pos[i].distanceTo(pos[j]);
        if (dist < maxConnectionDistance) {
          lineIndices.push(i, j);
        }
      }
    }
    
    const geom = new THREE.BufferGeometry();
    geom.setAttribute('position', new THREE.Float32BufferAttribute(points, 3));
    geom.setIndex(lineIndices);
    
    return { positions: points, lineGeometry: geom };
  }, []);

  // Floating Crypto Blocks (Octahedrons representing blocks in the chain)
  const blocksRef = useRef<THREE.InstancedMesh>(null);
  const blockCount = 40;

  const [blockPositions, blockScales, blockSpeeds] = useMemo(() => {
    const p = new Float32Array(blockCount * 3);
    const s = new Float32Array(blockCount * 3);
    const sp = new Float32Array(blockCount);
    
    for (let i = 0; i < blockCount; i++) {
      // 360-degree spread for the floating crypto blocks
      const radius = 12 + Math.random() * 20;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);

      p[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      p[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      p[i * 3 + 2] = radius * Math.cos(phi);

      const scale = 0.5 + Math.random();
      s[i * 3] = scale;
      s[i * 3 + 1] = scale;
      s[i * 3 + 2] = scale;

      sp[i] = (Math.random() * 0.02) + 0.01;
    }
    return [p, s, sp];
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Slowly rotate the entire blockchain network
    if (groupRef.current) {
      groupRef.current.rotation.y = time * 0.05;
      groupRef.current.rotation.z = Math.sin(time * 0.1) * 0.05;
    }

    // Animate floating blocks
    if (blocksRef.current) {
      for (let i = 0; i < blockCount; i++) {
        const idx = i * 3;
        
        // Lazy bobbing around their baseline spherical positions
        const y = blockPositions[idx + 1] + Math.sin(time * blockSpeeds[i] * 50 + i) * 2;

        dummy.position.set(blockPositions[idx], y, blockPositions[idx + 2]);
        dummy.scale.set(blockScales[idx], blockScales[idx + 1], blockScales[idx + 2]);
        
        // Complex tech rotation
        dummy.rotation.x = time * blockSpeeds[i] * 5;
        dummy.rotation.y = time * blockSpeeds[i] * 8;
        
        dummy.updateMatrix();
        blocksRef.current.setMatrixAt(i, dummy.matrix);
      }
      blocksRef.current.instanceMatrix.needsUpdate = true;
    }
  });

  return (
    <group ref={groupRef}>
      {/* Blockchain Node Network */}
      <group>
        {/* The connecting ledger lines */}
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial color="#915EFF" transparent opacity={0.15} />
        </lineSegments>
        
        {/* The nodes (Points) */}
        <points>
          <bufferGeometry>
            <bufferAttribute
              attach="attributes-position"
              count={positions.length / 3}
              array={new Float32Array(positions)}
              itemSize={3}
            />
          </bufferGeometry>
          <pointsMaterial color="#00ffff" size={0.15} sizeAttenuation transparent opacity={0.8} />
        </points>
      </group>

      {/* Floating Crypto Data Blocks */}
      <instancedMesh ref={blocksRef} args={[undefined, undefined, blockCount]}>
        <octahedronGeometry args={[1, 0]} />
        <meshStandardMaterial 
          color="#00ffff" 
          emissive="#00ffff" 
          emissiveIntensity={0.6} 
          transparent 
          opacity={0.4} 
          wireframe 
        />
      </instancedMesh>
    </group>
  );
};

export default CyberpunkEnvironment;
