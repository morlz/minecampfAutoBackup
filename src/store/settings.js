import fs from 'fs'

const state = {
	filename: 'settings.json',
	settings: {
		path: {
			to: '',
			from: '',
			exec: ''
		},
		timing: {
			interval: '',
			last: '',
		},
		index: '',
	},
	exist: {
		to: false,
		from: false,
		exec: false
	}
}

const actions = {
	settings_get ({ commit, dispatch, state }) {
		if (!fs.existsSync(state.filename)) {
			fs.writeFileSync(state.filename, JSON.stringify(state.settings))
		} else {
			fs.readFile(state.filename, { encoding: 'utf8' }, (err, data) => {
				if (err) dispatch('notify', 'Ошибка чтения файла настроек')
				try {
					commit('settings_set', JSON.parse(data))
					commit('settings_statusUpdate')
				} catch (err) {
					dispatch('notify', 'Ошибка чтения файла настроек, невалидный json')
				}
			})
		}
	},
	settings_set ({ commit, dispatch, state }, payload) {
		for (var prop in payload.path)
			if (payload.path.hasOwnProperty(prop))
				payload.path[prop] = payload.path[prop].split('\\').join('/')

		commit('settings_set', payload)
		commit('settings_statusUpdate')

		fs.writeFile(state.filename, JSON.stringify(payload), { encoding: 'utf8' }, err => {
			if (err) dispatch('notify', { message: 'Ошибка записи файла настроек' })
		})
	}
}

const mutations = {
	settings_set: (state, payload) => {
		let tmp = {}

		for (var prop in payload)
			if (payload.hasOwnProperty(prop) && state.settings[prop] != undefined) {
				tmp[prop] = payload[prop]
			}

		state.settings = { ...state.settings, ...tmp }
	},
	settings_statusUpdate: state => {
		for (var prop in state.settings.path)
			if (state.settings.path.hasOwnProperty(prop))
				if (state.settings.path[prop].length == 0) {
					state.exist[prop] = false
				} else {
					state.exist[prop] = fs.existsSync(state.settings.path[prop])
				}
	}
}

const getters = {
	settings: state => state.settings,
	settings_status_to: state => state.exist.to ? `Существует` : state.settings.path.to.length ? `Не существует` : `Не задано`,
	settings_status_from: state => state.exist.from ? `Существует` : state.settings.path.from.length ? `Не существует` : `Не задано`,
	settings_status_exec: state => state.exist.exec ? `Существует` : state.settings.path.exec.length ? `Не существует` : `Не задано`,
}

export default {
    state,
    actions,
    mutations,
    getters
}
