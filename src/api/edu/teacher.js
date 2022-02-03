import request from '@/utils/request'


export default {
	//1 讲师列表(条件查询分页)
	//current当前页 limit每页记录数 teacherQuery条件对象
	getTeacherListPage(current, limit, teacherQuery) {
		return request({
			// url: '/eduService/teacher/pageTeacherCondition/'+current+"/"+limit,
			url: `/eduService/teacher/pageTeacherCondition/${current}/${limit}`,
			method: 'post',
			//teaccherQuery条件对象,后端使用RequestBody获取数据
			//data表示把对象转换json进行传递到接口里面
			data: teacherQuery
		})
	},
	//通过id逻辑删除讲师
	deleteTeacherId(id) {
		return request({
			url: `/eduService/teacher/${id}`,
			method: 'delete'
			//只有一个参数id(?)
		})
	},
	//添加讲师
	addTeacher(teacher){
		return request({
			url:`/eduService/teacher/addTeacher`,
			method:`post`,
			data:teacher
		})
	},
	//根据id讲师信息回显
	getTeacherInfo(id){
		return request({
			url:`/eduService/teacher/getTeacher/${id}`,
			method:`get`,
		})
	},
	//修改讲师
	updateTeacherInfo(teacher){
		return request({
			url:`/eduService/teacher/updateTeacher`,
			method:'post',
			data:teacher
		})
	},
	//获取所有讲师列表
	findAllTeacher(){
		return request({
			url:`/eduService/teacher/findAll`,
			method:'get'
		})
	}
}
