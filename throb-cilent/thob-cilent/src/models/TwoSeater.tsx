import React from 'react';
import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface TwoSeaterProps {
    configuration?: {
        material?: string;
        color?: string;
    };
    [key: string]: any;
}

export function TwoSeater({ configuration, ...props }: TwoSeaterProps) {
    const { scene } = useGLTF('/gltf/two_seater.gltf');

    const clonedScene = React.useMemo(() => scene.clone(), [scene]);

    React.useEffect(() => {
        clonedScene.traverse((child) => {
            if ((child as THREE.Mesh).isMesh) {
                const mesh = child as THREE.Mesh;
                if (mesh.material) {
                    const material = mesh.material as THREE.MeshStandardMaterial;

                    if (configuration?.color) {
                        const colors = {
                            brown: '#8B4513',
                            black: '#2C2C2C',
                            white: '#F5F5F5',
                            beige: '#F5F5DC',
                            red: '#DC143C',
                            blue: '#4169E1',
                            gray: '#808080',
                            orange: '#FF8C00'
                        };
                        material.color = new THREE.Color(colors[configuration.color] || '#8B4513');
                    }

                    if (configuration?.material === 'leather') {
                        material.roughness = 0.3;
                        material.metalness = 0.1;
                    } else if (configuration?.material === 'fabric') {
                        material.roughness = 0.8;
                        material.metalness = 0.0;
                    }
                }
            }
        });
    }, [clonedScene, configuration]);

    return <primitive object={clonedScene} {...props} />;
}

useGLTF.preload('/gltf/two_seater.gltf');
