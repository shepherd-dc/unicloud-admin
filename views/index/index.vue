<template>
  <div class="page">
    <Button
      type="default"
      @click="query">普通查询</Button>
    <Button
      type="default"
      @click="lodaPage">分页查询</Button>
    <Button
      type="default"
      @click="loginQuery">授权查询</Button>
    <Button
      type="default"
      @click="add">新增数据</Button>
    <br>
    <Button
      type="default"
      @click="queryMenus">查询栏目</Button>
    <Button
      type="default"
      @click="addMenu">新增栏目</Button>
		<Button
		  type="default"
		  @click="querySubmenus">查询子栏目</Button>
		<Button
		  type="default"
		  @click="addSubmenu">新增子栏目</Button>
		<Button
			type="default"
			@click="querySupmenus">查询根栏目</Button>
		<Button
			type="default"
			@click="addSupmenu">新增根栏目</Button>
		<br>
  </div>
</template>
<script>
import { uniClientDB, db, dbCmd } from '@/utils/request'
export default {
  methods: {
    async query () {
      const res = await uniClientDB({
        command: db.collection('list').where({
          name: new RegExp('龚', 'g'),
          time: dbCmd.gt(1105885393581)
        }).field({
          extra: false
        }).get()
      })
      console.log(res)
      uni.showModal({
        content: JSON.stringify(res.data),
        showCancel: false
      })
    },
    async lodaPage () {
      const res = await uniClientDB({
        command: db.collection('list').where({
          _id: dbCmd.exists(true)
        }).field({
          extra: false
        }),
        pagination: {
          pageSize: 5,
          current: 1
        }
      })
      console.log(res)
      uni.showModal({
        content: JSON.stringify(res.list),
        showCancel: false
      })
    },
    async loginQuery () {
      const res = await uniClientDB({
        name: 'authorized',
        command: db.collection('todo').get()
      })
      console.log(res)
      uni.showModal({
        content: JSON.stringify(res.data),
        showCancel: false
      })
    },
    async add () {
      const res = await uniClientDB({
        name: 'authorized',
        command: db.collection('todo').add({
          title: 'Test'
        })
      })
      console.log(res)
      uni.showToast({
        icon: 'none',
        title: '新增成功!' + '\n' + res.id
      })
    },
    async queryMenus () {
		  const res = await uniClientDB({
		    name: 'menus',
		    command: db.collection('menus').get()
		  })
		  console.log(res)
		  uni.showModal({
		    content: JSON.stringify(res.data),
		    showCancel: false
		  })
    },
    async addMenu () {
		  const res = await uniClientDB({
		    name: 'menus',
		    command: db.collection('menus').add({
		      name: 'Test'
		    })
		  })
		  console.log(res)
		  uni.showModal({
		    content: '新增成功!' + '\n' + JSON.stringify(res.id),
		    showCancel: false
		  })
    },
		async querySubmenus () {
		  const res = await uniClientDB({
		    name: 'menus',
		    command: db.collection('submenus').get()
		  })
		  console.log(res)
		  uni.showModal({
		    content: JSON.stringify(res.data),
		    showCancel: false
		  })
		},
		async addSubmenu () {
		  const res = await uniClientDB({
		    name: 'menus',
		    command: db.collection('submenus').add({
		      name: 'Test'
		    })
		  })
		  console.log(res)
		  uni.showModal({
		    content: '新增成功!' + '\n' + JSON.stringify(res.id),
		    showCancel: false
		  })
		},
		async querySupmenus () {
		  const res = await uniClientDB({
		    name: 'menus',
		    command: db.collection('supmenus').get()
		  })
		  console.log(res)
		  uni.showModal({
		    content: JSON.stringify(res.data),
		    showCancel: false
		  })
		},
		async addSupmenu () {
		  const res = await uniClientDB({
		    name: 'menus',
		    command: db.collection('supmenus').add({
		      name: 'Test'
		    })
		  })
		  console.log(res)
		  uni.showModal({
		    content: '新增成功!' + '\n' + JSON.stringify(res.id),
		    showCancel: false
		  })
		}
  }
}
</script>
<style>
.page {
	background-image: url(../../assets/images/sy.jpg);
	background-size: 100%;
	width: 100%;
	height: 100%;
	overflow: hidden;
	margin: 0;
	padding: 0;
}
</style>
