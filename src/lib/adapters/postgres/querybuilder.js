import { Client } from "pg"

const operatorMap = {
	"eq": "=",
	"neq": "!=",
	"gt": ">",
	"lt": "<",
	"gte": ">=",
	"lte": "<=",
	"like": "LIKE",
	"ilike": "LIKE", // MySQL uses "LIKE" for case-insensitive search
	"nlike": "NOT LIKE",
	"nilike": "NOT LIKE", // MySQL uses "LIKE" for case-insensitive search
	"in": "IN",
	"nin": "NOT IN",
	"between": "BETWEEN",
	"nbetween": "NOT BETWEEN",
	"is": "IS",
	"isnot": "IS NOT",
}



export const fetchPostgresData = async (data, connectionDetails) => {
	let result = []
	const client = new Client({
		host: connectionDetails.host,
		port: parseInt(connectionDetails.port),
		user: connectionDetails.user,
		password: connectionDetails.password,
		database: connectionDetails.database,
	})
	await client.connect()

	if (data.filters.query) {
		const res = await client.query(data.filters.query)
		result = res.rows
		client.end()
		return result
	}

	const query = await buildComplexQuery(data)
	const res = await client.query(query)
	result = res.rows
	client.end()

	return result
}


export const buildQuery = async (data) => {
	let query = `SELECT * FROM ${data.table}`
	if (data.filters && data.filters.length > 0 && data.filters[0].attribute) {
		query += " WHERE "
		data.filters.forEach((filter, index) => {
			if (index > 0) {
				query += ` ${filter.comparator} `
			}
			query += `${filter.attribute} ${operatorMap[filter.operator]} ?` // Use placeholders for values
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
			query += `${filter.attribute} ${operatorMap[filter.operator]} ?` // Use placeholders for values
		})
	}

	if (timeCol && timeCol !== "null") {
		query += ` ORDER BY ${timeCol} ASC`
	}

	return query
}
