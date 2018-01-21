import fs from 'fs-extra'
import path from 'path'

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
		let configFilePath = path.resolve('./', state.filename)

		if (!fs.existsSync(configFilePath)) {
			fs.writeFileSync(configFilePath, JSON.stringify(state.settings))
		} else {
			fs.readFile(configFilePath, { encoding: 'utf8' })
			.then(data => {
				try {
					if (!data) throw new Error('Файл пуст')
					commit('settings_set', JSON.parse(data))
					commit('settings_statusUpdate')
				} catch (err) {
					dispatch('alert', `Ошибка чтения файла настроек, невалидный json ${err}`)
					fs.writeFileSync(configFilePath, JSON.stringify(state.settings))
				}
			})
			.catch(err => dispatch('alert', `Ошибка чтения файла настроек ${err}`))
		}
	},
	settings_set ({ commit, dispatch, state }, payload) {
		if (payload == undefined)
			payload = state.settings

		for (var prop in payload.path)
			if (payload.path.hasOwnProperty(prop))
				payload.path[prop] = payload.path[prop].split('\\').join('/')

		commit('settings_set', payload)
		commit('settings_statusUpdate')

		fs.writeFile(state.filename, JSON.stringify(payload), { encoding: 'utf8' })
		.catch(err => dispatch('alert', 'Ошибка записи файла настроек'))
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
				state.exist[prop] = state.settings.path[prop].length != 0 ? fs.existsSync(state.settings.path[prop]) : false
	},
	settings_lastBackupSet: (state, payload) => state.settings.timing.last = payload
}

const getters = {
	settings: state => state.settings,
	settings_status: state => state.exist,
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
