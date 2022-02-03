<template>
  <div class="app-container">
    <h2 style="text-align: center;">{{ title }}</h2>
    <el-steps :active="2" process-status="wait" align-center style="margin-bottom: 40px;">
      <el-step title="填写课程基本信息" />
      <el-step title="创建课程大纲" />
      <el-step title="最终发布" />
    </el-steps>
    <el-button type="text" @click="openChapterDialog()">添加章节</el-button>
    <!-- 章节 -->
    <ul class="chanpterList">
      <li v-for="chapter in chapterVideoList" :key="chapter.id">
        <p>
          {{ chapter.title }}
          <span class="acts">
            <el-button type="text" @click="openVideo(chapter.id)">添加课时</el-button>
            <el-button style="" type="text" @click="openEditChapter(chapter.id)">编辑</el-button>
            <el-button type="text" @click="removeChapter(chapter.id)">删除</el-button>
          </span>
        </p>
        <!-- 视频 -->
        <ul class="chanpterList videoList">
          <li v-for="video in chapter.children" :key="video.id">
            <p>{{ video.title }}
              <span class="acts">
                <el-button type="text" @click="openEditVideo(video.id)">编辑</el-button>
                <el-button type="text" @click="deleteVideo(video.id)">删除</el-button>
              </span>
            </p>
          </li>
        </ul>
      </li>
    </ul>
    <!-- 添加和修改章节表单 -->
    <el-dialog :visible.sync="dialogChapterFormVisible" :title="dialogTitle">
      <el-form :model="chapter" label-width="120px">
        <el-form-item label="章节标题">
          <el-input v-model="chapter.title" />
        </el-form-item>
        <el-form-item label="章节排序">
          <el-input-number v-model="chapter.sort" :min="0" controls-position="right" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogChapterFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveOrUpdate">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加和修改课时表单 -->
    <el-dialog :visible.sync="dialogVideoFormVisible" :title="dialogTitle">
      <el-form :model="video" label-width="120px">
        <el-form-item label="课时标题">
          <el-input v-model="video.title" />
        </el-form-item>
        <el-form-item label="课时排序">
          <el-input-number v-model="video.sort" :min="0" controls-position="right" />
        </el-form-item>
        <el-form-item label="是否免费">
          <el-radio-group v-model="video.free">
            <el-radio :label="1">免费</el-radio>
            <el-radio :label="0">收费</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="上传视频">
          <el-upload
            :on-success="handleVodUploadSuccess"
            :on-remove="handleVodRemove"
            :before-remove="beforeVodRemove"
            :on-exceed="handleUploadExceed"
            :file-list="fileList"
            :action="BASE_API+'/eduVod/video/uploadAlyVideo'"
            :limit="1"
            class="upload-demo">
            <el-button size="small" type="primarys">上传视频</el-button>
            <el-tooltip placement="right-end">
              <div slot="content">最大支持1G，<br>
                支持3GP、ASF、AVI、DAT、DV、FLV、F4V、<br>
                GIF、M2T、M4V、MJ2、MJPEG、MKV、MOV、MP4、<br>
                MPE、MPG、MPEG、MTS、OGG、QT、RM、RMVB、<br>
                SWF、TS、VOB、WMV、WEBM 等视频格式上传</div>
              <i class="el-icon-question" />
            </el-tooltip>
          </el-upload>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogVideoFormVisible = false">取 消</el-button>
        <el-button :disabled="saveVideoBtnDisabled" type="primary" @click="saveOrUpdateVideo()">确 定</el-button>
      </div>
    </el-dialog>
    <div>
      <el-button @click="previous">上一步</el-button>
      <el-button :disabled="saveBtnDisabled" type="primary" @click="next">下一步</el-button>
    </div>
  </div>
