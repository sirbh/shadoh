import React from "react";
import { useGLTF } from "@react-three/drei";

interface ModelLoaderProps {
  modelPath: string;
  position?: [number, number, number];
  scale?: [number, number, number];
}

const ModelLoader: React.FC<ModelLoaderProps> = ({ modelPath, position = [0, 0, 0], scale=[1,1,1] }) => {
  const { scene } = useGLTF(modelPath);

  console.log(modelPath);

  return <primitive object={scene} position={[0,0,0]} castShadow scale={scale} />;
};

export default ModelLoader;

