import {
	Alert,
	Toast
} from 'quasar'


const state = {
	now: Date.now()
}

const actions = {
	app_init({ commit, dispatch }){
		dispatch('settings_get')
		dispatch('backup_updateList')
		setInterval(() => dispatch('app_engine'), 1e3)
	},
	app_engine ({ commit, dispatch }) {
		dispatch('backup_check')
		commit('app_updateNow')
	},
	alert({
		commit,
		dispatch
	}, payload) {
		console.log(payload)
		Alert.create({
			html: payload,
		})
	},
	notify({
		commit,
		dispatch
	}, payload) {
		Toast.create({
			html: payload,
		})
	}
}

const mutations = {
	app_updateNow: state => state.now = Date.now()
}

const getters = {
	app_now: state => state.now
}

export default {
	state,
	actions,
	mutations,
	getters
}
