<template>
<div id="q-app">
	<q-tabs v-model="currentTab">
		<q-tab v-for="tab, index in tabs" :label="tab.name" :name="tab.path" slot="title" :icon="tab.icon" :key="index" />
	</q-tabs>
	<router-view :key="currentRoute" />
</div>
</template>

<script>


import { mapGetters, mapMutations, mapActions } from 'vuex'

import {
	QTab,
	QTabs
} from 'quasar'

export default {
	components: {
		QTab,
		QTabs
	},
	data () {
		return {
			currentTab: "/",
			tabs: [
				{ name: 'Бекап', path: '/', icon: 'backup' },
				{ name: 'Востановить', path: '/restore', icon: 'build' },
			]
		}
	},
	watch: {
		currentTab: path => router.push({ path }),
		currentRoute (n) {
			if (n != this.currentTab)
				this.currentTab = n
		}
	},
	computed: {
		currentRoute () {
			return this.$route.path
		}
	},
	methods: {
		...mapActions([
			'app_init'
		])
	},
	mounted () {
		this.currentTab = this.$route.path
		this.app_init()
	}
}
</script>

<style>

</style>
