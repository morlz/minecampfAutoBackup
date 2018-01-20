import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

function load(component) {
	// '@' is aliased to src/components
	return () =>
		import (`@/components/${component}.vue`)
}

const scrollBehavior = () => ({
	y: 0
})

const routes = [
  { path: '/', component: load('backup') },
  { path: '/restore', component: load('restore') },

  // Always leave this last one
  { path: '*', component: load('Error404') } // Not found
]

const router = new VueRouter({
	mode: 'hash',
	scrollBehavior,
	routes
})

global.router = router

export default router
