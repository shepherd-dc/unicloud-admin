import Layout from '@/layout/index'
export default [
	{
		path: '/articles',
		component: Layout,
		name: 'articles',
		redirect: '/articles/index',
		meta: {
			title: '文章管理',
			icon: 'ios-paper'
		},
		children: [{
			path: 'index',
			name: '/articles/index',
			meta: {
				access: ['roles'],
				title: '文章列表',
				icon: 'ios-list-box'
			},
			component: () => import('@/views/articles/index')
		}, {
			path: 'edit',
			name: '/articles/edit',
			meta: {
				access: ['roles'],
				title: '发布文章',
				icon: 'ios-create'
			},
			component: () => import('@/views/articles/edit')
		}, {
			path: 'detail',
			name: '/articles/detail',
			meta: {
				access: ['roles'],
				title: '文章详情',
				icon: 'ios-book'
			},
			component: () => import('@/views/articles/detail')
		}]
	}
]