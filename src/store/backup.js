import fs from 'fs-extra'
import path from 'path'
import dateFormat from 'dateformat'
import sortFnFactory from '@/lib/sortFnFactory'
import folderSize from 'get-folder-size'

fs.size = (...args) => new Promise((resolve, reject) => folderSize(...args, (err, size) => err ? reject(err) : resolve(size)))

const state = {
	list: [],
	fsWatcher: false
}

const actions = {
	async backup_now ({ commit, dispatch, getters }) {
		commit('settings_statusUpdate')

		if (!getters.settings_status.from)
			return dispatch('alert', 'Неоткуда копировать')

		if (!getters.settings_status.to)
			return dispatch('alert', 'Некуда копировать')

		let index = isNaN(+getters.settings.index) ? "0" : (+getters.settings.index + 1) + "",
			worldName = `world_${index}_${Date.now()}`,
			backupPath = path.join(getters.settings.path.to, worldName),
			settings = { ...getters.settings, index }

		settings.timing.last = Date.now()
		dispatch('settings_set', settings)

		await dispatch('backup_updateList')

		try {
			let [sizeFrom, sizeTo] = await Promise.all([
				fs.size(getters.settings.path.from),
				fs.size(getters.settings.path.to)
			])

			if (sizeFrom + sizeTo > getters.settings_maxSpace)
				await dispatch('backup_createSpace', sizeFrom + sizeTo - getters.settings_maxSpace)
		} catch (err) {
			dispatch('alert', `Ошибка управления местом ${err}`)
		}

		try {
			await fs.copy(getters.settings.path.from, backupPath)
			dispatch('notify', `Создан бекап: ${worldName}`)
		} catch (err) {
			dispatch('alert', `Ошибка копирования ${err}`)
		}
	},
	async backup_createSpace({ commit, dispatch, getters }, payload){
		let curSize = await fs.size(getters.settings.path.to),
			needSpace = curSize - payload

		try {
			while (curSize > needSpace) {
				await dispatch('backup_removeLast')
				curSize = await fs.size(getters.settings.path.to)
			}
		} catch (err) {
			dispatch('alert', `Ошибка создания свободного места ${err}`)
		}
	},
	async backup_removeLast({ commit, dispatch, getters }){
		let daysBiggerThatOne = getters.backup_list.filter(el => el.items.length > 1 && el.date != dateFormat(new Date(), "yyyy-mm-dd"))

		if (daysBiggerThatOne.length)
			return await dispatch('backup_remove', daysBiggerThatOne.pop().items.pop())

		let daysNotNow = getters.backup_list.filter(el => el.date != dateFormat(new Date(), "yyyy-mm-dd"))

		if (daysNotNow.length)
			return await dispatch('backup_remove', daysNotNow.pop().items.pop())

		let now = getters.backup_list.filter(el => el.date == dateFormat(new Date(), "yyyy-mm-dd") && el.items)[0]

		if (now && now.items.length)
			return await dispatch('backup_remove', now.items.pop())

		throw new Error('Больше нет бекапов')
	},
	async backup_remove({ commit, dispatch, getters }, payload){
		if (!payload || !payload.name)
			return dispatch('alert', '[backup_remove] invalid params')

		try {
			await fs.remove(getters.settings.path.to + '/' + payload.name)
			dispatch('notify', `Бекап ${payload.name} удалён. Освобождено ${payload.size} Б.`)
		} catch (err) {
			dispatch('alert', err)
		}

		await dispatch('backup_updateList')
	},
	async backup_updateList({ commit, dispatch, getters }) {
		commit('settings_statusUpdate')
		if (!getters.settings_status_to || !getters.settings.path.to) return

		try {
			let list = await fs.readdir(getters.settings.path.to)
			let sizes = await Promise.all( list.reduce((promises, el) => [ promises.push( fs.size( getters.settings.path.to + '/' + el ) ), promises ][1], []) )
			commit('backup_listSet', list.map( (el, index) => ({ name: el, size: sizes[index] }) ))
		} catch (err) {
			dispatch('alert', err)
		}
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
	async backup_restore({ commit, dispatch, getters }, payload) {
		let backupPath = getters.settings.path.to.split('/')
		backupPath.push(payload)
		backupPath = backupPath.join('/')

		if (!fs.existsSync(backupPath))
			return dispatch('alert', 'Указаный бекап не существует')

		if (!fs.existsSync(getters.settings.path.from))
			return dispatch('alert', 'Указаный бекап не существует')

		let oldPath = getters.settings.path.from + '_old'

		try {
			if (fs.existsSync(oldPath))
				await fs.remove(oldPath)

			await fs.rename(getters.settings.path.from, oldPath)
			await fs.copy(backupPath, getters.settings.path.from)
			dispatch('notify', 'Бекап востановлен')
		} catch (err) {
			dispatch('alert', err)
		}
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
			let splited = el.name.split('_'),
				datetime = new Date(),
				time,
				date

			if (splited.length != 3) return

			try {
				datetime.setTime(splited[2])
				time = dateFormat(datetime, "HH:MM:ss")
				date = dateFormat(datetime, "yyyy-mm-dd")
			} catch (err) {
				time = '...'
				date = '...'
			}

			if (!list.find(item => item.date == date))
				list.push({ date, items: [] })

			list.find(item => item.date == date).items.unshift({
				name: el.name,
				size: el.size,
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
