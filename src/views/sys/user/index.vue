<template>
  <div class="mod-user">
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.userName"
          placeholder="Username"
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
        width="80"
        label="ID"
      />
      <el-table-column
        show-overflow-tooltip
        prop="username"
        header-align="center"
        align="center"
        label="Username"
      />
      <el-table-column
        show-overflow-tooltip
        prop="email"
        header-align="center"
        align="center"
        label="Email"
      />
      <el-table-column
        show-overflow-tooltip
        prop="mobile"
        header-align="center"
        align="center"
        label="Phone number"
      />
      <el-table-column
        prop="enable"
        header-align="center"
        align="center"
        label="State"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.enable === false"
            size="small"
            type="danger"
          >Disabled</el-tag>
          <el-tag
            v-else
            size="small"
          >Available</el-tag>
        </template>
      </el-table-column>
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
        width="150"
        label="Operation"
      >
        <template slot-scope="scope">
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
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import AddOrUpdate from './user-save-or-update'
import { pageUsers, deleteUsers } from '@/api/sys/user'
export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {
        userName: ''
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      auth: {
        read: this.isAuth('sys:user:page'),
        create: this.isAuth('sys:user:save'),
        update: this.isAuth('sys:user:update'),
        delete: this.isAuth('sys:user:delete')
      }
    }
  },
  created() {
    this.getDataList()
  },
  methods: {
    // 获取数据列表
    getDataList() {
      if (this.auth.read) {
        this.dataListLoading = true
        pageUsers({
          page: this.pageIndex,
          size: this.pageSize,
          username: this.dataForm.userName
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
    // 每页数
    sizeChangeHandle(val) {
      this.pageSize = val
      this.pageIndex = 1
      this.getDataList()
    },
    // 当前页
    currentChangeHandle(val) {
      this.pageIndex = val
      this.getDataList()
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      var userIds = id
        ? [id]
        : this.dataListSelections.map((item) => {
          return item.id
        })
      this.$confirm(
        `Do you want to delete [id=${userIds.join(',')}]?`,
        'Delete',
        {
          confirmButtonText: 'Yes',
          cancelButtonText: 'No',
          type: 'warning'
        }
      )
        .then(() => {
          deleteUsers(userIds)
            .then((response) => {
              this.$message({
                message: 'Sucess.',
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
