<template>
<div class="restoreWrapper">
	<q-list class="list">
		<q-collapsible v-for="day, index in backup_list" :key="index" :label="`${day.date} (${day.items.length})`">
			<q-item v-for="backup, backupIndex in day.items" :key="backupIndex">
				<q-item-side>
					{{ backup.index }}
				</q-item-side>
				<q-item-main>
					<q-item-tile label>{{ backup.name }}</q-item-tile>
					<q-item-tile sublabel>
						{{ backup.time }}
					</q-item-tile>
				</q-item-main>
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
	QCollapsible
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
		QCollapsible
	},
	watch: {
		'settings.path.to' (n) {
			this.backup_updateList()
		}
	},
	computed: {
		...mapGetters([
			'backup_list',
			'settings'
		])
	},
	methods: {
		...mapActions([
			'backup_updateList',
			'backup_watch'
		])
	},
	mounted() {
		this.backup_updateList()
		this.backup_watch()
	},
	beforeDestroy() {

	}
}
</script>

<style lang="less">
	.restoreWrapper {
		.description {
			display: grid;
			grid-auto-flow: row;
			justify-content: start;
			grid-template-columns: 50px 1fr;
		}
	}
</style>
