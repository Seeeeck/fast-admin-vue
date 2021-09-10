<template>
  <div class="mod-config">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.username"
          placeholder="Username"
          clearable
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">Search</el-button>
        <el-button
          v-if="isAuth('sys:log:delete')"
          type="danger"
          :disabled="dataListSelections.length <= 0"
          @click="deleteHandle()"
        >Batch delete</el-button>
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
        width="100"
        prop="id"
        header-align="center"
        align="center"
        label="id"
      />
      <el-table-column
        prop="username"
        header-align="center"
        align="center"
        label="User"
      />
      <el-table-column
        prop="operation"
        header-align="center"
        align="center"
        label="Operation"
      />
      <el-table-column
        show-overflow-tooltip
        prop="method"
        header-align="center"
        align="center"
        label="Method"
      />
      <el-table-column
        show-overflow-tooltip
        prop="params"
        header-align="center"
        align="center"
        label="Params"
      />
      <el-table-column
        prop="time"
        header-align="center"
        align="center"
        label="Proccess time(ms)"
      />
      <el-table-column
        prop="ip"
        header-align="center"
        align="center"
        label="IP"
      />
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        header-align="center"
        align="center"
        label="Time"
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
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import { pageLogs, deleteLogs } from '@/api/sys/log'
export default {
  data() {
    return {
      dataForm: {
        username: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListSelections: [],
      dataListLoading: false
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    getDataList() {
      if (isAuth('sys:log:page')) {
        this.dataListLoading = true
        pageLogs({
          page: this.pageIndex,
          size: this.pageSize,
          username: this.dataForm.username
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
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    deleteHandle(id) {
      const ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(`Do you want to delete[id=${ids.join(',')}]?`, 'Delete', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          deleteLogs(ids)
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
    isAuth
  }
}
</script>
