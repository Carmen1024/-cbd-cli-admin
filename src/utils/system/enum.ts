export const dateData = [
	{ value: 1, label: '周一' },
	{ value: 2, label: '周二' },
	{ value: 3, label: '周三' },
	{ value: 4, label: '周四' },
	{ value: 5, label: '周五' },
	{ value: 6, label: '周六' },
	{ value: 7, label: '周日' },
]
/**
 * 带有小数的加法/减法运算
 * 减法实际上可看成加法，所以如果要做减法，只需第二个参数即被减数传负值即可
 * @param {Number} arg1 - 加数/减数
 * @param {Number} arg2 - 加数/被减数
 */

export const amend = (arg1, arg2) => {
	if(arg1 == '****' || arg2 == '****'){
		return '****'
	}
	arg1 = Number(arg1) || 0
	arg2 = Number(arg2) || 0
	let m = 0; // 记录两个加数中最长的小数位长度
	let arg1Str = arg1 + '';
	let arg2Str = arg2 + '';
	const arg1StrFloat = arg1Str.split('.')[1];
	const arg2StrFloat = arg2Str.split('.')[1];
	arg1StrFloat && (m = arg1StrFloat.length);
	arg2StrFloat && (m = m > arg2StrFloat.length ? m : arg2StrFloat.length);
	arg1Str = arg1.toFixed(m); // 主要是为了补零
	arg2Str = arg2.toFixed(m);
	const transferResult = +(arg1Str.replace('.', '')) + +(arg2Str.replace('.', ''));
	return transferResult / Math.pow(10, m);
}


/**
 * 带有小数的乘法运算
 * @param {Number} arg1 - 因数
 * @param {Number} arg2 - 因数
 */
export const multiplyFloat = (arg1, arg2) => {
	if(arg1 === '****' || arg2 === '****'){
		return '****'
	}
	arg1 = arg1 || 0
	arg2 = arg2 || 0
	let m = 0;
	const arg1Str = arg1 + '';
	const arg2Str = arg2 + '';
	const arg1StrFloat = arg1Str.split('.')[1];
	const arg2StrFloat = arg2Str.split('.')[1];
	arg1StrFloat && (m += arg1StrFloat.length);
	arg2StrFloat && (m += arg2StrFloat.length);
	const transferResult = +(arg1Str.replace('.', '')) * +(arg2Str.replace('.', ''));
	let res = transferResult / Math.pow(10, m) + ''
	if (res.indexOf(".") != -1) {
		res = res.substring(0, res.indexOf(".") + 3);
	}
	return res;
};

/**
 * 有小数的除法运算
 * @param {Number} arg1 - 除数
 * @param {Number} arg2 - 被除数
 */
export const divideFloat = (arg1, arg2) => {
	if(arg1 == '****' || arg2 == '****'){
		return '****'
	}
	arg1 = arg1 || 0
	arg2 = arg2 || 0
	const arg1Str = arg1 + '';
	const arg2Str = arg2 + '';
	const arg1StrFloat = arg1Str.split('.')[1] || '';
	const arg2StrFloat = arg2Str.split('.')[1] || '';
	const m = arg2StrFloat.length - arg1StrFloat.length;
	const transferResult = +(arg1Str.replace('.', '')) / +(arg2Str.replace('.', ''));
	return transferResult * Math.pow(10, m);;
};
