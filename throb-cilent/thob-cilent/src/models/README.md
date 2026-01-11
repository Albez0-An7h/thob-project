# 3D Models Integration Guide

## GLTF to JSX Conversion Workflow

Once you have your GLTF files downloaded, follow these steps:

### 1. Place your GLTF files
Put your `.gltf` or `.glb` files in this `src/models/` directory.

### 2. Convert GLTF to JSX
Run this command for each model:
```bash
npx gltfjsx your-sofa-model.gltf --output=SofaModel.tsx --types
```

Example for different sofa types:
```bash
npx gltfjsx two-seater-sofa.gltf --output=TwoSeaterSofa.tsx --types
npx gltfjsx three-seater-sofa.gltf --output=ThreeSeaterSofa.tsx --types
npx gltfjsx l-shape-sofa.gltf --output=LShapeSofa.tsx --types
```

### 3. Model Structure Expected
Your converted JSX components should export a component that accepts props like:
```tsx
interface SofaModelProps {
  material?: string;
  color?: string;
  scale?: number;
  position?: [number, number, number];
  [key: string]: any;
}
```

### 4. Integration
Once converted, import your models in `SofaViewer.tsx` and replace the placeholder `SofaModel` component.

### Example Integration:
```tsx
import { TwoSeaterSofa } from '../models/TwoSeaterSofa';
import { ThreeSeaterSofa } from '../models/ThreeSeaterSofa';
import { LShapeSofa } from '../models/LShapeSofa';

const SofaModel = ({ configuration }: { configuration: Configuration }) => {
  const ModelComponent = 
    configuration.size === 'two_seater' ? TwoSeaterSofa :
    configuration.size === 'three_seater' ? ThreeSeaterSofa :
    configuration.size === 'l_shape' ? LShapeSofa :
    TwoSeaterSofa; // default

  return (
    <Center>
      <ModelComponent 
        material={configuration.material}
        color={configuration.color}
        scale={1}
      />
    </Center>
  );
};
```

## File Structure
```
src/models/
├── README.md (this file)
├── two-seater-sofa.gltf
├── TwoSeaterSofa.tsx (converted)
├── three-seater-sofa.gltf
├── ThreeSeaterSofa.tsx (converted)
├── l-shape-sofa.gltf
└── LShapeSofa.tsx (converted)
```