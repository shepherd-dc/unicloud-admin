import Layout from '@/layout/index'
export default [
	{
		path: '/vaccine',
		component: Layout,
		name: '/vaccine/index',
		redirect: '/vaccine/index',
		meta: {
			title: '疫苗管理',
			icon: 'md-outlet'
		},
		children: [{
			path: 'vaccines',
			name: 'vaccine/vaccines',
			meta: {
				access: ['user'],
				title: '疫苗管理',
				icon: 'ios-happy'
			},
			component: () => import('@/views/vaccine/vaccines')
		}, {
			path: 'index',
			name: 'vaccine/index',
			meta: {
				access: ['user'],
				title: '月龄疫苗',
				icon: 'md-done-all'
			},
			component: () => import('@/views/vaccine/index')
		}, {
			path: 'detail',
			name: 'vaccine/detail',
			meta: {
				access: ['user'],
				title: '疫苗详情',
				hideInMenu: true,
				icon: 'ios-book'
			},
			component: () => import('@/views/vaccine/detail')
		}]
	}
]
