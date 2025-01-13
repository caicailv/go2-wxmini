import { onShareAppMessage,onShareTimeline } from '@dcloudio/uni-app';

const onShare = () => {
	onShareAppMessage(() => {
		return {
			title:'AI帮找～',
			path:'/pages/index/index'
		}
	})

	onShareTimeline(() => {
		return {
			title:'AI帮找～',
			path:'/pages/index/index'
		}
	});

	return {onShareAppMessage,onShareTimeline}
}


export default onShare;
