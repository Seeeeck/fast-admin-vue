<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
    >
      <el-form-item>
        <el-button
          v-if="auth.create"
          type="primary"
          @click="addOrUpdateHandle()"
        >Add</el-button>
      </el-form-item>
    </el-form>

    <el-table
      :data="dataList"
      row-key="id"
      border
      style="width: 100%;"
    >
      <el-table-column
        prop="name"
        header-align="center"
        min-width="150"
        label="Name"
      />
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="Parent Menu"
      />
      <el-table-column
        header-align="center"
        align="center"
        width="60"
        label="Icon"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        width="100"
        align="center"
        label="Type"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.type === 0"
            size="small"
          >Catelog</el-tag>
          <el-tag
            v-else-if="scope.row.type === 1"
            size="small"
            type="success"
          >Menu</el-tag>
          <el-tag
            v-else-if="scope.row.type === 2"
            size="small"
            type="info"
          >Button</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        width="80"
        align="center"
        label="Order"
      />
      <el-table-column
        prop="path"
        header-align="center"
        align="center"
        width="150"
        show-overflow-tooltip
        label="Menu path"
      />
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        min-width="150"
        show-overflow-tooltip
        label="Permission"
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
            v-if="auth.delete && !(scope.row.children && scope.row.children.length > 0)"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    />
  </div>
</template>

<script>
import { isAuth } from '@/utils/auth'
import AddOrUpdate from './menu-save-or-update'
import { listMenusTree, deleteMenu } from '@/api/sys/menu'
export default {
  components: {
    AddOrUpdate
  },
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
      auth: {
        read: this.isAuth('sys:menu:tree'),
        create: this.isAuth('sys:menu:save'),
        update: this.isAuth('sys:menu:update'),
        delete: this.isAuth('sys:menu:delete')
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
        listMenusTree({ op: 'all' })
          .then((response) => {
            this.dataList = response.data
            this.dataListLoading = false
          })
          .catch(() => (this.dataListLoading = false))
      } else {
        this.$message.error(
          "You don't have required permission to perform this action."
        )
      }
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
      this.$confirm(`Do you want to delete [id=${id}]?`, 'Delete', {
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
        type: 'warning'
      })
        .then(() => {
          deleteMenu(id)
            .then((response) => {
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
