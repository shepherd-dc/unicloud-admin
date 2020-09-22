import { Message } from 'view-design'

async function chooseImage () {
	try {
		const res = await uni.chooseImage({
			count: 1
		})
		return res[1]
	} catch (e) {
		console.error(e) // eslint-disable-line
		Message.error({
			background: true,
			content: e.message || '选择图片出错',
		})
	}
}

export default {
	data () {
		return {
			percent: 0,
			showProgress: false
		}
	},
	methods: {
		async uploadImage () {
			let result = {}
			// 选择图片
			const res = await chooseImage()
			if (res.tempFilePaths.length > 0) {
				const tempFilePath = res.tempFilePaths[0]
				const tempFile = res.tempFiles[0].name
				// 进行上传操作
				try {
					const file = await uniCloud.uploadFile({
						filePath: tempFilePath,
						cloudPath: tempFile,
						onUploadProgress: (progressEvent) => {
							this.showProgress = true
							const percentCompleted = Math.round(
								(progressEvent.loaded * 100) / progressEvent.total
							)
							this.percent = percentCompleted
						}
					})
					this.showProgress = false
					result = file
				} catch (e) {
					console.error(e) // eslint-disable-line
					Message.error({
						background: true,
						content: e.message || '上传失败',
					})
				}
			}
			return result
		}
	}
}
