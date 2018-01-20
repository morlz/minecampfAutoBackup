import Vuex from 'vuex'
import Vue from 'vue'

import settings from './settings'
import timer from './timer'
import server from './server'
import main from './main'
import backup from './backup'

Vue.use(Vuex)

export default new Vuex.Store({
    modules: {
		settings,
		timer,
		server,
		main,
		backup
    }
})
