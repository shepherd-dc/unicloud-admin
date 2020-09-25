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

export default async function () {
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
					uni.showLoading()
					// const percentCompleted = Math.round(
					// 	(progressEvent.loaded * 100) / progressEvent.total
					// )
				}
			})
			result = file
		} catch (e) {
			console.error(e) // eslint-disable-line
			Message.error({
				background: true,
				content: e.message || '上传失败',
			})
		} finally {
			uni.hideLoading()
		}
	}
	return result
}
