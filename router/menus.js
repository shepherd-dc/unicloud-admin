import Layout from '@/layout/index'
export default [
	{
		path: '/menus',
		component: Layout,
		name: '/menus/index',
		redirect: '/index',
		meta: {
			title: '栏目管理',
			icon: 'md-nuclear'
		},
		children: [{
			path: 'index',
			name: 'menus',
			meta: {
				access: ['roles'],
				title: '二级栏目管理',
				icon: 'ios-people'
			},
			component: () => import('@/views/menus/index')
		}, {
			path: 'supmenus',
			name: 'supmenus',
			meta: {
				access: ['roles'],
				title: '一级栏目管理',
				icon: 'ios-people'
			},
			component: () => import('@/views/menus/supmenus')
		}, {
			path: 'submenus',
			name: 'submenus',
			meta: {
				access: ['roles'],
				title: '三级栏目管理',
				icon: 'ios-aperture'
			},
			component: () => import('@/views/menus/submenus')
		}]
	}
]