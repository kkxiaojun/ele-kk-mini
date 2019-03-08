//index.js
//获取应用实例
const app = getApp()
// 引用百度地图微信小程序JSAPI模块 
const bmap = require('../../libs/bmap-wx.min.js');
Page({
  data: {
    userInfo: {},
    hasUserInfo: false,
    weatherData: '',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    let code = ''
    wx.login({
      success: function(res) {
        console.log('code:', res)
        code = res.code
      }
    })
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
        console.log(res)
        wx.request({
          method: 'post',
          url: 'http://127.0.0.1:3000/api/getWechat',
          data: {
            js_code: code
          },
          success: function(res) {
            console.log('session_key&openid:', res)
          },
          fail: function(err) {
            console.log(err)
          }
        })
        wx.request({
          method: 'post',
          url: 'http://127.0.0.1:3000/api/getToken',
          success: function (res) {
            console.log('token:', res)
          },
          fail: function (err) {
            console.log(err)
          }
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  }
})