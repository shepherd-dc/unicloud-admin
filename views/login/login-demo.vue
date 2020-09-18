<template>
  <view class="content">
    <input
      v-model="username"
      type="text"
      placeholder="用户名/邮箱/手机号" />
    <input
      v-model="password"
      type="text"
      password="true"
      placeholder="密码" />
    <button
      type="default"
      @tap="register">注册</button>
    <button
      type="default"
      @tap="login">登录</button>
    <button
      type="default"
      @tap="updatePwd">修改密码</button>
    <button
      type="default"
      @tap="resetPwd">重设密码</button>
  </view>
</template>

<script>
export default {
  data () {
    return {
      username: '',
      password: ''
    }
  },
  methods: {
    register () {
      uniCloud.callFunction({
        name: 'user-center',
        data: {
          action: 'register',
          params: {
            username: this.username,
            password: this.password
          }
        },
        success (res) {
          uni.showModal({
            showCancel: false,
            content: JSON.stringify(res.result)
          })
          uni.setStorageSync('uniIdToken', res.result.token)
          uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
        },
        fail (e) {
          console.error(e)
          uni.showModal({
            showCancel: false,
            content: '注册失败，请稍后再试'
          })
        }
      })
    },
    login () {
      uniCloud.callFunction({
        name: 'user-center',
        data: {
          action: 'login',
          params: {
            username: this.username,
            password: this.password
          }
        },
        success (res) {
          uni.showModal({
            showCancel: false,
            content: JSON.stringify(res.result)
          })
          uni.setStorageSync('uniIdToken', res.result.token)
          uni.setStorageSync('uni_id_token_expired', res.result.tokenExpired)
        },
        fail (e) {
          console.error(e)
          uni.showModal({
            showCancel: false,
            content: '登录失败，请稍后再试'
          })
        }
      })
    },
    updatePwd () {
      uniCloud.callFunction({
        name: 'user-center',
        data: {
          action: 'updatePwd',
          params: {
            oldPassword: '123456',
            newPassword: 'abcdef',
            password_confirmation: 'abcdef'
          }
        },
        success (res) {
          uni.showModal({
            showCancel: false,
            content: JSON.stringify(res.result)
          })
        },
        fail (e) {
          console.error(e)
          uni.showModal({
            showCancel: false,
            content: '修改失败，请稍后再试'
          })
        }
      })
    },
    resetPwd () {
      uniCloud.callFunction({
        name: 'user-center',
        data: {
          action: 'resetPwd'
        },
        success (res) {
          if (res.result.code === 0) {
            uni.showModal({
              showCancel: false,
              content: '密码已重置为123456'
            })
          } else {
            uni.showModal({
              showCancel: false,
              content: JSON.stringify(res.result)
            })
          }
        },
        fail (e) {
          console.error(e)
          uni.showModal({
            showCancel: false,
            content: '重置失败，请稍后再试'
          })
        }
      })
    }
  }
}
</script>

<style>

</style>
