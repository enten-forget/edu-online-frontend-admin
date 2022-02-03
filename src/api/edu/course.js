import request from '@/utils/request'


export default {
	//1 添加课程信息功能
	//current当前页 limit每页记录数 teacherQuery条件对象
	addCourseInfo(courseInfo) {
		return request({
			url: `/eduService/course/addCourseInfo`,
			method: 'post',
			data: courseInfo
		})
	},
	//2 查询所有讲师
	getListTeacher() {
		return request({
			url: `/eduService/teacher/findAll`,
			method: 'get'
		})
	},
	//根据课程id查询课程基本信息
	getCourseInfo(id) {
		return request({
			url: `/eduService/course/getCourseInfo/${id}`,
			method: 'get'
		})
	},
	//修改课程信息
	updateCourseInfo(courseInfo) {
		return request({
			url: `/eduService/course/updateCourseInfo`,
			method: 'post',
			data: courseInfo
		})
	},
	//课程确认信息显示
	getPublishCourseInfo(id) {
		return request({
			url: `/eduService/course/getPublishCourseInfo/${id}`,
			method: 'get'
		})
	},
	//课程最终发布
	publishCourse(id) {
		return request({
			url: `/eduService/course/publishCourse/${id}`,
			method: 'post'
		})
	},
	//课程列表(分页查询)
	pageCourseList(current, limit) {
		return request({
			url: `/eduService/course/pageCourse/${current}/${limit}`,
			method: 'get'
		})
	},
	//课程全部列表
	getAllCourse() {
		return request({
			url: `/eduService/course/getAllCourse`,
			method: 'get'
		})
	},
	//课程列表(条件查询分页)
	getPageList(current, limit, courseQuery) {
		return request({
			url: `/eduService/course/pageCourseCondition/${current}/${limit}`,
			method: 'post',
			data: courseQuery
		})
	},
	//删除课程
	deleteCourse(courseId) {
		return request({
			url: `/eduService/course/${courseId}`,
			method: 'delete'
		})
	}
}
