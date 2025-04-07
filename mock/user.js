// const { search } = require('core-js/fn/symbol')
const Mock = require('mockjs')
// const { status } = require('nprogress')

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

const userlist = Mock.mock({
  'items|30': [{
    id: '@id',
    username: '@name',
    name: '@name',
    password: '@string(6, 10)',
    phone: '@string(11)',
    sex: '@integer(0, 1)',
    idNumber: '@string(18)',
    status: '@integer(0, 1)',
    createTime: '@datetime',
    updateTime: '@datetime',
    createUser: '1',
    updateUser: '1'
  }],
})

module.exports = [
  // user login
  {
    url: '/vue-admin-template/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-admin-template/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // user logout
  {
    url: '/vue-admin-template/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },

  // getuserList
  {
    url: '/vue-admin-template/user/page',
    type: 'get',
    response: config => {
      const { page, pageSize } = config.query

      const items = userlist.items
      return {
        code: 1,
        data: {
          records: items,
          total: items.length,
          size: pageSize,
          current: page,
          orders: [],
          optimizeCountSql: true,
          hitCount: false,
          countId: null,
          maxLimit: null,
          searchCount: true,
          pages: 3
        }
      }
    }
  },
]
