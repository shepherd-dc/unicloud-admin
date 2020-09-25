<script>
	export default {
		onLaunch: function() {
			console.log('App Launch')
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		}
	}
</script>

<style>
	/*每个页面公共css */
	.ivu-input-type-textarea .ivu-input {
		resize: none;
		font-family: 'MicroSoft YaHei';
	}
	.ivu-input-type-textarea .ivu-input-word-count {
		bottom: 6px;
	}
	.ivu-upload .ivu-upload-input {
	  display: none;
	}
</style>
