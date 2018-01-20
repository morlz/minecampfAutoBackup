const state = {
	run: false,
	timer: false
}

const actions = {
	timer_start () {

	},
	timer_stop () {

	}
}

const mutations = {
	timer_runSet: (state, payload) => state.run = payload
}

const getters = {
	timer_run: state => state.run
}

export default {
    state,
    actions,
    mutations,
    getters
}
