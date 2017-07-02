
function getClosestColor(colors, sourceColorStr, factor) {
	factor = factor || 1;
	const sourceColor = sourceColorStr.split(',').map((num) => parseInt(num, 10));
	let minusIndex = null;
	let minusName = null;
	let minusDelta = null;
	colors.forEach((destColorName, destColor) => {
		const deltaR = Math.pow(Math.abs(sourceColor[0] - destColor[0]), factor);
		const deltaG = Math.pow(Math.abs(sourceColor[1] - destColor[1]), factor);
		const deltaB = Math.pow(Math.abs(sourceColor[2] - destColor[2]), factor);
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