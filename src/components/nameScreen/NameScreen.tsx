import { useState } from "react";
import styles from "./NameScreen.module.css";

const NameScreen = () => {

    const [name, setName] = useState<string>('');
    const [isNameValid, setIsNameValid] = useState<boolean>(false);

    const handleNameChange = (name: string) => {
        setName(name);
        setIsNameValid(name.length > 0);
    };

    return (
        <div className={styles.screen}>
            <div className={styles.logo}>
                <span className={styles['logo-shadow']}>Shad</span>
                <span className={styles['logo-oh']}>-Oh!</span>
            </div>
            <input
                className={styles.input}
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
            />
            <button className={styles.button} disabled={!isNameValid}>
                Join Game
            </button>
        </div>
    );
};

export default NameScreen;
