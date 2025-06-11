export function minutesToHours(minutes: number): string {
	const hours = Math.floor(minutes / 60);
	const remainingMinutes = minutes % 60;
	return `${hours}h ${remainingMinutes}m`;
}

export function getTimeInfoFromMinutes(minutes: number) {
	const safeMinutes = Math.max(0, minutes);

	const totalDays = Math.floor(safeMinutes / (24 * 60));
	const remainingAfterDays = safeMinutes % (24 * 60);
	const totalHoursMinusDays = Math.floor(remainingAfterDays / 60);
	const totalMinutesMinusHours = Math.floor(remainingAfterDays % 60);
	const totalSecondsMinusMinutes = Math.floor((remainingAfterDays % 1) * 60);
	const totalHours = Math.floor(safeMinutes / 60);
	const totalMinutes = Math.floor(safeMinutes % 60);
	const totalSeconds = Math.floor(safeMinutes * 60);

	return {
		totalDays,
		totalHoursMinusDays,
		totalMinutesMinusHours,
		totalSecondsMinusMinutes,
		totalHours,
		totalMinutes,
		totalSeconds,
	};
}
