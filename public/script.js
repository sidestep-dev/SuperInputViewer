//gamepads object - will update to handle multiple gamepads in future
const gamepads = {};

//select display components
const joystick = document.querySelector(".joystick");
const grid = document.querySelector("#joystickGrid");

//object that stores mapping configs. Will add config options in future
const mapping = {
	xb: [
		"A",
		"B",
		"X",
		"Y",
		"LB",
		"RB",
		"LT",
		"RT",
		"Select",
		"Start",
		"LS",
		"RS",
		"up",
		"down",
		"left",
		"right",
	],
	ps: [
		"\u00D7",
		"\u20D8",
		"\u25FB",
		"\u25B3",
		"L1",
		"R1",
		"L2",
		"R2",
		"\\|/",
		"\u2261",
		"L3",
		"R3",
		"up",
		"down",
		"left",
		"right",
	],
};

//function for polling gamepad
const pollGamepad = () => {
	return navigator.getGamepads()[0];
};

//mapping joystick state to vector graphic positions (indices 0 and 1) and absolute pixel locations (indices 2 and 3)
const xy = {
	db: [10, 90, 47.5, 205.5],
	d: [50, 97, 102.5, 212.5],
	df: [90, 90, 157.5, 205.5],
	b: [3, 50, 40.5, 150.5],
	n: [50, 50, 102.5, 150.5],
	f: [97, 50, 164.5, 150.5],
	ub: [10, 10, 47.5, 95.5],
	u: [50, 3, 102.5, 88.5],
	uf: [90, 10, 157.5, 95.5],
};

//generate a grid for the joystick display
const makeGrid = () => {
	const newPath = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	newPath.classList.add("grid");
	newPath.setAttribute(
		"d",
		`M${xy.ub[0]} ${xy.ub[1]} L${xy.u[0]} ${xy.u[1]} L${xy.uf[0]} ${xy.uf[1]} L${xy.f[0]} ${xy.f[1]} L${xy.df[0]} ${xy.df[1]} L${xy.d[0]} ${xy.d[1]} L${xy.db[0]} ${xy.db[1]} L${xy.b[0]} ${xy.b[1]} Z`
	);
	grid.appendChild(newPath);
	for (let pos in xy) {
		const newCircle = document.createElementNS(
			"http://www.w3.org/2000/svg",
			"circle"
		);
		newCircle.setAttribute("stroke", "gray");
		newCircle.setAttribute("fill", "gray");
		newCircle.setAttribute("cx", xy[pos][0]);
		newCircle.setAttribute("cy", xy[pos][1]);
		newCircle.setAttribute("r", 2);
		newCircle.classList.add("grid-coordinates");
		grid.appendChild(newCircle);
	}
};

makeGrid();

//generate button display
const displayButtons = () => {
	for (let i = 0; i < 12; i++) {
		const newButton = document.createElement("div");
		newButton.classList.add("button");
		newButton.classList.add(`button${i}`);
		newButton.innerText = mapping.ps[i];
		document.body.append(newButton);
	}
	const buttonList = document.querySelectorAll(".button");
	for (let i = 8; i < 12; i++) {
		buttonList[i].classList.add("menubutton");
	}
};

displayButtons();

//mapping joystick class list to position
const getPos = () => {
	if (
		joystick.classList.contains("up") &&
		joystick.classList.contains("left")
	) {
		return xy.ub;
	} else if (
		joystick.classList.contains("up") &&
		joystick.classList.contains("right")
	) {
		return xy.uf;
	} else if (
		joystick.classList.contains("down") &&
		joystick.classList.contains("left")
	) {
		return xy.db;
	} else if (
		joystick.classList.contains("down") &&
		joystick.classList.contains("right")
	) {
		return xy.df;
	} else if (joystick.classList.contains("up")) {
		return xy.u;
	} else if (joystick.classList.contains("down")) {
		return xy.d;
	} else if (joystick.classList.contains("left")) {
		return xy.b;
	} else if (joystick.classList.contains("right")) {
		return xy.f;
	} else {
		return xy.n;
	}
};

//update joystick location
let lastPos = xy.n;
const updateJoystick = () => {
	for (let i = 12; i < 16; i++) {
		if (pollGamepad().buttons[i].pressed) {
			joystick.classList.add(mapping.ps[i]);
		} else {
			joystick.classList.remove(mapping.ps[i]);
		}
	}
	if (lastPos !== getPos()) {
		drawTrail(lastPos, getPos());
	}
	lastPos = getPos();
};

//function that generates the user input onto the joystick grid
const generateButtonOnGrid = (x, y, id) => {
	const buttonOnGrid = document.createElement("div");
	buttonOnGrid.classList.add("button-on-grid");
	buttonOnGrid.style.left = `${x}px`;
	buttonOnGrid.style.top = `${y}px`;
	buttonOnGrid.innerText = id;
	document.body.append(buttonOnGrid);
	setTimeout(() => {
		buttonOnGrid.remove();
	}, 200);
};

//show inputs on button display as well as joystick grid
let buttons;
let pressed = [];
const updateInput = () => {
	if (!buttons) {
		buttons = document.querySelectorAll(".button");
	}
	for (let i = 0; i < 8; i++) {
		if (pollGamepad().buttons[i].pressed) {
			buttons[i].classList.add("pressed");
			if (!pressed[i]) {
				generateButtonOnGrid(getPos()[2], getPos()[3], mapping.ps[i]);
				pressed[i] = true;
			}
		} else {
			buttons[i].classList.remove("pressed");
			pressed[i] = false;
		}
	}
	for (let i = 8; i < 12; i++) {
		if (pollGamepad().buttons[i].pressed) {
			buttons[i].classList.add("pressed");
		} else {
			buttons[i].classList.remove("pressed");
		}
	}
};

//draw trails procedurally using svg
const drawTrail = (start, end) => {
	const newTrail = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"path"
	);
	newTrail.classList.add("path");
	newTrail.setAttribute("d", `M${start[0]} ${start[1]} L${end[0]} ${end[1]}`);
	newTrail.setAttribute("pathLength", 1);
	grid.appendChild(newTrail);
	const trailStart = document.createElementNS(
		"http://www.w3.org/2000/svg",
		"circle"
	);
	trailStart.setAttribute("cx", start[0]);
	trailStart.setAttribute("cy", start[1]);
	trailStart.setAttribute("r", 2);
	trailStart.setAttribute("stroke-width", 2);
	trailStart.classList.add("start-point");
	grid.appendChild(trailStart);
	setTimeout(() => {
		grid.removeChild(newTrail);
		grid.removeChild(trailStart);
	}, 800);
};

//main input display function: updates joystick and then button display
const updateDisplay = () => {
	updateJoystick();
	updateInput();
};

// //poll gamepad every 16.6ms (once a frame);
window.addEventListener("gamepadconnected", () => {
	setInterval(updateDisplay, 16.6);
});
