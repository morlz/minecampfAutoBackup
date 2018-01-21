import fs from 'fs-extra'
import path from 'path'
import dateFormat from 'dateformat'
import sortFnFactory from '@/lib/sortFnFactory'


const state = {
	list: [],
	fsWatcher: false
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
			let settings = { ...getters.settings, index }
			settings.timing.last = Date.now()
			dispatch('settings_set', settings)
			dispatch('notify', `Создан бекап: ${worldName}`)
		})
		.catch(err => dispatch('alert', `Ошибка копирования ${err}`))
	},
	backup_updateList({ commit, dispatch, getters }) {
		commit('settings_statusUpdate')
		if (!getters.settings_status_to || !getters.settings.path.to) return

		fs.readdir(getters.settings.path.to)
			.then(data => commit('backup_listSet', data))
			.catch(err => dispatch('alert', err))
	},
	backup_check({ commit, dispatch, getters }){
		if (getters.settings.timing.interval - (getters.app_now - getters.settings.timing.last) / 1e3 > 0) return
		if (!getters.timer_run) return
		dispatch('backup_now')
	},
	backup_watch({ commit, dispatch, getters }) {
		if (!getters.settings_status.to) return

		let watcher = fs.watch(getters.settings.path.to)
		watcher.on('change', (e, data) => dispatch('backup_updateList'))
		commit('backup_fsWatcherSet', watcher)
	},
	backup_unWatch({ commit, dispatch, getters }) {
		if (getters.backup_fsWatcher)
			getters.backup_fsWatcher.close()

		commit('backup_fsWatcherSet', false)
	},
	backup_restore({ commit, dispatch, getters }, payload) {
		const removeIfExist = oldPath => {
			if (fs.existsSync(oldPath))
				return fs.rmdir(oldPath)
			else
				return new Promise(resolve => resolve())
		}


		let backupPath = getters.settings.path.to.split('/')
		backupPath.push(payload)
		backupPath = backupPath.join('/')

		if (!fs.existsSync(backupPath))
			return dispatch('alert', 'Указаный бекап не существует')

		if (!fs.existsSync(getters.settings.path.from))
			return dispatch('alert', 'Указаный бекап не существует')

		let oldPath = getters.settings.path.from + '_old'

		removeIfExist(oldPath)
			.then(() => fs.rename(getters.settings.path.from, oldPath))
			.then(() => fs.copy(backupPath, getters.settings.path.from))
			.then(() => dispatch('notify', 'Бекап востановлен'))
			.catch(err => dispatch('alert', err))
	}
}

const mutations = {
	backup_listSet: (state, payload) => state.list = payload,
	backup_fsWatcherSet: (state, payload) => state.fsWatcher = payload
}

const getters = {
	backup_list: state => {
		let list = []

		state.list.map(el => {
			let splited = el.split('_'),
				datetime = new Date()

			datetime.setTime(splited[2])

			let time = dateFormat(datetime, "HH:MM:ss"),
				date = dateFormat(datetime, "yyyy-mm-dd")

			if (!list.find(item => item.date == date))
				list.push({ date, items: [] })

			list.find(item => item.date == date).items.unshift({
				name: el,
				index: splited[1],
				time,
				timestamp: +splited[2]
			})
		})

		return list.map(day => {
			return {
				date: day.date,
				items: day.items.sort(sortFnFactory('timestamp'))
			}
		}).sort(sortFnFactory('date'))
	},
	backup_fsWatcher: state => state.fsWatcher
}

export default {
    state,
    actions,
    mutations,
    getters
}
