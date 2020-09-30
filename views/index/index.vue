<template>
  <div class="page">
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
