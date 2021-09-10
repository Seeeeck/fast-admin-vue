<template>
  <el-dialog
    title="Job logs"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="70%"
  >
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.jobId"
          placeholder="Job id"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">Search</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="dataListLoading"
      :data="dataList"
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID"
        width="80"
      />
      <el-table-column
        prop="jobId"
        header-align="center"
        align="center"
        label="Job id"
        width="80"
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
        label="params"
      />
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="Status"
      >
        <template #default="scope">
          <el-tag :type="scope.row.status===0?'success':'danger'">{{ scope.row.status===0?'Success':'Failure' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="error"
        header-align="center"
        align="center"
        label="Error message"
      />
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="Time(ms)"
        width="90"
      />
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        header-align="center"
        align="center"
        label="Create time"
      />
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
  </el-dialog>
</template>

<script>
import { pageScheduleJobLogs } from '@/api/sys/job'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        jobId: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.getDataList()
      })
    },
    getDataList() {
      this.dataListLoading = true
      pageScheduleJobLogs({
        page: this.pageIndex,
        size: this.pageSize,
        jobId: this.dataForm.jobId
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
    }
  }
}
</script>
