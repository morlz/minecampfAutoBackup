const state = {
	run: false
}

const actions = {}

const mutations = {
	timer_runSet: (state, payload) => state.run = payload,
	timer_start: state => state.run = true,
	timer_stop: state => state.run = false,
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
