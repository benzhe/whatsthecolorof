
function parseColors(colors) {
	const newColors = new Map();
	
	Object.keys(colors).forEach((colorHexStr, index) => {
		const r = colorHexStr.slice(1, 3);
		const g = colorHexStr.slice(3, 5);
		const b = colorHexStr.slice(5, 7);
		const colorArr = [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
		newColors.set(colorArr, colors[colorHexStr]);
	});
	return newColors;	
}

module.exports = parseColors;