</template>
<script>
import chapter from '@/api/edu/chapter.js'
import video from '@/api/edu/video.js'
export default {
  data() {
    return {
      title: '', // 标题
      dialogTitle: '', // 弹窗标题
      saveBtnDisabled: false, // 保存按钮是否禁用
      saveVideoBtnDisabled: false, // 课时按钮是否禁用
      chapterVideoList: [],
      courseId: '', // 课程id
      chapter: {
        title: '',
        sort: 0
      },
      video: { // 课时对象
        title: '',
        sort: 0,
        isFree: 0,
        videoSourceId: '',
        videoOriginalName: ''
      },
      dialogChapterFormVisible: false, // 章节弹框
      dialogVideoFormVisible: false, // 小节弹框
      fileList: [], // 上传文件列表
      BASE_API: process.env.BASE_API // 接口API地址

    }
  },
  created() {
    // 获取路由的id值
    if (this.$route.params && this.$route.params.id) {
      this.courseId = this.$route.params.id
      this.title = '编辑课程'
    } else {
      this.title = '发布新课程'
    }
    // 根据课程id查询章节和小节
    this.getChapterVideo()
  },
  methods: {
    // ===========================小节操作============================
    // 删除小节
    deleteVideo(id) {
      this.$confirm('此操作将永久删除小节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确定,执行then方法
        video.deleteVideo(id)
          .then(response => { // 删除成功
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除小节成功!'
            })
            // 刷新列表
            this.getChapterVideo()
          })
      })
    },
    // 编辑小节数据回显
    openEditVideo(id) {
      // 修改title文字
      this.dialogTitle = '修改课时'
      // 弹框
      this.dialogVideoFormVisible = true
      video.getVideoInfo(id)
        .then(response => {
          this.video = response.data.video
        })
    },

    // 添加小节弹框方法
    openVideo(chapterId) {
      // 修改title文字
      this.dialogTitle = '添加课时'
      // 弹框
      this.dialogVideoFormVisible = true
      // 设置章节id
      this.video.chapterId = chapterId
      this.video.title = ''
      this.video.sort = 0
      this.video.isFree = 0
      this.video.videoSourceId = ''
    },
    saveOrUpdateVideo() {
      if (this.video.id) {
        this.updateVideo()
      } else {
        this.addVideo()
      }
    },
    // 添加小节
    addVideo() {
      // 设置课程id
      this.video.courseId = this.courseId
      video.addVideo(this.video)
        .then(response => {
          // 关闭弹窗
          this.dialogVideoFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '添加小节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },
    updateVideo() {
      video.updateVideo(this.video)
        .then(response => {
          // 关闭弹窗
          this.dialogVideoFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '修改小节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },
    // 上传视频成功调用方法
    handleVodUploadSuccess(response, file, fileList) {
      this.video.videoSourceId = response.data.videoId
      this.video.videoOriginalName = file.name
    },
    // 如果上传多于一个视频
    handleUploadExceed() {
      this.$message.warning('想要重新上传视频，请先删除已上传的视频')
    },
    // 点删除弹框的确认时候调用
    handleVodRemove() {
      // 调用接口删除视频方法
      video.deleteAlyVideo(this.video.videoSourceId)
        .then(response => {
          // 提示
          this.$message({
            type: 'success',
            message: '删除视频成功!'
          })
          // 把文件刘表清空
          this.fileList = []
          // 把video视频id和视频名称清空
          this.video.videoSourceId = ''
          this.video.videoOriginalName = ''
        })
    },
    // 点击×时调用的方法
    beforeVodRemove(file, fileList) {
      return this.$confirm(`确定移除${file.name}?`)
    },
    // ===========================章节操作============================
    // 根据课程id查询章节和小节的数据列表
    getChapterVideo() {
      chapter.getAllChapterVideo(this.courseId)
        .then(response => {
          this.chapterVideoList = response.data.allChapterVideo
          this.chapter.id = ''
          this.video.id = ''
          this.fileList = []
        })
    },
    // 上一步
    previous() {
      this.$router.push({
        path: '/course/info/' + this.courseId
      })
    },
    // 下一步
    next() {
      this.$router.push({
        path: '/course/publish/' + this.courseId
      })
    },
    saveOrUpdate() {
      if (this.chapter.id) {
        this.updateChapter()
      } else {
        this.addChapter()
      }
    },
    // 添加章节的方法
    addChapter() {
      // 设置课程id到chapter对象里面(保证非空)
      this.chapter.courseId = this.courseId
      chapter.addChapter(this.chapter)
        .then(response => {
          // 关闭弹窗
          this.dialogChapterFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '添加章节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },
    // 修改章节的方法
    updateChapter() {
      chapter.updateChapter(this.chapter)
        .then(response => {
          // 关闭弹窗
          this.dialogChapterFormVisible = false
          // 提示
          this.$message({
            type: 'success',
            message: '修改章节成功!'
          })
          // 刷新页面
          this.getChapterVideo()
        })
    },
    // 删除章节
    removeChapter(chapterId) {
      this.$confirm('此操作将永久删除章节, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确定,执行then方法
        chapter.deleteChapter(chapterId)
          .then(response => { // 删除成功
            // 提示信息
            this.$message({
              type: 'success',
              message: '删除成功!'
            })
            // 刷新列表
            this.getChapterVideo()
          })
      })
        .catch((response) => { // 失败
          if (response === 'cancel') {
            this.$message({
              type: 'info',
              message: '已取消删除'
            })
          } else {
            this.$message({
              type: 'error',
              message: '删除失败'
            })
          }
        })
    },
    // 弹出添加章节页面
    openChapterDialog() {
      // 修改title文字
      this.dialogTitle = '添加章节'
      // 弹窗
      this.dialogChapterFormVisible = true
      // 表单数据清空
      this.chapter.title = ''
      this.chapter.sort = 0
    },

    // 修改章节弹框数据回显
    openEditChapter(chapterId) {
      // 修改title文字
      this.dialogTitle = '修改章节'
      // 弹框
      this.dialogChapterFormVisible = true
      // 调用接口
      chapter.getChapter(chapterId)
        .then(response => {
          this.chapter = response.data.chapter
        })
    }

  }
}
</script>

<style scoped>
	.chanpterList {
		position: relative;
		list-style: none;
		margin: 0;
		padding: 0;
	}

	.chanpterList li {
		position: relative;
	}

	.chanpterList p {
		float: left;
		font-size: 20px;
		margin: 10px 0;
		padding: 10px;
		height: 70px;
		line-height: 50px;
		width: 100%;
		border: 1px solid #DDD;
	}

	.chanpterList .acts {
		float: right;
		font-size: 14px;
	}

	.videoList {
		padding-left: 50px;
	}

	.videoList p {
		float: left;
		font-size: 14px;
		margin: 10px 0;
		padding: 10px;
		height: 50px;
		line-height: 30px;
		width: 100%;
		border: 1px dotted #DDD;
	}
</style>
