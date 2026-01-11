import React, { Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, Center } from '@react-three/drei';
import type { Configuration } from '../types';
import { TwoSeater } from '../models/TwoSeater';
import { ThreeSeater } from '../models/ThreeSeater';
import { LSofa } from '../models/LSofa';

interface SofaViewerProps {
  configuration: Configuration;
}

const SofaModel = ({ configuration }: { configuration: Configuration }) => {
  const ModelComponent = 
    configuration.size === 'two_seater' ? TwoSeater :
    configuration.size === 'three_seater' ? ThreeSeater :
    configuration.size === 'l_shape' ? LSofa :
    TwoSeater;

  return (
    <Center>
      <ModelComponent configuration={configuration} />
    </Center>
  );
};

const SofaViewer: React.FC<SofaViewerProps> = ({ configuration }) => {
  return (
    <div className="h-full flex flex-col">
      <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">3D Sofa Preview</h3>
      
      <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-200 rounded-lg border border-gray-300 mb-4 min-h-[300px] lg:min-h-[400px]">
        <Canvas
          camera={{ position: [4, 2, 5], fov: 50 }}
          style={{ width: '100%', height: '100%' }}
        >
          <Suspense fallback={
            <mesh>
              <boxGeometry args={[0.5, 0.5, 0.5]} />
              <meshStandardMaterial color="#cccccc" />
            </mesh>
          }>
            <SofaModel configuration={configuration} />
            <Environment preset="apartment" />
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              minDistance={2}
              maxDistance={10}
            />
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1} />
          </Suspense>
        </Canvas>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h4 className="font-semibold text-gray-800 mb-3 text-center">Current Selection</h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Material:</span>
            <span className="text-indigo-600 font-medium capitalize">{configuration.material || 'Not selected'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Color:</span>
            <span className="text-indigo-600 font-medium capitalize">{configuration.color || 'Not selected'}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Size:</span>
            <span className="text-indigo-600 font-medium capitalize">{configuration.size ? configuration.size.replace('_', ' ') : 'Not selected'}</span>
          </div>
          {configuration.addons.length > 0 && (
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Add-ons:</span>
              <span className="text-indigo-600 font-medium capitalize text-right">{configuration.addons.join(', ')}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SofaViewer;
