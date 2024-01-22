//gamepads object
const gamepads = {};
const joystick = document.querySelector(".joystick");
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
	document.querySelectorAll(".button");
};

//show joystick

const showJoystick = () => {
	for (let i = 12; i < 16; i++) {
		if (pollGamepad().buttons[i].pressed) {
			joystick.classList.add(mapping.ps[i]);
		} else {
			joystick.classList.remove(mapping.ps[i]);
		}
	}
};

//show inputs
const showInput = () => {
	const buttons = document.querySelectorAll(".button");
	for (let i = 0; i < 12; i++) {
		if (pollGamepad().buttons[i].pressed) {
			buttons[i].classList.add("pressed");
		} else {
			buttons[i].classList.remove("pressed");
		}
	}
};

//poll gamepad every 8ms (twice a frame);
const updateDisplay = () => {
	showInput();
	showJoystick();
};

window.addEventListener("gamepadconnected", () => {
	displayButtons();
	setInterval(updateDisplay, 8);
});
