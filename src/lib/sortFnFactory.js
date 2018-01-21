const sortFnFactory = (field, revert = false) => {
	return (a, b) => {
		if (typeof field == 'function') {
			if (field(a) > field(b)) return revert ? 1 : -1
			if (field(a) < field(b)) return revert ? -1 : 1
		}
		if (a[field] > b[field]) return revert ? 1 : -1
		if (a[field] < b[field]) return revert ? -1 : 1
		return 0
	}
}

export default sortFnFactory
