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
				<q-input v-model="local.settings.timing.last" float-label="Следующий бекап" />
			</q-field>

			<q-field icon="visibility">
				<q-input v-model.number="local.settings.index" float-label="Индекс" @keyup="saveSettings" />
			</q-field>
		</div>

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
	QBtn
} from 'quasar'

import { ipcRenderer } from 'electron'


export default {
	components: {
		QField,
		QInput,
		QBtn
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
					timing: {
						interval: "0",
						last: "",
					},
					index: "0"
				}
			}
		}
	},
	watch: {
		settings (n) {
			this.local.settings = n
		}
	},
	computed: {
		...mapGetters([
			'settings',
			'server_run',
			'timer_run',
			'settings_status_to',
			'settings_status_from',
			'settings_status_exec'
		]),
		toggleBackupButtonName () {
			return this.rimter_run ? `Остановить таймер` : `Запустить таймер`
		},
		toggleServerButtonName () {
			return this.server_run ? `Остановить сервер` : `Запустить сервер`
		}
	},
	methods: {
		...mapActions([
			'settings_set',
			'settings_get',
			'server_up',
			'server_down',
			'timer_start',
			'timer_stop',
			'backup_now'
		]),
		saveSettings () {
			this.settings_set(this.local.settings)
		}
	},
	mounted() {
		this.settings_get()
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
		}

		.buttons {
			display: grid;
			grid-auto-flow: column;
			justify-content: end;
			grid-gap: 20px;
		}
	}
</style>
