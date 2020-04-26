import React from "react";
import styled, { keyframes } from "styled-components";

const move = keyframes`
    from {
        transform: translateY(10px);
    }
    to {
        transform: translateY(100px);
    }
`;

const Canvas = styled.svg`
  width: ${window.innerWidth}px;
  height: ${window.innerHeight}px;
`;

const StyledRect = styled.rect`
  animation-fill-mode: forwards;
`;

const Snake = props => {
  return (
    <StyledRect
      x={props.x % window.innerWidth}
      y={props.y % window.innerHeight}
      width={props.width}
      height={props.height}
    />
  );
};

const piece = (x, y, vertical) => {
  return { x, y, vertical };
};

const last = arr => {
  return arr.slice(-1)[0];
};

const calcNewX = (lastSnake, key) => {
  return lastSnake.x + 1;
};

const calcNewY = (lastSnake, key) => {
  return lastSnake.y;
};

const newSnake = (s, n, key) => {
  const lastSnake = last(s);
  const newPieces = Array(n)
    .fill(0)
    .map((_, i) =>
      piece(calcNewX(lastSnake, key) + i, calcNewY(lastSnake, key), false),
    );
  return s.slice(n).concat(...newPieces);
};

const keyCodes = new Set(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]);

const defaultSnake = Array(100)
  .fill(0)
  .map((_, i) => piece(i, 10, false));

const App = () => {
  const [snake, setSnake] = React.useState(defaultSnake);

  const [key, setKey] = React.useState(null);

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSnake(newSnake(snake, 4, key));
      setKey(null);
    }, 1000 / 60);
    return () => {
      clearInterval(interval);
    };
  }, [snake]);

  const handleKeyDown = event => {
    if (keyCodes.has(event.key)) {
      setKey(event.key);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, []);

  return (
    <Canvas>
      {snake.map(s => (
        <Snake
          x={s.x}
          y={s.y}
          width={s.vertical ? "10" : "1"}
          height={s.vertical ? "1" : "10"}
        />
      ))}
    </Canvas>
  );
};

export default App;
