import request from '@/utils/request'


export default {
	//添加小节
	addVideo(video) {
		return request({
			url: `/eduService/video/addVideo`,
			method: 'post',
			data: video
		})
	},
	//删除小节
	deleteVideo(videoId) {
		return request({
			url: `/eduService/video/${videoId}`,
			method: 'delete'
		})
	},
	//根据小节id查询
	getVideoInfo(videoId) {
		return request({
			url: `/eduService/video/getVideoInfo/${videoId}`,
			method: 'get'
		})
	},
	//修改小节
	updateVideo(video) {
		return request({
			url: `/eduService/video/updateVideo`,
			method: 'post',
			data: video
		})
	},
	//删除视频
	deleteAlyVideo(id) {
		return request({
			url: `/eduVod/video/removeAlyVideo/${id}`,
			method: 'delete',
		})
	},
}
