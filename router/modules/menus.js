import Layout from '@/layout/index'
export default [
	{
		path: '/menus',
		component: Layout,
		name: '/menus/index',
		redirect: '/menus/index',
		meta: {
			title: '栏目管理',
			icon: 'ios-apps'
		},
		children: [{
			path: 'supmenus',
			name: 'supmenus',
			meta: {
				access: ['roles'],
				title: '一级栏目管理',
				icon: 'ios-folder'
			},
			component: () => import('@/views/menus/supmenus')
		}, {
			path: 'index',
			name: 'menus',
			meta: {
				access: ['roles'],
				title: '二级栏目管理',
				icon: 'ios-browsers'
			},
			component: () => import('@/views/menus/index')
		}, {
			path: 'submenus',
			name: 'submenus',
			meta: {
				access: ['roles'],
				title: '三级栏目管理',
				icon: 'logo-buffer'
			},
			component: () => import('@/views/menus/submenus')
		}]
	}
]