import React from "react";
import styled from "styled-components";
import Game from "./Game";

const StartMenu = styled.div`
  width: ${window.innerWidth}px;
  height: ${window.innerHeight}px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StartButton = styled.button`
  background: white;
  border: none;
  font-size: 70px;
  font-family: "Monoton";
  &:focus {
    outline: 0;
  }
  &:hover {
    font-size: 90px;
  }
`;

const Menu = () => {
  const [started, setStarted] = React.useState(false);

  return started ? (
    <Game />
  ) : (
    <StartMenu>
      <StartButton onClick={() => setStarted(true)}>START</StartButton>
    </StartMenu>
  );
};

export default Menu;
