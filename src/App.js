import React from "react";
import styled, { keyframes } from "styled-components";

const Canvas = styled.svg`
  width: ${window.innerWidth}px;
  height: ${window.innerHeight}px;
`;

const Snake = props => {
  return (
    <rect
      x={(props.x + window.innerWidth) % window.innerWidth}
      y={(props.y + window.innerHeight) % window.innerHeight}
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

const calcNewX = (lastSnake, key, i) => {
  if (!verticalKey(key)) {
    if (key === "ArrowRight") {
      return lastSnake.x + 1 + i;
    } else {
      return lastSnake.x - 1 - i;
    }
  } else {
    return lastSnake.x;
  }
};

const calcNewY = (lastSnake, key, i) => {
  if (verticalKey(key)) {
    if (key === "ArrowDown") {
      return lastSnake.y + 1 + i;
    } else {
      return lastSnake.y - 1 - i;
    }
  } else {
    return lastSnake.y;
  }
};

const verticalKey = key => key === "ArrowUp" || key === "ArrowDown";

const direction = s => {
  const l = last(s);
  const sl = s.slice(-2)[0];
  if (l.y > sl.y) {
    return "up";
  } else if (l.y < sl.y) {
    return "down";
  } else if (l.x < sl.x) {
    return "left";
  } else {
    return "right";
  }
};

const newSnake = (s, n, key, lastKey) => {
  const lastSnake = last(s);
  const newPieces = Array(n)
    .fill(0)
    .map((_, i) =>
      piece(
        calcNewX(lastSnake, key, i) +
          (!lastSnake.vertical && verticalKey(key)
            ? direction(s) === "left"
              ? 0
              : -9
            : 0),
        calcNewY(lastSnake, key, i) +
          (lastSnake.vertical && !verticalKey(key)
            ? direction(s) === "up"
              ? -9
              : 0
            : 0),
        verticalKey(key),
      ),
    );
  return s.slice(n).concat(...newPieces);
};

const keyCodes = new Set(["ArrowRight", "ArrowLeft", "ArrowUp", "ArrowDown"]);

const defaultSnake = Array(100)
  .fill(0)
  .map((_, i) => piece(i, 10, false));

const isOpposite = (key, newKey) => {
  return (
    (verticalKey(key) && !verticalKey(newKey)) ||
    (verticalKey(newKey) && !verticalKey(key))
  );
};

const App = () => {
  const [snake, setSnake] = React.useState(defaultSnake);

  const [key, setKey] = React.useState("ArrowRight");

  React.useEffect(() => {
    const interval = setInterval(() => {
      setSnake(newSnake(snake, 4, key));
    }, 1000 / 60);
    return () => {
      clearInterval(interval);
    };
  }, [snake]);

  const handleKeyDown = event => {
    if (
      keyCodes.has(event.key) &&
      event.key !== key &&
      isOpposite(key, event.key)
    ) {
      setKey(event.key);
    }
  };

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [key]);

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
