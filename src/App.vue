<template>
<div id="q-app" class="appWrapper">
	<div class="tabs">
		<q-tabs v-model="currentTab">
			<q-tab v-for="tab, index in tabs" :label="tab.name" :name="tab.path" slot="title" :icon="tab.icon" :key="index" />
		</q-tabs>
	</div>

	<router-view :key="currentRoute" class="mainWrapper" />
</div>
</template>

<script>
import {
	mapGetters,
	mapMutations,
	mapActions
} from 'vuex'
//
import {
	QTab,
	QTabs,
	QLayout
} from 'quasar'

export default {
	components: {
		QTab,
		QTabs,
		QLayout
	},
	data() {
		return {
			currentTab: "/",
			tabs: [
				{
					name: 'Бекап',
					path: '/',
					icon: 'backup'
				},
				{
					name: 'Востановить',
					path: '/restore',
					icon: 'build'
				},
			]
		}
	},
	watch: {
		currentTab: path => router.push({
			path
		}),
		currentRoute(n) {
			if (n != this.currentTab)
				this.currentTab = n
		}
	},
	computed: {
		currentRoute() {
			return this.$route.path
		}
	},
	methods: {
		...mapActions([
			'app_init'
		])
	},
	mounted() {
		this.currentTab = this.$route.path
		this.app_init()
	}
}
</script>

<style lang="less">
body,
html {
	height: 100%;
}

.appWrapper {
	height: 100%;
	max-height: 100%;
	display: grid;
	grid-template-rows: min-content 1fr;
	align-content: start;

	.mainWrapper {
		overflow-y: scroll;
	}
}
</style>
