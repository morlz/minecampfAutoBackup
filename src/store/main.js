import {
	Alert,
	Toast
} from 'quasar'


const state = {

}

const actions = {
	alert({
		commit,
		dispatch
	}, payload) {
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

}

const getters = {

}

export default {
	state,
	actions,
	mutations,
	getters
}
