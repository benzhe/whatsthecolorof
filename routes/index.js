const util = require('util');
const router = require('koa-router')();
const request = util.promisify(require('request'));
const getClosestColor = require('../libs/get-closest-color-2');
const parseColors = require('../libs/parseColors');
const COLORS = require('../vars/colors2');


const colors = parseColors(COLORS);

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
	const rawColorStrArr = body.match(/style\="background(-color)?:rgb(a)?\(\d+,\d+,\d+(,\d+)?\)/g);
	const colorStrArr = rawColorStrArr.map((str) => {
		return str.match(/\d+,\d+,\d+/)[0];
	});
	const parseColors = colorStrArr.map(getClosestColor);
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

	parseColors = parseColors.sort((a, b) => {
		return a.count - b.count;
	});

	const previewHtml = parseColors.map((obj) => {
		return `<td style="background: rgb(${obj.color})">&nbsp;</td>`;
	});
	ctx.body = `<table><tr>${previewHtml}</tr></table>`;
})


router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
