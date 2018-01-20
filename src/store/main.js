import {
	Alert
} from 'quasar'


const state = {

}

const actions = {
	notify({
		commit,
		dispatch
	}, payload) {
		Alert.create({
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
