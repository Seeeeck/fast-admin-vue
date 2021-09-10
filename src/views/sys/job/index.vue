<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.beanName"
          placeholder="Bean name"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">Search</el-button>
        <el-button
          v-if="auth.create"
          type="primary"
          @click="addOrUpdateHandle()"
        >Add</el-button>
        <el-button
          v-if="auth.delete"
          type="danger"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()"
        >Batch delete</el-button>
        <el-button
          v-if="auth.run"
          type="info"
          :disabled="dataListSelections.length <= 0"
          @click="runHandle()"
        >Batch run</el-button>
        <el-button
          v-if="auth.pause"
          type="info"
          :disabled="dataListSelections.length <= 0"
          @click="pauseHandle()"
        >Batch pause</el-button>
        <el-button
          v-if="auth.resume"
          type="info"
          :disabled="dataListSelections.length <= 0"
          @click="resumeHandle()"
        >Batch resume</el-button>
        <el-button
          v-if="auth.log"
          type="success"
          @click="logHandle()"
        >Job log</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
      @selection-change="selectionChangeHandle"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      />
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID"
      />
      <el-table-column
        prop="beanName"
        header-align="center"
        align="center"
        label="Bean name"
      />
      <el-table-column
        show-overflow-tooltip
        prop="params"
        header-align="center"
        align="center"
        label="Params"
      />
      <el-table-column
        prop="cronExpression"
        header-align="center"
        align="center"
        label="Cron expression"
      />
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="Status"
      >
        <template #default="scope">
          <el-switch
            v-if="auth.pause && auth.resume"
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange($event,scope.row.id)"
          />
          <el-tag
            v-else
            :type="scope.row.status===0?'success':'info'"
          >{{ scope.row.status===0?'Alive':'Pause' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="Remark"
      />
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        header-align="center"
        align="center"
        label="Create time"
      />
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        label="Operation"
      >
        <template #default="scope">
          <el-button
            v-if="auth.run"
            type="text"
            size="small"
            @click="runHandle(scope.row.id)"
          >Run</el-button>
          <el-button
            v-if="auth.update"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
          >Update</el-button>
          <el-button
            v-if="auth.delete"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
    />
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
    <job-log
      v-if="jobLogVisible"
      ref="jobLog"
    />
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import AddOrUpdate from './job-save-or-update'
import JobLog from './job-log'
import {
  pageScheduleJobs,
  deleteScheduleJobs,
  runScheduleJobs,
  pauseScheduleJobs,
  resumeScheduleJobs
} from '@/api/sys/job'
export default {
  components: {
    AddOrUpdate,
    JobLog
  },
  data() {
    return {
      dataForm: {
        beanName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      jobLogVisible: false,
      auth: {
        read: this.isAuth('sys:schedule:page'),
        create: this.isAuth('sys:schedule:save'),
        update: this.isAuth('sys:schedule:update'),
        delete: this.isAuth('sys:schedule:delete'),
        run: this.isAuth('sys:schedule:run'),
        pause: this.isAuth('sys:schedule:pause'),
        resume: this.isAuth('sys:schedule:resume'),
        log: this.isAuth('sys:schedule:log')
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      if (this.auth.read) {
        this.dataListLoading = true
        pageScheduleJobs({
          page: this.pageIndex,
          size: this.pageSize,
          beanName: this.dataForm.beanName
        })
          .then((response) => {
            this.dataList = response.data.list
            this.totalPage = response.data.totalCount
            this.dataListLoading = false
          })
          .catch(() => {
            this.dataList = []
            this.totalPage = 0
            this.dataListLoading = false
          })
      } else {
        this.$message.error(
          "You don't have required permission to perform this action."
        )
      }
    },
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // Current page
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // Multiple select
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // Save / Update
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // Delete
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(`Do you want to delete [id=${ids.join(',')}]?`, 'Delete', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          deleteScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: 'Success',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                }
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    isAuth,
    runHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(`Do you want to run [id=${ids.join(',')}]?`, 'Run', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          runScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: 'Success',
                type: 'success',
                duration: 1000
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    pauseHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(`Do you want to pause [id=${ids.join(',')}]?`, 'Pause', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          pauseScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: 'Success',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                }
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    resumeHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(`Do you want to resume [id=${ids.join(',')}]?`, 'Resume', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          resumeScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: 'Success',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.getDataList()
                }
              })
            })
            .catch(() => {})
        })
        .catch(() => {})
    },
    handleStatusChange(val, id) {
      if (val === 0) {
        resumeScheduleJobs(id)
          .then(() => {
            this.$message({
              message: 'Success',
              type: 'success',
              duration: 1000
            })
          })
          .catch(() => {
            this.getDataList()
          })
      } else {
        pauseScheduleJobs(id)
          .then(() => {
            this.$message({
              message: 'Success',
              type: 'success',
              duration: 1000
            })
          })
          .catch(() => {
            this.getDataList()
          })
      }
    },
    logHandle() {
      this.jobLogVisible = true
      this.$nextTick(() => {
        this.$refs.jobLog.init()
      })
    }
  }
}
</script>
