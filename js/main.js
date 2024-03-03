window.onload = function () {
    const colors = ["green", "red", "blue", "yellow"];
    const audioMap = {
      green: "sounds/green.mp3",
      red: "sounds/red.mp3",
      blue: "sounds/blue.mp3",
      yellow: "sounds/yellow.mp3",
      wrong: "sounds/wrong.mp3",
      gameover: "sounds/game-over.wav",
      gamewin: "sounds/game-win.wav",
    };
  
    let pattern = [];
    let userPattern = [];
    let level = 0;
    let highScore = 0;
  
    const playButton = document.getElementById("play");
    const infoText = document.getElementById("info");
    const highScoreDisplay = document.getElementById("high-score");
    const levelDisplay = document.getElementById("level");
    const tiles = document.querySelectorAll(".tile");
  
    playButton.addEventListener("click", startGame);
    tiles.forEach((tile) => tile.addEventListener("click", handleTileClick));
  
    const patternInterval = 1000;
    const tileHighlightDuration = 500;
    const userTileHighlightDuration = 300;
  
    function startGame() {
      resetGame();
      infoText.textContent = "Watch the pattern!";
      nextLevel();
    }
  
    function resetGame() {
      pattern = [];
      userPattern = [];
      level = 0;
      updateDisplay();
    }
  
    function nextLevel() {
      level++;
      updateDisplay();
      generatePattern();
      playPattern();
    }
  
    function generatePattern() {
      tiles.forEach((tile) => tile.classList.remove("active", "inactive"));
  
      for (let i = 0; i < level; i++) {
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const tile = document.querySelector(`.tile[data-tile="${randomColor}"]`);
        pattern.push(randomColor);
        tile.classList.add("inactive");
      }
    }
  
    function playPattern() {
      disableTiles();
      let i = 0;
      const interval = setInterval(function () {
        highlightTile(pattern[i], tileHighlightDuration);
        playSound(pattern[i]);
        i++;
        if (i >= pattern.length) {
          clearInterval(interval);
          setTimeout(() => {
            enableTiles();
            infoText.textContent = "Your turn!";
          }, tileHighlightDuration);
        }
      }, patternInterval);
    }
  
    function handleTileClick(event) {
      if (event.target.classList.contains("unclickable")) {
        return;
      }
  
      const selectedColor = event.target.dataset.tile;
      highlightTile(selectedColor, userTileHighlightDuration);
      playSound(selectedColor);
      userPattern.push(selectedColor);
  
      if (!checkUserInput()) {
        endGame();
      } else if (userPattern.length === pattern.length) {
        nextLevel();
      }
    }
  
    function checkUserInput() {
      return userPattern.every((value, index) => value === pattern[index]);
    }
  
    function endGame() {
      playSound("wrong");
      infoText.textContent = "Wrong choice! Game over.";
      if (level > highScore) {
        highScore = level - 1;
        highScoreDisplay.textContent = highScore;
      }
      setTimeout(startGame, 2000);
    }
  
    function updateDisplay() {
      highScoreDisplay.textContent = highScore;
      levelDisplay.textContent = level;
    }
  
    function highlightTile(color, duration) {
      const tile = document.querySelector(`.tile[data-tile="${color}"]`);
      tile.style.backgroundColor = "lightgray"; 
      setTimeout(() => {
        tile.style.backgroundColor = ""; 
      }, duration);
    }
  
    function playSound(color) {
      const audio = new Audio(audioMap[color]);
      audio.play();
    }
  
    function disableTiles() {
      tiles.forEach((tile) => {
        tile.classList.add("unclickable");
        tile.style.pointerEvents = "none";
      });
    }
  
    function enableTiles() {
      tiles.forEach((tile) => {
        tile.classList.remove("unclickable");
        tile.style.pointerEvents = "auto";
      });
    }
  };
  