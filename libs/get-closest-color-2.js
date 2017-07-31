
function getClosestColor(colors, sourceColorStr, factor) {
	factor = factor || 1;
	const sourceColor = sourceColorStr.split(',').map((num) => parseInt(num, 10));
	let minusIndex = null;
	let minusName = null;
	let minusDelta = null;
	colors.forEach((destColorName, destColor) => {
		const deltaR = Math.pow(Math.abs(sourceColor[0] - destColor[0]) * (1 + sourceColor[0] / 255), 4);
		const deltaG = Math.pow(Math.abs(sourceColor[1] - destColor[1]) * (1 + sourceColor[1] / 255), 4);
		const deltaB = Math.pow(Math.abs(sourceColor[2] - destColor[2]) * (1 + sourceColor[2] / 255), 4);
		const delta = deltaR + deltaG + deltaB;
		if (delta < minusDelta || minusDelta === null) {
			minusDelta = delta;
			minusIndex = destColor;
			minusName = destColorName;
		}		
	});
	return minusName;
}

module.exports = getClosestColor;
