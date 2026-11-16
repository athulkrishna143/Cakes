import React, { useMemo, useRef, useEffect } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { DRIP_FLAVORS, SPONGE_FLAVORS } from '../utils/cakeConfig';

function seededRandom(seed) {
  const x = Math.sin(seed * 9999.91) * 10000;
  return x - Math.floor(x);
}

function createFrostingBumpTexture(finish) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  if (finish === 'rustic') {
    for (let y = 0; y < 256; y += 6) {
      const shade = 110 + Math.sin(y * 0.25) * 35;
      ctx.fillStyle = `rgb(${shade},${shade},${shade})`;
      ctx.fillRect(0, y, 256, 4);
    }
  } else if (finish === 'buttercream') {
    for (let i = 0; i < 1800; i++) {
      const x = seededRandom(i) * 256;
      const y = seededRandom(i + 500) * 256;
      const v = 120 + seededRandom(i + 1000) * 20;
      ctx.fillStyle = `rgb(${v},${v},${v})`;
      ctx.fillRect(x, y, 3, 1.5);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

function createInscriptionTexture(text, fontStyle, primaryColor) {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 1024, 1024);

  if (!text || !text.trim()) {
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  }

  const c = new THREE.Color(primaryColor);
  const luminance = 0.299 * c.r + 0.587 * c.g + 0.114 * c.b;
  const inkColor = luminance < 0.45 ? '#FFF8EE' : '#3B2316';

  ctx.fillStyle = inkColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  let fontSpec = 'italic 92px "Great Vibes", cursive';
  if (fontStyle === 'serif') {
    fontSpec = '600 66px "Cormorant Garamond", Georgia, serif';
  } else if (fontStyle === 'playful') {
    fontSpec = '700 62px "Plus Jakarta Sans", sans-serif';
  }

  ctx.font = fontSpec;
  ctx.shadowColor = 'rgba(0,0,0,0.18)';
  ctx.shadowBlur = 6;
  ctx.shadowOffsetY = 3;

  const words = text.trim().split(' ');
  if (words.length > 2 && text.length > 14) {
    const mid = Math.ceil(words.length / 2);
    const line1 = words.slice(0, mid).join(' ');
    const line2 = words.slice(mid).join(' ');
    ctx.fillText(line1, 512, 470);
    ctx.fillText(line2, 512, 555);
  } else {
    ctx.fillText(text.trim(), 512, 512);
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 8;
  texture.needsUpdate = true;
  return texture;
}

function createRoundedSquareGeometry(width, height, radius = 0.08) {
  const shape = new THREE.Shape();
  const x = -width / 2;
  const y = -width / 2;
  shape.moveTo(x + radius, y);
  shape.lineTo(x + width - radius, y);
  shape.quadraticCurveTo(x + width, y, x + width, y + radius);
  shape.lineTo(x + width, y + width - radius);
  shape.quadraticCurveTo(x + width, y + width, x + width - radius, y + width);
  shape.lineTo(x + radius, y + width);
  shape.quadraticCurveTo(x, y + width, x, y + width - radius);
  shape.lineTo(x, y + radius);
  shape.quadraticCurveTo(x, y, x + radius, y);

  const geo = new THREE.ExtrudeGeometry(shape, {
    depth: height - 0.04,
    bevelEnabled: true,
    bevelSegments: 4,
    steps: 1,
    bevelSize: 0.02,
    bevelThickness: 0.02,
  });
  geo.rotateX(-Math.PI / 2);
  geo.translate(0, 0.02, 0);
  geo.computeVertexNormals();
  return geo;
}

function PipedBorder({ radius, yPos, shape, color }) {
  const meshRef = useRef();
  const count = shape === 'round' ? Math.max(24, Math.round(radius * 38)) : Math.max(28, Math.round(radius * 44));

  const dummy = useMemo(() => new THREE.Object3D(), []);

  useEffect(() => {
    if (!meshRef.current) return;
    for (let i = 0; i < count; i++) {
      const t = i / count;
      let x = 0;
      let z = 0;
      let rotY = 0;

      if (shape === 'round') {
        const angle = t * Math.PI * 2;
        x = Math.cos(angle) * radius;
        z = Math.sin(angle) * radius;
        rotY = -angle;
      } else {
        const side = radius * 1.82;
        const half = side / 2;
        const p = t * 4;
        if (p < 1) {
          x = -half + p * side;
          z = half;
          rotY = 0;
        } else if (p < 2) {
          x = half;
          z = half - (p - 1) * side;
          rotY = Math.PI / 2;
        } else if (p < 3) {
          x = half - (p - 2) * side;
          z = -half;
          rotY = Math.PI;
        } else {
          x = -half;
          z = -half + (p - 3) * side;
          rotY = -Math.PI / 2;
        }
      }

      dummy.position.set(x, yPos, z);
      dummy.rotation.set(0.35, rotY + 0.4, 0);
      dummy.scale.set(1, 0.85, 1.25);
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, [count, radius, yPos, shape, dummy]);

  return (
    <instancedMesh ref={meshRef} args={[null, null, count]} castShadow receiveShadow>
      <sphereGeometry args={[0.048, 12, 10]} />
      <meshStandardMaterial color={color} roughness={0.5} metalness={0.02} />
    </instancedMesh>
  );
}

function DripLayer({ radius, tierHeight, shape, dripColor }) {
  const drips = useMemo(() => {
    const count = shape === 'round' ? Math.round(radius * 26) : Math.round(radius * 30);
    const arr = [];
    for (let i = 0; i < count; i++) {
      const t = i / count;
      const len = 0.14 + seededRandom(i * 13.7 + radius * 10) * (tierHeight * 0.58);
      const thick = 0.036 + seededRandom(i * 7.1) * 0.016;
      let x = 0;
      let z = 0;

      if (shape === 'round') {
        const angle = t * Math.PI * 2;
        x = Math.cos(angle) * (radius + 0.008);
        z = Math.sin(angle) * (radius + 0.008);
      } else {
        const side = radius * 1.82;
        const half = side / 2 + 0.008;
        const p = t * 4;
        if (p < 1) {
          x = -half + p * side;
          z = half;
        } else if (p < 2) {
          x = half;
          z = half - (p - 1) * side;
        } else if (p < 3) {
          x = half - (p - 2) * side;
          z = -half;
        } else {
          x = -half;
          z = -half + (p - 3) * side;
        }
      }
      arr.push({ x, z, len, thick });
    }
    return arr;
  }, [radius, tierHeight, shape]);

  const topCapGeo = useMemo(() => {
    if (shape === 'round') {
      return new THREE.CylinderGeometry(radius + 0.012, radius + 0.012, 0.035, 64);
    }
    return createRoundedSquareGeometry(radius * 1.83, 0.035, 0.08);
  }, [radius, shape]);

  return (
    <group>
      <mesh
        geometry={topCapGeo}
        position={[0, shape === 'round' ? tierHeight - 0.01 : tierHeight - 0.03, 0]}
        castShadow
      >
        <meshPhysicalMaterial
          color={dripColor}
          roughness={0.14}
          metalness={0.04}
          clearcoat={0.85}
          clearcoatRoughness={0.1}
        />
      </mesh>

      {drips.map((d, idx) => (
        <group key={idx} position={[d.x, tierHeight - d.len / 2, d.z]}>
          <mesh castShadow>
            <cylinderGeometry args={[d.thick, d.thick * 0.92, d.len, 10]} />
            <meshPhysicalMaterial
              color={dripColor}
              roughness={0.14}
              clearcoat={0.85}
              clearcoatRoughness={0.1}
            />
          </mesh>
          <mesh position={[0, -d.len / 2, 0]} castShadow>
            <sphereGeometry args={[d.thick * 1.05, 10, 10]} />
            <meshPhysicalMaterial
              color={dripColor}
              roughness={0.14}
              clearcoat={0.85}
              clearcoatRoughness={0.1}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function ToppingsCluster({ topRadius, topY, toppings }) {
  const ringR = topRadius * 0.72;

  const items = useMemo(() => {
    const list = [];
    const active = toppings || [];
    if (active.length === 0) return list;

    const slots = 12;
    for (let i = 0; i < slots; i++) {
      const angle = (i / slots) * Math.PI * 2 + 0.2;
      const type = active[i % active.length];
      const rJitter = ringR * (0.92 + seededRandom(i * 3.3) * 0.14);
      list.push({
        type,
        x: Math.cos(angle) * rJitter,
        z: Math.sin(angle) * rJitter,
        rotY: angle + seededRandom(i * 9.2) * 1.5,
      });
    }
    return list;
  }, [toppings, ringR]);

  return (
    <group position={[0, topY, 0]}>
      {items.map((item, i) => {
        if (item.type === 'strawberries') {
          return (
            <group key={i} position={[item.x, 0.055, item.z]} rotation={[0.25, item.rotY, 0.15]}>
              <mesh castShadow scale={[1, 1.35, 1]}>
                <sphereGeometry args={[0.055, 14, 14]} />
                <meshStandardMaterial color="#C81D25" roughness={0.32} />
              </mesh>
              <mesh position={[0, 0.068, 0]} rotation={[0.2, 0, 0]}>
                <coneGeometry args={[0.045, 0.025, 6]} />
                <meshStandardMaterial color="#2D6A4F" roughness={0.6} />
              </mesh>
            </group>
          );
        }

        if (item.type === 'blueberries') {
          return (
            <group key={i} position={[item.x, 0.032, item.z]}>
              <mesh castShadow>
                <sphereGeometry args={[0.032, 12, 12]} />
                <meshStandardMaterial color="#2A3459" roughness={0.45} />
              </mesh>
              <mesh position={[0.035, -0.004, 0.02]} castShadow>
                <sphereGeometry args={[0.027, 12, 12]} />
                <meshStandardMaterial color="#34416E" roughness={0.45} />
              </mesh>
            </group>
          );
        }

        if (item.type === 'macarons') {
          const pastelColors = ['#F2B5D4', '#B8E0D2', '#F7D9C4', '#D6CDEA'];
          const mColor = pastelColors[i % pastelColors.length];
          return (
            <group key={i} position={[item.x, 0.06, item.z]} rotation={[0.45, item.rotY, 0.3]}>
              <mesh position={[0, 0.018, 0]} castShadow>
                <cylinderGeometry args={[0.055, 0.058, 0.022, 18]} />
                <meshStandardMaterial color={mColor} roughness={0.35} />
              </mesh>
              <mesh position={[0, 0, 0]}>
                <cylinderGeometry args={[0.052, 0.052, 0.015, 18]} />
                <meshStandardMaterial color="#FFF8EE" roughness={0.5} />
              </mesh>
              <mesh position={[0, -0.018, 0]} castShadow>
                <cylinderGeometry args={[0.058, 0.055, 0.022, 18]} />
                <meshStandardMaterial color={mColor} roughness={0.35} />
              </mesh>
            </group>
          );
        }

        if (item.type === 'gold_leaf') {
          return (
            <mesh
              key={i}
              position={[item.x, 0.008, item.z]}
              rotation={[-Math.PI / 2 + 0.08, item.rotY, 0.2]}
            >
              <planeGeometry args={[0.075, 0.055]} />
              <meshStandardMaterial
                color="#E5B94C"
                metalness={0.92}
                roughness={0.18}
                side={THREE.DoubleSide}
              />
            </mesh>
          );
        }

        if (item.type === 'chocolate_shards') {
          return (
            <mesh
              key={i}
              position={[item.x, 0.065, item.z]}
              rotation={[0.3, item.rotY, -0.25]}
              castShadow
            >
              <boxGeometry args={[0.085, 0.13, 0.012]} />
              <meshStandardMaterial color="#2C1810" roughness={0.22} metalness={0.05} />
            </mesh>
          );
        }

        if (item.type === 'sprinkles') {
          const spColors = ['#FF8FA3', '#FFD166', '#80ED99', '#90DBF4', '#CDB4DB'];
          return (
            <group key={i} position={[item.x, 0.008, item.z]}>
              {[0, 1, 2].map((sIdx) => (
                <mesh
                  key={sIdx}
                  position={[
                    (seededRandom(i * 11 + sIdx) - 0.5) * 0.12,
                    0,
                    (seededRandom(i * 17 + sIdx) - 0.5) * 0.12,
                  ]}
                  rotation={[Math.PI / 2, 0, seededRandom(i + sIdx) * 3]}
                >
                  <capsuleGeometry args={[0.006, 0.022, 4, 6]} />
                  <meshStandardMaterial color={spColors[(i + sIdx) % spColors.length]} roughness={0.3} />
                </mesh>
              ))}
            </group>
          );
        }

        return null;
      })}
    </group>
  );
}

function CandlesGroup({ count, topY, topRadius }) {
  const flamesRef = useRef([]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    flamesRef.current.forEach((flame, idx) => {
      if (!flame) return;
      const flicker = 1 + Math.sin(t * 11 + idx * 2.3) * 0.12;
      flame.scale.set(1, flicker, 1);
    });
  });

  if (!count || count <= 0) return null;

  const positions = [];
  for (let i = 0; i < count; i++) {
    if (count === 1) {
      positions.push([0, -topRadius * 0.36]);
    } else {
      const spread = Math.min(0.65, count * 0.07);
      const t = count === 1 ? 0 : (i / (count - 1) - 0.5) * 2;
      const angle = -Math.PI / 2 + t * spread;
      const r = topRadius * 0.42;
      positions.push([Math.cos(angle) * r, Math.sin(angle) * r]);
    }
  }

  return (
    <group position={[0, topY, 0]}>
      {positions.map(([x, z], idx) => (
        <group key={idx} position={[x, 0, z]}>
          <mesh position={[0, 0.01, 0]}>
            <cylinderGeometry args={[0.022, 0.015, 0.02, 12]} />
            <meshStandardMaterial color="#C59B43" metalness={0.8} roughness={0.25} />
          </mesh>
          <mesh position={[0, 0.14, 0]} castShadow>
            <cylinderGeometry args={[0.014, 0.016, 0.25, 14]} />
            <meshStandardMaterial color="#FFFDF9" roughness={0.35} />
          </mesh>
          <mesh
            ref={(el) => (flamesRef.current[idx] = el)}
            position={[0, 0.29, 0]}
          >
            <coneGeometry args={[0.016, 0.048, 10]} />
            <meshBasicMaterial color="#FFB703" />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function ProceduralCake({ config }) {
  const cakeGroupRef = useRef();

  const tiersData = useMemo(() => {
    const allTiers = [
      { radius: 1.25, height: 0.72 },
      { radius: 0.98, height: 0.68 },
      { radius: 0.72, height: 0.64 },
    ];
    const selected = allTiers.slice(3 - config.tiers);
    let currentY = 0;
    return selected.map((tier, idx) => {
      const item = {
        ...tier,
        yOffset: currentY,
        index: idx,
        isTop: idx === selected.length - 1,
      };
      currentY += tier.height;
      return item;
    });
  }, [config.tiers]);

  const bumpMap = useMemo(() => createFrostingBumpTexture(config.finish), [config.finish]);

  const dripColor = useMemo(() => {
    const found = DRIP_FLAVORS.find((d) => d.id === config.dripFlavor);
    return found ? found.color : '#2B170E';
  }, [config.dripFlavor]);

  const spongeColor = useMemo(() => {
    const found = SPONGE_FLAVORS.find((s) => s.id === config.sponge);
    return found ? found.color : '#F5E4B7';
  }, [config.sponge]);

  const inscriptionTex = useMemo(
    () => createInscriptionTexture(config.inscription, config.inscriptionFont, config.primaryColor),
    [config.inscription, config.inscriptionFont, config.primaryColor]
  );

  const scaleRef = useRef(0.95);
  useFrame((_, delta) => {
    if (!cakeGroupRef.current) return;
    scaleRef.current = THREE.MathUtils.lerp(scaleRef.current, 1, Math.min(1, delta * 10));
    cakeGroupRef.current.scale.setScalar(scaleRef.current);
  });

  useEffect(() => {
    scaleRef.current = 0.92;
  }, [config.tiers, config.shape]);

  const topTier = tiersData[tiersData.length - 1];
  const totalHeight = topTier.yOffset + topTier.height;

  const roughness =
    config.finish === 'fondant' ? 0.26 : config.finish === 'rustic' ? 0.72 : 0.56;

  return (
    <group position={[0, -0.85, 0]}>
      <group position={[0, -0.06, 0]}>
        <mesh receiveShadow castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[1.55, 1.52, 0.08, 64]} />
          <meshStandardMaterial color="#F4EFE6" roughness={0.22} metalness={0.05} />
        </mesh>
        <mesh position={[0, 0, 0]}>
          <torusGeometry args={[1.54, 0.015, 16, 64]} />
          <meshStandardMaterial color="#C59B43" metalness={0.85} roughness={0.25} />
        </mesh>
        <mesh position={[0, -0.32, 0]} castShadow>
          <cylinderGeometry args={[0.24, 0.36, 0.56, 32]} />
          <meshStandardMaterial color="#EAE2D3" roughness={0.3} />
        </mesh>
        <mesh position={[0, -0.62, 0]} receiveShadow castShadow>
          <cylinderGeometry args={[0.68, 0.74, 0.08, 48]} />
          <meshStandardMaterial color="#DFD4C0" roughness={0.32} />
        </mesh>
      </group>

      <group ref={cakeGroupRef}>
        {tiersData.map((tier) => {
          let tierColor = config.primaryColor;
          if (config.twoTone && tiersData.length > 1) {
            if (tier.index === 0) tierColor = config.secondaryColor;
            else if (tier.index === 1 && tiersData.length === 3) {
              const c1 = new THREE.Color(config.secondaryColor);
              const c2 = new THREE.Color(config.primaryColor);
              tierColor = '#' + c1.lerp(c2, 0.5).getHexString();
            }
          }

          const squareGeo =
            config.shape === 'square'
              ? createRoundedSquareGeometry(tier.radius * 1.8, tier.height, 0.08)
              : null;

          return (
            <group key={tier.index} position={[0, tier.yOffset, 0]}>
              {config.shape === 'round' ? (
                <mesh position={[0, tier.height / 2, 0]} castShadow receiveShadow>
                  <cylinderGeometry args={[tier.radius, tier.radius, tier.height, 64]} />
                  <meshStandardMaterial
                    color={tierColor}
                    roughness={roughness}
                    bumpMap={config.finish !== 'fondant' ? bumpMap : null}
                    bumpScale={config.finish === 'rustic' ? 0.018 : 0.005}
                  />
                </mesh>
              ) : (
                <mesh geometry={squareGeo} castShadow receiveShadow>
                  <meshStandardMaterial
                    color={tierColor}
                    roughness={roughness}
                    bumpMap={config.finish !== 'fondant' ? bumpMap : null}
                    bumpScale={config.finish === 'rustic' ? 0.018 : 0.005}
                  />
                </mesh>
              )}

              {config.finish === 'naked' &&
                [0.25, 0.5, 0.75].map((ratio, bIdx) => (
                  <mesh
                    key={bIdx}
                    position={[0, tier.height * ratio, 0]}
                    castShadow
                    receiveShadow
                  >
                    {config.shape === 'round' ? (
                      <cylinderGeometry
                        args={[tier.radius + 0.006, tier.radius + 0.006, 0.075, 64]}
                      />
                    ) : (
                      <boxGeometry
                        args={[tier.radius * 1.81, 0.075, tier.radius * 1.81]}
                      />
                    )}
                    <meshStandardMaterial color={spongeColor} roughness={0.88} />
                  </mesh>
                ))}

              {config.hasDrip && (
                <DripLayer
                  radius={tier.radius}
                  tierHeight={tier.height}
                  shape={config.shape}
                  dripColor={dripColor}
                />
              )}

              {config.hasBottomBorder && (
                <PipedBorder
                  radius={tier.radius + 0.02}
                  yPos={0.032}
                  shape={config.shape}
                  color={tierColor}
                />
              )}

              {config.hasTopBorder && (
                <PipedBorder
                  radius={tier.radius - 0.015}
                  yPos={tier.height + 0.012}
                  shape={config.shape}
                  color={tierColor}
                />
              )}
            </group>
          );
        })}

        {config.inscription && config.inscription.trim().length > 0 && (
          <mesh
            position={[0, totalHeight + (config.hasDrip ? 0.028 : 0.004), 0]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <planeGeometry args={[topTier.radius * 1.5, topTier.radius * 1.5]} />
            <meshBasicMaterial map={inscriptionTex} transparent depthWrite={false} />
          </mesh>
        )}

        <ToppingsCluster
          topRadius={topTier.radius}
          topY={totalHeight + (config.hasDrip ? 0.025 : 0.002)}
          toppings={config.toppings}
        />

        <CandlesGroup
          count={config.candles}
          topY={totalHeight + (config.hasDrip ? 0.025 : 0.002)}
          topRadius={topTier.radius}
        />
      </group>
    </group>
  );
}
