<template>
<div class="restoreWrapper">
	<div class="noFoldrerMsg" v-if="settings_showNoRestoreMessage">
		{{ settings_showNoRestoreMessage }}
	</div>

	<q-list class="list" v-if="!settings_showNoRestoreMessage">
		<q-collapsible v-for="day, index in backup_list" :key="index" :label="`${day.date} (${day.items.length})`" >
			<q-item v-for="backup, backupIndex in day.items" :key="backupIndex" class="item">
				<q-item-side>
					{{ backup.index }}
				</q-item-side>
				<q-item-main>
					<q-item-tile label>{{ backup.name }}</q-item-tile>
					<q-item-tile sublabel>
						{{ backup.time }}
						{{ sizeFormat(backup.size) }}
					</q-item-tile>
				</q-item-main>
				<q-item-side class="buttons">
					<q-btn color="primary" class="button" @click="backup_restore(backup.name)">Востановить</q-btn>
				</q-item-side>
			</q-item>
		</q-collapsible>
	</q-list>
</div>
</template>

<script>

import { mapGetters, mapMutations, mapActions } from 'vuex'

import {
	QList,
	QListHeader,
	QItem,
	QItemSide,
	QItemTile,
	QItemMain,
	QItemSeparator,
	QCollapsible,
	QBtn
} from 'quasar'

export default {
	components: {
		QList,
		QListHeader,
		QItem,
		QItemSide,
		QItemTile,
		QItemMain,
		QItemSeparator,
		QCollapsible,
		QBtn
	},
	watch: {
		'settings.path.to' (n) {
			this.backup_updateList()
		}
	},
	computed: {
		...mapGetters([
			'backup_list',
			'settings',
			'settings_showNoRestoreMessage',
			'settings_types',
		])
	},
	methods: {
		...mapActions([
			'backup_updateList',
			'backup_watch',
			'backup_unWatch',
			'backup_restore'
		]),
		sizeFormat (size) {
			let tmp = size,
				exp = 0
			for (; 0x400 < tmp; exp++)
				tmp /= 0x400

			let type = this.settings_types.find(el => el.value == exp) || {}
			size = (size + "").split('').reverse().reduce((prev, el, index) => el + (index % 3 ? '' : ' ') + prev, "")
			return `${tmp.toFixed(2)} ${type.label} (${size} Б)`
		}
	},
	mounted() {
		this.backup_updateList()
		this.backup_watch()
	},
	beforeDestroy() {
		this.backup_unWatch()
	}
}
</script>

<style lang="less">
	.restoreWrapper {
		.item {
			transition: all 0.3s ease-in-out;
			.button {
				opacity: 0;
				transition: all 0.3s ease-in-out;
			}
			&:hover {
				background: hsla(0,0%,74%,.4);
				.button {
					opacity: 1;
				}
			}
		}
		.description {
			display: grid;
			grid-auto-flow: row;
			justify-content: start;
			grid-template-columns: 50px 1fr;
		}
	}

	.q-item {
		transition: all 0.3s ease-in-out;
	}
</style>
