export const permissions = {

	"Free": {
		"create:segment": {
			limit: 0,
		},
		"create:dashboard": {
			limit: 1,
		},
		"create:workflow": {
			limit: 0,
		},
		"create:datasource": {
			limit: 1,
		},
		"invite:member": false,
		"create:workspace": {
			type: "personal",
		},
	},

	"Starter": {
		"create:segment": {
			limit: 3,
		},
		"create:dashboard": {
			limit: 3,
		},
		"create:workflow": {
			limit: 3,
		},
		"create:datasource": {
			limit: 3,
		},
		"invite:member": false,
		"create:workspace": {
			type: "personal",
		},
	},

	"Business": {
		"create:segment": {
			limit: -1,
		},
		"create:dashboard": {
			limit: 25,
		},
		"create:workflow": {
			limit: 5,
		},
		"create:datasource": {
			limit: 5,
		},
		"invite:member": true,
		"create:workspace": {
			type: "team",
			limit: 5
		},
		"create:exports": {
			allowed: true,
		},
	},

	"Enterprise": {
		"create:segment": {
			limit: 9999999,
		},
		"create:dashboard": {
			limit: 9999999,
		},
		"create:workflow": {
			limit: 9999999,
		},
		"create:datasource": {
			limit: 9999999,
		},
		"invite:member": true,
		"create:workspace": {
			type: "team",
			limit: 9999999
		},
		"create:exports": {
			allowed: true,
		},
	}
}
