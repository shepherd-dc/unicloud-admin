// const files = require.context('.', false, /\.js$/)
// const modules = []
// files.keys().forEach(key => {
//   if (key === './index.js') return
//   const item = files(key).default
//   modules.push(...item)
// })

// export default modules

import defaultRoutes from './routes'
import menus from './menus'
import articles from './articles'
import ages from './ages'
import vaccine from './vaccine'

export default [
	...menus,
	...articles,
	...ages,
	...vaccine,
	...defaultRoutes
]
