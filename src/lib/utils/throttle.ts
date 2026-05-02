export function throttle(callback: () => void, delay: number) {
	let isThrottled = false;
	return () => {
		if (isThrottled) return;

		callback();
		isThrottled = true;

		setTimeout(() => {
			isThrottled = false;
		}, delay);
	};
}
