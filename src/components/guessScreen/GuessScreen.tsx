import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, useGLTF } from '@react-three/drei';
import giraf from '../../../public/giraf.glb';
import giraffe from '../../../public/models/giraffe/giraffe.jpg';
import dodo from '../../../public/models/dodo/dodo.jpg';
import guppy_fish from '../../../public/models/guppy_fish/guppy_fish.jpg';
import styles from './GuessScreen.module.css';

const images = [
  { id: 1, src: giraffe },
  { id: 2, src: dodo },
  { id: 3, src: guppy_fish },
];

const Model = () => {
  const { scene } = useGLTF(giraf);
  return <primitive object={scene} position={[0, -1, 0]} scale={1.5} />;
};

const GuessScreen = () => {
  const [selectedId, setSelectedId] = useState<number>(NaN);

  const handleGuess = () => {
    if (selectedId !== null) {
      console.log('Selected Image ID:', selectedId);
    } else {
      console.log('No image selected');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.canvasContainer}>
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 2]} intensity={1} />
          <Suspense fallback={null}>
            <Model />
            <Environment preset="sunset" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={2} />
        </Canvas>
      </div>

      <div className={styles.imageContainer}>
        {images.map((image) => (
          <button
            key={image.id}
            onClick={() => setSelectedId(image.id)}
            className={`${styles.imageButton} ${selectedId === image.id ? styles.selected : ''}`}
          >
            <img src={image.src} alt={`Option ${image.id}`} className={styles.image} />
          </button>
        ))}
      </div>

      <button
        onClick={handleGuess}
        className={styles.guessButton}
      >
        Guess
      </button>
    </div>
  );
};

export default GuessScreen;
