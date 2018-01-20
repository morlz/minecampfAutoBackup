import fs from 'fs-extra'
import path from 'path'

const state = {
	list: []
}

const actions = {
	backup_now ({ commit, dispatch, getters }) {
		commit('settings_statusUpdate')

		if (!getters.settings_status.from)
			return dispatch('alert', 'Неоткуда копировать')

		if (!getters.settings_status.to)
			return dispatch('alert', 'Некуда копировать')

		let index = isNaN(+getters.settings.index) ? "0" : (+getters.settings.index + 1) + "",
			worldName = `world_${index}_${Date.now()}`,
			backupPath = path.join(getters.settings.path.to, worldName)

		fs.copy(getters.settings.path.from, backupPath)
		.then(e => {
			commit('settings_set', { ...getters.settings, index })
			dispatch('notify', `Создан бекап: ${worldName}`)
		})
		.catch(err => dispatch('alert', `Ошибка копирования ${err}`))
	},
	backup_update({ commit, dispatch, getters }) {
		if (!getters.settings_status.to) return

		fs.readdir(getters.settings.path.to)
			.then(data => commit('backup_listSet', data))
			.catch(err => dispatch('alert', err))
	}
}

const mutations = {
	backup_listSet: (state, payload) => state.list = payload
}

const getters = {
	backup_list: state => state.list
}

export default {
    state,
    actions,
    mutations,
    getters
}
