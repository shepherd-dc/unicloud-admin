<template>
	<div class="upload-image">
		<div class="icon-box">
			<Button
				icon="ios-cloud-upload-outline"
				@click="handleUpload">上传图标</Button>
			<div
				v-show="value"
				class="icon-image">
				<img :src="value" />
			</div>
		</div>
		<Progress
			v-show="showProgress"
			:percent="percent"/>
	</div>
</template>

<script>
import uploadImage from '@/mixins/upload'
export default {
	mixins: [uploadImage],
	props: {
		value: {
			type: String,
			default: ''
		}
	},
	methods: {
		async handleUpload () {
			const result = await this.uploadImage()
			this.$emit('input', result.fileID)
		}
	}
}
</script>

<style lang="less" scoped>
	.icon-box {
		display: flex;
		align-items: center;
	}
	.icon-image {
		margin-left: 20px;
		overflow: hidden;
		width: 40px;
		height: 40px;
		border-radius: 4px;
		img {
			height: 100%;
		}
	}
</style>
