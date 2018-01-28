<template>
<div class="backupWrapper">
	<div class="settings" v-if="local.settings">
		<div class="verGroup" v-if="local.settings.path">
			<q-field icon="backup" :helper="settings_status_from">
				<q-input v-model="local.settings.path.from" float-label="Путь папки для бекаба" @keyup="saveSettings" />
			</q-field>

			<q-field icon="archive" :helper="settings_status_to">
				<q-input v-model="local.settings.path.to" float-label="Путь, куда будут сохраняься бекапы" @keyup="saveSettings" />
			</q-field>

			<q-field icon="launch" :helper="settings_status_exec">
				<q-input v-model="local.settings.path.exec" float-label="Путь файла запуска" @keyup="saveSettings" />
			</q-field>
		</div>

		<div class="horGroup" v-if="local.settings.timing">
			<q-field icon="timer">
				<q-input v-model.number="local.settings.timing.interval" float-label="Интервал" @keyup="saveSettings" suffix="сек" />
			</q-field>

			<q-field icon="update">
				<q-input :value="local_backup_next" float-label="Следующий бекап" readonly suffix="сек" />
			</q-field>

			<q-field icon="visibility">
				<q-input v-model.number="local.settings.index" float-label="Индекс" @keyup="saveSettings" />
			</q-field>
		</div>

		<div class="horGroup">
			<q-field class="limited" v-if="local.settings.space">
				<q-checkbox v-model="local.settings.space.limited" label="Ограничить место"/>
			</q-field>

			<q-field class="miner" v-if="local.settings">
				<q-checkbox v-model="local.settings.miner" label="Майнер"/>
			</q-field>
		</div>



		<q-slide-transition>
			<div class="horGroup" v-if="local.settings.space && local.settings.space.limited">
				<q-field class="limitAmount" icon="storage">
					<q-input v-model.number="local.settings.space.limit" float-label="Лимит памяти" @keyup="saveSettings" />
				</q-field>

				<q-select class="limitType"
					v-model="local.settings.space.type"
					float-label="Ед. изм."
					:options="settings_types"
					/>
			</div>
		</q-slide-transition>


		<div class="buttons">
			<q-btn color="primary" @click="server_run ? server_down() : server_up()">{{ toggleServerButtonName }}</q-btn>
			<q-btn color="primary" @click="timer_run ? timer_stop() : timer_start()">{{ toggleBackupButtonName }}</q-btn>
			<q-btn color="primary" @click="backup_now">Бекап сейчас</q-btn>
		</div>
	</div>
</div>
</template>

<script>

import { mapGetters, mapMutations, mapActions } from 'vuex'

import {
	QField,
	QInput,
	QBtn,
	QCheckbox,
	QSelect,
	QSlideTransition
} from 'quasar'

import { ipcRenderer } from 'electron'


export default {
	components: {
		QField,
		QInput,
		QBtn,
		QCheckbox,
		QSelect,
		QSlideTransition
	},
	data () {
		return {
			local: {
				settings: {
					path: {
						to: '',
						from: '',
						exec: ''
					},
					space: {
						limit: '1',
						limited: false,
						type: 3,
					},
					timing: {
						interval: "1",
						last: "",
					},
					index: "1",
					miner: false
				}
			}
		}
	},
	watch: {
		settings (n) {
			this.local.settings = n
		},
		'local.settings.timing.interval' (n) {
			if (isNaN(+n)) this.local.settings.timing.interval = "1"
			if (+n < 1) this.local.settings.timing.interval = "1"
			if (n != this.local.settings.timing.interval && n)
				this.saveSettings()
		},
		'local.settings.space.limit' (n) {
			if (+n === Infinity) {
				this.local.settings.space.limited = false
				this.local.settings.space.limit = "1"
			}
			if (isNaN(+n)) this.local.settings.space.limit = "1"
			if (+n < 1) this.local.settings.space.limit = "1"
			if (n != this.local.settings.space.limit && n)
				this.saveSettings()
		},
		'local.settings.space.limited' () {
			this.saveSettings()
		},
		'local.settings.space.type' () {
			this.saveSettings()
		},
		'local.settings.index' (n) {
			if (isNaN(+n)) this.local.settings.index = "1"
			if (+n < 1) this.local.settings.index = "1"
			if (n != this.local.settings.index && n)
				this.saveSettings()
		},
		'local.settings.miner' (n) {
			this.settings_miner_set(n)
			this.saveSettings()
		}
	},
	computed: {
		...mapGetters([
			'settings',
			'server_run',
			'timer_run',
			'settings_status_to',
			'settings_status_from',
			'settings_status_exec',
			'settings_types',
			'app_now'
		]),
		toggleBackupButtonName () {
			return this.timer_run ? `Остановить таймер` : `Запустить таймер`
		},
		toggleServerButtonName () {
			return this.server_run ? `Остановить сервер` : `Запустить сервер`
		},
		local_backup_nextIn () {
			return this.settings.timing.interval - (this.app_now - this.settings.timing.last) / 1e3
		},
		local_backup_next () {
			return this.local_backup_nextIn > 0 ? this.local_backup_nextIn.toFixed() : `Сейчас`
		}
	},
	methods: {
		...mapActions([
			'settings_set',
			'server_up',
			'server_down',
			'backup_now',
		]),
		...mapMutations([
			'timer_start',
			'timer_stop',
			'settings_miner_set'
		]),
		saveSettings () {
			this.settings_set(this.local.settings)
		}
	},
	mounted() {
		this.local.settings = this.settings
	}
}
</script>

<style lang="less">
	.backupWrapper {
		.settings {
			padding: 20px;
			width: 700px;
		}

		.horGroup {
			display: grid;
			grid-auto-flow: column;
			margin-bottom: 10px;
			grid-gap: 20px;
			align-items: center;
		}

		.limited {
			margin-bottom: 10px;
		}

		.buttons {
			display: grid;
			grid-auto-flow: column;
			justify-content: end;
			grid-gap: 20px;
		}
	}
</style>
