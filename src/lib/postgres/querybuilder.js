const operatorMap = {
	"eq": "=",
	"neq": "!=",
	"gt": ">",
	"lt": "<",
	"gte": ">=",
	"lte": "<=",
	"like": "LIKE",
	"ilike": "ILIKE",
	"nlike": "NOT LIKE",
	"nilike": "NOT ILIKE",
	"in": "IN",
	"nin": "NOT IN",
	"between": "BETWEEN",
	"nbetween": "NOT BETWEEN",
	"is": "IS",
	"isnot": "IS NOT",
}


export const buildQuery = async (data) => {
	let query = `SELECT * FROM ${data.table}`
	if (data.filters && data.filters.length > 0 && data.filters[0].attribute) {
		query += " WHERE "
		data.filters.forEach((filter, index) => {
			if (index > 0) {
				query += ` ${filter.comparator} `
			}
			query += `${filter.attribute} ${operatorMap[filter.operator]} ${filter.value}`
		})
	}

	return query
}


export const buildComplexQuery = async (data) => {
	let dataTable = data.dataTable
	let dataCol = data.dataCol
	let timeTable = data.timeTable
	let timeCol = data.timeCol
	let filters = data.filters

	let selection = timeCol ? `${dataCol}, ${timeCol}` : dataCol

	let query = `SELECT ${selection} FROM ${dataTable}`
	if (data.filters && data.filters.length > 0) {
		query += " WHERE "
		filters.forEach((filter, index) => {
			if (index > 0) {
				query += ` ${filter.comparator} `
			}
			query += `${filter.attribute} ${operatorMap[filter.operator]} ${filter.value}`
		})
	}

	if (timeCol && timeCol !== "null") {
		query += ` ORDER BY ${timeCol} ASC`
	}

	return query
}
