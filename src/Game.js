import React from "react";
import styled from "styled-components";

const Canvas = styled.svg`
  width: ${window.innerWidth}px;
  height: ${window.innerHeight}px;
`;

const ScoreCard = styled.div`
  position: absolute;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 40px;
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

const Apple = props => {
  return (
    <rect
      x={props.x}
      y={props.y}
      width="10"
      height="10"
      style={{ fill: "red" }}
    />
  );
};

const generateApple = () => {
  return {
    x: Math.random() * (window.innerWidth - 10) + 10,
    y: Math.random() * (window.innerHeight - 10) + 10,
  };
};

const piece = (x, y, vertical) => {
  return { x, y, vertical };
};

const last = arr => {
  return arr.slice(-1)[0];
};

const distance = 1;

const calcNewX = (lastSnake, key, i) => {
  if (!verticalKey(key)) {
    if (key === "ArrowRight") {
      return lastSnake.x + distance + i;
    } else {
      return lastSnake.x - distance - i;
    }
  } else {
    return lastSnake.x;
  }
};

const calcNewY = (lastSnake, key, i) => {
  if (verticalKey(key)) {
    if (key === "ArrowDown") {
      return lastSnake.y + distance + i;
    } else {
      return lastSnake.y - distance - i;
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

const newSnake = (s, n, key) => {
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

const isCollision = (snake, obj, w, h, key) => {
  const fp = last(snake);
  const sw = fp.vertical ? 10 : 4;
  const sh = fp.vertical ? 4 : 10;
  const x3 = obj.x;
  const y3 = obj.y;
  const x4 = obj.x + w;
  const y4 = obj.y + h;
  let x1, y1, x2, y2;
  if (key === "ArrowRight") {
    x1 = fp.x - sw;
    y1 = fp.y;
    x2 = fp.x;
    y2 = fp.y + sh;
  } else if (key === "ArrowLeft") {
    x1 = fp.x;
    y1 = fp.y;
    x2 = fp.x + sw;
    y2 = fp.y + sh;
  } else if (key === "ArrowUp") {
    x1 = fp.x;
    y1 = fp.y;
    x2 = fp.x + sw;
    y2 = fp.y + sh;
  } else if (key === "ArrowDown") {
    x1 = fp.x;
    y1 = fp.y - sh;
    x2 = fp.x + sw;
    y2 = fp.y;
  }
  const x5 = Math.max(x1, x3);
  const y5 = Math.max(y1, y3);
  const x6 = Math.min(x2, x4);
  const y6 = Math.min(y2, y4);
  if (x5 > x6 || y5 > y6) {
    return false;
  } else {
    return true;
  }
};

const Game = () => {
  // Stores location of snake
  const [snake, setSnake] = React.useState(defaultSnake);

  // Stores current arrow key being pressed
  const [key, setKey] = React.useState("ArrowRight");

  // Stores current list of apple locations
  const [apples, setApples] = React.useState([generateApple()]);

  // Keep apple score
  const [score, setScore] = React.useState(0);

  // Create hook to check for collisions with an apple
  React.useEffect(() => {
    const interval = setInterval(() => {
      const ns = newSnake(snake, 4, key);
      apples.forEach((a, i) => {
        if (isCollision(ns, a, 10, 10, key)) {
          setApples(
            apples.slice(0, i).concat(generateApple(), ...apples.slice(i + 1)),
          );
          setScore(s => s + 1);
        }
      });
      setSnake(ns);
      // 60 FPS rendering
    }, 1000 / 60);
    return () => {
      clearInterval(interval);
    };
  }, [snake, apples, key]);

  // On key down, set the current value of the key
  const handleKeyDown = React.useCallback(
    e => {
      // Check it's an arrow key, not equal to the current key
      // and not the opposite direction from the current key
      if (keyCodes.has(e.key) && e.key !== key && isOpposite(key, e.key)) {
        setKey(e.key);
      }
    },
    [key],
  );

  // Add event listener to handle key down
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown, false);
    return () => {
      document.removeEventListener("keydown", handleKeyDown, false);
    };
  }, [handleKeyDown]);

  return (
    <div style={{ position: "relative" }}>
      <ScoreCard>{score}</ScoreCard>
      <Canvas>
        {snake.map(s => (
          <Snake
            x={s.x}
            y={s.y}
            width={s.vertical ? "10" : "1"}
            height={s.vertical ? "1" : "10"}
          />
        ))}
        {apples.map(a => (
          <Apple x={a.x} y={a.y} />
        ))}
      </Canvas>
    </div>
  );
};

export default Game;
