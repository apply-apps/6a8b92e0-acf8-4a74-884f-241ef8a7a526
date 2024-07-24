// Filename: index.js
// Combined code from all files

import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Alert, TouchableOpacity } from 'react-native';

const CELL_SIZE = 20;
const BOARD_SIZE = 300;

const getRandomPosition = () => {
    const maxPos = BOARD_SIZE / CELL_SIZE;
    const pos = Math.floor(Math.random() * maxPos) * CELL_SIZE;
    return pos;
};

const SnakeGame = () => {
    const [snake, setSnake] = useState([{ x: 100, y: 100 }]);
    const [food, setFood] = useState({ x: getRandomPosition(), y: getRandomPosition() });
    const [dir, setDir] = useState('RIGHT');
    const [isGameOver, setIsGameOver] = useState(false);

    useEffect(() => {
        if (isGameOver) return;

        const interval = setInterval(moveSnake, 200);
        return () => clearInterval(interval);
    }, [snake, dir, isGameOver]);

    useEffect(() => {
        const handleKeyDown = (e) => {
            switch (e.keyCode) {
                case 37:
                    if (dir !== 'RIGHT') setDir('LEFT');
                    break;
                case 38:
                    if (dir !== 'DOWN') setDir('UP');
                    break;
                case 39:
                    if (dir !== 'LEFT') setDir('RIGHT');
                    break;
                case 40:
                    if (dir !== 'UP') setDir('DOWN');
                    break;
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, [dir]);

    const moveSnake = () => {
        const newSnake = [...snake];
        let head = { ...newSnake[0] };

        switch (dir) {
            case 'LEFT':
                head.x -= CELL_SIZE;
                break;
            case 'UP':
                head.y -= CELL_SIZE;
                break;
            case 'RIGHT':
                head.x += CELL_SIZE;
                break;
            case 'DOWN':
                head.y += CELL_SIZE;
                break;
        }

        if (head.x === food.x && head.y === food.y) {
            newSnake.unshift(head);
            setFood({ x: getRandomPosition(), y: getRandomPosition() });
        } else {
            newSnake.pop();
            newSnake.unshift(head);
        }

        if (head.x < 0 || head.x >= BOARD_SIZE || head.y < 0 || head.y >= BOARD_SIZE || checkCollision(newSnake)) {
            setIsGameOver(true);
            Alert.alert('Game Over', 'You lost the game!');
            return;
        }

        setSnake(newSnake);
    };

    const checkCollision = (snake) => {
        const head = snake[0];
        for (let i = 1; i < snake.length; i++) {
            if (head.x === snake[i].x && head.y === snake[i].y) {
                return true;
            }
        }
        return false;
    };

    const restartGame = () => {
        setSnake([{ x: 100, y: 100 }]);
        setFood({ x: getRandomPosition(), y: getRandomPosition() });
        setDir('RIGHT');
        setIsGameOver(false);
    };

    return (
        <View style={styles.container}>
            <View style={styles.board}>
                {snake.map((segment, index) => (
                    <View
                        key={index}
                        style={[
                            styles.snake,
                            {
                                left: segment.x,
                                top: segment.y,
                            },
                        ]}
                    />
                ))}
                <View style={[styles.food, { left: food.x, top: food.y }]} />
            </View>
            {isGameOver && (
                <TouchableOpacity style={styles.button} onPress={restartGame}>
                    <Text style={styles.buttonText}>Restart Game</Text>
                </TouchableOpacity>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
    },
    board: {
        width: BOARD_SIZE,
        height: BOARD_SIZE,
        backgroundColor: '#fff',
        borderColor: '#000',
        borderWidth: 1,
        position: 'relative',
    },
    snake: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'green',
        position: 'absolute',
    },
    food: {
        width: CELL_SIZE,
        height: CELL_SIZE,
        backgroundColor: 'red',
        position: 'absolute',
    },
    button: {
        marginTop: 20,
        backgroundColor: '#000',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: '#fff',
    },
});

export default function App() {
    return (
        <SafeAreaView style={appStyles.container}>
            <View style={appStyles.header}>
                <Text style={appStyles.title}>Snake Game</Text>
            </View>
            <SnakeGame />
        </SafeAreaView>
    );
}

const appStyles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
        marginTop: 50,
    },
    header: {
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
    },
});