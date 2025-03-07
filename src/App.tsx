import { Canvas } from '@react-three/fiber';
import styles from './App.module.css';
import { OrbitControls, OrbitControlsChangeEvent } from '@react-three/drei';
import ModelLoader from './ModelLoader';
import { useEffect, useRef, useState } from 'react';

// Model imports
import avocado from './models/ToyCar/glTF/ToyCar.gltf';
import avocadoImage from './models/ToyCar/screenshot/screenshot.jpg';

import Duck from './models/Duck/glTF/Duck.gltf';
import DuckImage from './models/Duck/screenshot/screenshot.png';

import WaterBottle from './models/WaterBottle/glTF/WaterBottle.gltf';
import WaterBottleImage from './models/WaterBottle/screenshot/screenshot.jpg';
import { io } from 'socket.io-client';
import PlayersList, { IPlayers } from './components/Player';

// Define model details (path + scale)
const models: {
  id: number;
  path: string;
  image: string;
  scale: [number, number, number];
}[] = [
  { path: avocado, image: avocadoImage, scale: [50, 50, 50], id: 1 },
  { path: Duck, image: DuckImage, scale: [1, 1, 1], id: 2 },
  { path: WaterBottle, image: WaterBottleImage, scale: [10, 10, 10], id: 3 },
];


const socket = io("http://localhost:5000");
function App() {
  const [selectedModel, setSelectedModel] = useState(models[0]);
  const [selectedForGuess, setSelectedForGuess] = useState<{id:number,cameraPosition:number[]}>({id:NaN,cameraPosition:[]});

  const [name, setName] = useState("");
  const [waiting, setWaiting] = useState(true);
  const [gamePlayers, setGamePlayers] = useState<IPlayers[]>([]);
  const [isGuessing, setIsGuessing] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [cameraPosition, setCameraPosition] = useState([0, 0, 5]);
  const [lightOff, setLightOff] = useState(false);
  const [guessed, setGuessed] = useState(false);
  const [selected, setSelected] = useState(false);
  const [someOneSelected, setSomeOneSelected] = useState(false);
  const [selectedImage, setSelectedImage] = useState<number>(NaN);

  const nameRef = useRef(""); 



  useEffect(() => {
    nameRef.current = name; // Always update the ref when the name state changes
  }, [name]);


  useEffect(() => {
    socket.on("startGame", (players) => {
      setGamePlayers(players);
      setWaiting(false);
      console.log(players);
      console.log(nameRef.current);
      const myPlayer = players.find((p) => p.name === nameRef.current);
      setIsGuessing(myPlayer?.isGuessing || false);
      setIsSelecting(myPlayer?.isSelecting || false);

      const selector = players.find((p) => p.isSelecting);
      setSomeOneSelected(selector?.selected || false);

      const selectedCard = players.find((p) => p.selected);

      console.log(selectedCard);

      if(selectedCard){
        console.log(selectedCard.selectedCard);
        setSelectedForGuess(selectedCard.selectedCard);
      }

  



    });
  
    socket.on("updatePlayers", (players) => {
      setGamePlayers(players.map((p) => p.name)); // Update players list
    });
  
    socket.on("waitingForPlayers", () => {
      setWaiting(true); // Set waiting state if fewer than 2 players
    });

    return () => {
      console.log("Disconnecting socket...");
      socket.disconnect();
    };
  }, []);

  const handleJoinGame = () => {
    socket.emit("joinGame", name);
  };

  return (
    <div>
      <div>
      {waiting ? (
        <div>
          <h1>Enter Your Name:</h1>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <button onClick={handleJoinGame}>Join Game</button>
          <p>Waiting for another player...</p>
        </div>
      ) : (
        <div>
          <h1>Game Started!</h1>
          <PlayersList players={gamePlayers}/>
        </div>
      )}
    </div>
    {
      isSelecting && (
        
        <div className={styles.container}>
                <div>

        <p>{selected?'selected':'not selected'}</p>
        {models.map((model, index) => (
          <img 
            key={index} 
            src={model.image} 
            alt="3D Model" 
            onClick={() => setSelectedModel(model)}
            style={{ cursor: 'pointer', margin: '5px', width: '100px' }} 
          />
        ))}
      </div>
        {/* <Canvas camera={{
            position: [-3.071537541446014, 1.1757159495687608, 3.766078748170015],
        }}> */}
        <Canvas  key={selectedModel.id}>
          <ambientLight intensity={lightOff?0:1}/>

    

          <ModelLoader modelPath={selectedModel.path}  scale={selectedModel.scale}  />
          <OrbitControls enableZoom={false}  onEnd={e=>{
            const ev = e as OrbitControlsChangeEvent;
            console.log(ev?.target?.object?.position );
            setCameraPosition([ev?.target?.object?.position.x, ev?.target?.object?.position.y, ev?.target?.object?.position.z]);
          }}/>
        </Canvas>
        <button onClick={() => {
         console.log({
          cameraPosition,
          id:selectedModel.id,
         })
         socket.emit("gameplay-selected", {cameraPosition, id:selectedModel.id});
      }}>End Turn</button>
      <button onClick={() => {
        setLightOff(!lightOff);
      }}>{lightOff?'lightOn':'lightOff'}</button>

      </div>

      )
    }
    {
      isGuessing && (
        

      <div className={styles.container} >
      
  
      {models.map((model, index) => (
          <img 
            key={index} 
            src={model.image} 
            alt="3D Model" 
            onClick={() => setSelectedImage(model.id)}
            style={{ cursor: 'pointer', margin: '5px', width: '100px' }} 
          />
        ))}
      {/* <Canvas camera={{
          position: [-3.071537541446014, 1.1757159495687608, 3.766078748170015],
      }}> */}
            <div>
      </div>
      { 
        
        selectedForGuess.id && (
          <Canvas key={'guess-'+selectedForGuess.id} camera={{ position: [selectedForGuess.cameraPosition[0],selectedForGuess.cameraPosition[1],selectedForGuess.cameraPosition[2]] }} >
          <ambientLight intensity={0}/>
          <ModelLoader modelPath={models[selectedForGuess.id].path}  scale={models[selectedForGuess.id].scale}  />
        </Canvas>
        )  

      }

      <button onClick={() => {
          socket.emit("gameplay-guessed", selectedImage);
          console.log(selectedImage);
        }}>Select</button>

    </div>
      )
    }


      {/* 3D Viewer */}
      

    </div>

    
  );
}

export default App;




