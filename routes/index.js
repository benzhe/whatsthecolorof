const util = require('util');
const router = require('koa-router')();
const request = util.promisify(require('request'));
const getClosestColor = require('../libs/get-closest-color-2');
const parseColors = require('../libs/parse-colors');
const COLORS = require('../vars/colors2');


const colors = parseColors(COLORS);

router.get('/', async (ctx, next) => {
	const query = ctx.query.q;
	if(!query) {
		return ctx.body = "404";
	}
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
	const rawColorStrArr = body.match(/style\="background(-color)?:rgb(a)?\(\d+,\d+,\d+(,\d+)?\)/g);
	const colorStrArr = rawColorStrArr.map((str) => {
		return str.match(/\d+,\d+,\d+/)[0];
	});
	const parseColors = colorStrArr.map((str) => getClosestColor(colors, str));
	const resColors = {};
	parseColors.forEach((color, index) => {
		if(resColors[color] === undefined) {
			resColors[color] = {
				color,
				original: colorStrArr[index],
				count: 1,
				percent: 1 / parseColors.length	
			};
		}
		else {
			resColors[color]['count'] += 1;
			resColors[color]['percent'] = resColors[color]['count'] / parseColors.length	
		}
	});
	let resColorsArr = Object.values(resColors);
console.log(resColorsArr);
	resColorsArr = resColorsArr.sort((a, b) => {
		return b.count - a.count;
	});

	const previewHtml = resColorsArr.map((obj) => {
		return `<td width="${obj.percent * 100}%" style="background: ${obj.color}">&nbsp;</td>`;
	});
	const content = `<table style="width: 100%; border-spacing: 0;"><tr>${previewHtml.join('')}</tr></table>`;
	await ctx.render('index', { content });
})


router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
