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
			path: 'ages',
			name: 'ages',
			meta: {
				access: ['user'],
				title: '月龄管理',
				icon: 'ios-happy'
			},
			component: () => import('@/views/vaccine/ages')
		}, {
			path: 'index',
			name: 'vaccine/index',
			meta: {
				access: ['user'],
				title: '疫苗管理',
				icon: 'md-done-all'
			},
			component: () => import('@/views/vaccine/index')
		}]
	}
]
