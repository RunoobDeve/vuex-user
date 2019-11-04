import Vue from 'vue'
import Vuex from 'vuex'
import { getUser, delUser,delUsers } from '@/api/user'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    users: [],
    loading: true,
    total:0
  },
  mutations: {
    setUsers(state, users) {
      state.users = users.users
      state.total=users.total
    },
    setLoading(state, status) {
      state.loading = status
    },
    delUser(state, index) {
      state.users.splice(index, 1)
      state.total-=1
    },
    delUsers(state,ids){
      const users=state.users.filter(user=>{
        return ids.indexOf(user.id)===-1
      })
      state.users=users
    }
  },
  actions: {
    getUsers({ commit }, params) {
      // console.log(getUser);
      // console.log(params.page);
      
      commit('setLoading', true),
        getUser(params).then(res => {
          commit('setUsers', res.data.users)
          commit('setLoading', false)
        }
        )
    },
    delUser({ commit,state,dispatch }, params) {
      commit('setLoading', true)
      return delUser(params.id).then(res => {
        // console.log(res); 
        if (res.status === 200) {
          commit('delUser', params.index)
          commit('setLoading', false)
          if (!state.users.length) {
            // 重新分发getUsers
            dispatch('getUsers', { page: 1 })
          }
        }
      })
    },
    delUsers({commit,state,dispatch},params){     
      return delUsers(params.ids.join(',')).then(res=>{
        // console.log(res);     
        if(res.status===200){
          commit('delUsers',params.ids)
        }
        if(!state.users.length){
          dispatch('getUsers',{page:1})
        }
      })
    }
  },
  modules: {
  }
})
