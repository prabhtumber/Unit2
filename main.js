document.addEventListener('DOMContentLoaded', (event) => {
	const gameEngine = new GameEngine();
	const ASSET_MANAGER = new AssetManager();

	const canvas = document.getElementById("gameWorld");
	const ctx = canvas.getContext("2d");

	gameEngine.init(ctx);

	const automata = new Automata(gameEngine, canvas.width, canvas.height);
	gameEngine.addEntity(automata);

	// Start the simulation automatically when plants or animats are added
	function startSimulationIfNeeded() {
		if (!gameEngine.running) {
			gameEngine.running = true;
			gameEngine.start();
		}
	}

	function addPlant() {
		const x = Math.floor(Math.random() * automata.grid.length);
		const y = Math.floor(Math.random() * automata.grid[0].length);
		const hue = Math.random() * 360; // Random color hue
		automata.addPlant(x, y, hue);
		startSimulationIfNeeded();
	}

	function addAnimat() {
		const x = Math.floor(Math.random() * automata.grid.length);
		const y = Math.floor(Math.random() * automata.grid[0].length);
		const hue = Math.random() * 360; // Random color hue
		const energy = 10; // Default energy level
		automata.addAnimat(x, y, hue, energy);
		startSimulationIfNeeded();
	}

	document.getElementById("addPlantBtn").addEventListener("click", addPlant);
	document.getElementById("addAnimatBtn").addEventListener("click", addAnimat);
	document.getElementById("speedRange").addEventListener("input", function () {
		// Assuming max speed is 1000 and min speed is 10 as per your slider range
		const maxSpeed = 1000;
		const minSpeed = 10;

		// Invert the relationship so that higher value = faster
		const speed = maxSpeed - this.value + minSpeed;
		gameEngine.setUpdateRate(speed);
	});




	document.getElementById("stopBtn").addEventListener("click", function () {
		console.log("Stop button clicked");
		gameEngine.running = false;
		// Make sure the stop method exists in GameEngine class
		gameEngine.stop();
	});

	document.getElementById("resetBtn").addEventListener("click", function () {
		console.log("Reset button clicked");
		gameEngine.running = false;
		automata.grid = automata.initializeGrid();
		automata.draw(gameEngine.ctx);
	});
});
