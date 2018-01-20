<template>
<div id="q-app">
	<q-tabs v-model="currentTab">
		<q-tab v-for="tab, index in tabs" :label="tab.name" :name="tab.path" slot="title" :icon="tab.icon" :key="index" />
	</q-tabs>
	<router-view />
</div>
</template>

<script>
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
		currentTab: path => router.push({ path })
	},
	computed: {

	},
	mounted () {

	}
}
</script>

<style>

</style>
