export function Int2Str(IntTime) {
	let StrTime = "";
	StrTime += parseInt(IntTime / 600);
	StrTime += parseInt((IntTime / 60) % 10);
	StrTime += ":";
	StrTime += parseInt((IntTime % 60) / 10);
	StrTime += IntTime % 10;
	return StrTime;
}

export function Str2Int(StrTime) {
	let IntTime = 0;
	IntTime += StrTime[0] - "0";
	IntTime *= 10;
	IntTime += StrTime[1] - "0";
	IntTime *= 6;
	IntTime += StrTime[3] - "0";
	IntTime *= 10;
	IntTime += StrTime[4] - "0";
	return IntTime;
}
