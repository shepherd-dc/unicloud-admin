import Layout from '@/layout/index'
export default [
	{
		path: '/ages',
		component: Layout,
		name: '/ages/index',
		redirect: '/ages/index',
		meta: {
			title: '月龄管理',
			icon: 'md-outlet'
		},
		children: [{
			path: 'index',
			name: 'ages',
			meta: {
				access: ['user'],
				title: '月龄管理',
				icon: 'ios-happy'
			},
			component: () => import('@/views/ages/index')
		}]
	}
]
