const util = require('util');
const router = require('koa-router')();
const request = util.promisify(require('request'));
const COLORS = require('../vars/colors2');

function parseColors(colors) {
	const newColors = new Map();
	
	Object.keys(colors).forEach((colorHexStr, index) => {
		const r = colorHexStr.slice(1, 3);
		const g = colorHexStr.slice(3, 5);
		const b = colorHexStr.slice(5, 7);
		const colorArr = [parseInt(r, 16), parseInt(g, 16), parseInt(b, 16)];
//		console.log(colorArr);
		newColors.set(colorArr, colors[colorHexStr]);
	});
//	console.log(newColors);
	return newColors;	
}

const colors = parseColors(COLORS);

function getClosestColor(sourceColorStr, factor) {
	factor = factor || 1;
	const sourceColor = sourceColorStr.split(',').map((num) => parseInt(num, 10));
//	console.log(sourceColor);
	let minusIndex = null;
	let minusName = null;
	let minusDelta = null;
	colors.forEach((destColorName, destColor) => {
//		console.log(destColor);
		const deltaR = Math.pow(Math.abs(sourceColor[0] - destColor[0]), factor);
		const deltaG = Math.pow(Math.abs(sourceColor[1] - destColor[1]), factor);
		const deltaB = Math.pow(Math.abs(sourceColor[2] - destColor[2]), factor);
		const delta = deltaR + deltaG + deltaB;
//		debugger;
		if (delta < minusDelta || minusDelta === null) {
			minusDelta = delta;
			minusIndex = destColor;
			minusName = destColorName;
		}		
	});
//	console.log(minusName, minusIndex, minusDelta);
	return minusName;
}

function getClosestColor2(sourceColorStr, factor) {
	factor = factor || 1;
	const sourceColor = sourceColorStr.split(',').map((num) => parseInt(num, 10));
//	console.log(sourceColor);
	let minusIndex = null;
	let minusName = null;
	let minusDelta = null;
	colors.forEach((destColorName, destColor) => {
		const deltaR = Math.abs(sourceColor[0] - destColor[0]) * (1 + sourceColor[0] / 255)
		const deltaG = Math.abs(sourceColor[1] - destColor[1]) * (1 + sourceColor[1] / 255)
		const deltaB = Math.abs(sourceColor[2] - destColor[2]) * (1 + sourceColor[2] / 255)
		const delta = deltaR + deltaG + deltaB;
//		debugger;
		if (delta < minusDelta || minusDelta === null) {
			minusDelta = delta;
			minusIndex = destColor;
			minusName = destColorName;
		}		
	});
//	console.log(minusName, minusIndex, minusDelta);
	return minusName;
}


router.get('/', async (ctx, next) => {
	const query = ctx.query.q;
	const qs = {
		newwindow: 1,
		tbm: 'isch',
		source: 'hp',
		biw: 1920,
		bih: 804,
		tbs: 'itp:clipart',
		q: query
	};
	const headers = {
		'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_12_5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36',
		
	};
	const params = {
		method: 'GET',
		uri: 'https://www.google.com/search',
		qs,
		headers
	}
	const response = await request(params);
	const body = response.body;
//	return ctx.body = body;
	const rawColorStrArr = body.match(/style\="background(-color)?:rgb(a)?\(\d+,\d+,\d+(,\d+)?\)/g);
	const colorStrArr = rawColorStrArr.map((str) => {
		return str.match(/\d+,\d+,\d+/)[0];
	});
	const parseColors = colorStrArr.map(getClosestColor);
	const parseColors2 = colorStrArr.map((str) => getClosestColor(str, 2));
	const parseColors3 = colorStrArr.map((str) => getClosestColor(str, 3));
	const parseColors4 = colorStrArr.map((str) => getClosestColor2(str));
	const resColors = {};
	parseColors2.forEach((color) => {
		if(resColors[color] === undefined) {
			resColors[color] = 1;
		}
		else {
			resColors[color] += 1;
		}
	});
//	return ctx.body = resColors;
	const previewHtml = colorStrArr.map((colorStr, index) => {
//		const color = getClosestColor(colorStr);
		return `
		<table width=100><tr>
			<td style="background: rgb(${colorStrArr[index]})">&nbsp;</td>
			<td style="height: 24px; background: ${parseColors[index]}">&nbsp;</td>
			<td style="height: 24px; background: ${parseColors2[index]}">&nbsp;</td>
			<td style="height: 24px; background: ${parseColors3[index]}">&nbsp;</td>
			<td style="height: 24px; background: ${parseColors4[index]}">&nbsp;</td>
		</tr></table>`;
	});
	ctx.body = `<p>${JSON.stringify(resColors)}</p>${previewHtml.join('')}`;
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/health', async (ctx, next) => {
	ctx.body = 'OK';
})

module.exports = router
