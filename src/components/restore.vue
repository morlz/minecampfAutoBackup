<template>
<div class="restoreWrapper">
	<q-list>
		<q-list-header>Список бекапов</q-list-header>
		<q-item-separator />

		<q-item v-for="backup, index in backup_list" :key="index">
			<q-item-side>

			</q-item-side>
			<q-item-main>
				<q-item-tile label>{{ backup }}</q-item-tile>
				<q-item-tile sublabel>Notify me about updates to apps or games that I downloaded</q-item-tile>
			</q-item-main>
		</q-item>

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
	QItemSeparator
} from 'quasar'

export default {
	props: {

	},
	components: {
		QList,
		QListHeader,
		QItem,
		QItemSide,
		QItemTile,
		QItemMain,
		QItemSeparator
	},
	data() {
		return {}
	},
	computed: {
		...mapGetters([
			'backup_list'
		])
	},
	methods: {
		...mapActions([
			'backup_update'
		])
	},
	mounted() {
		this.backup_update()
	}
}
</script>

<style lang="less">

</style>
