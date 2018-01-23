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
*::-webkit-scrollbar-track {
    -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.2);
    border-radius: 10px;
    background-color: #F5F5F5;
}
*::-webkit-scrollbar {
    width: 12px;
	height: 12px;
    background-color: #F5F5F5;
}
*::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #027be3;
}


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
		margin: 10px;
		padding-right: 10px;
		overflow-y: auto;
	}
}
</style>
