const state = {
	run: false
}

const actions = {
	server_up () {

	},
	server_down () {

	}
}

const mutations = {
	server_runSet: (state, payload) => state.run = payload
}

const getters = {
	server_run: state => state.run
}

export default {
    state,
    actions,
    mutations,
    getters
}
