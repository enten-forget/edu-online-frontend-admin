import request from '@/utils/request'

export default {
  // 1 生成统计数据
  createStatistics(day) {
    return request({
      url: `/staService/statistics/registerCount/${day}`,
      method: 'post'
    })
  },
  // 2 获取统计数据
  getDataSta(searchObj) {
    return request({
      url: `/staService/statistics/showData/${searchObj.type}/${searchObj.begin}/${searchObj.end}`,
      method: 'get'
    })
  }
}
