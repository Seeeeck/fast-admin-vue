<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
    >
      <el-form-item>
        <el-button
          v-if="isAuth('sys:menu:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >新增</el-button>
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
        label="名称"
      >
      </el-table-column>
      <el-table-column
        prop="parentName"
        header-align="center"
        align="center"
        width="120"
        label="上级菜单"
      >
      </el-table-column>
      <el-table-column
        header-align="center"
        align="center"
        width="60"
        label="图标"
      >
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icon || ''" />
        </template>
      </el-table-column>
      <el-table-column
        prop="type"
        header-align="center"
        width="80"
        align="center"
        label="类型"
      >
        <template slot-scope="scope">
          <el-tag
            v-if="scope.row.type === 0"
            size="small"
          >目录</el-tag>
          <el-tag
            v-else-if="scope.row.type === 1"
            size="small"
            type="success"
          >菜单</el-tag>
          <el-tag
            v-else-if="scope.row.type === 2"
            size="small"
            type="info"
          >按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="orderNum"
        header-align="center"
        width="80"
        align="center"
        label="排序号"
      >
      </el-table-column>
      <el-table-column
        prop="path"
        header-align="center"
        align="center"
        width="150"
        show-overflow-tooltip
        label="菜单Path"
      >
      </el-table-column>
      <el-table-column
        prop="perms"
        header-align="center"
        align="center"
        min-width="150"
        show-overflow-tooltip
        label="授权标识"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作"
      >
        <template slot-scope="scope">
          <el-button
            v-if="isAuth('sys:menu:update')"
            type="text"
            size="small"
            @click="addOrUpdateHandle(scope.row.id)"
          >修改</el-button>
          <el-button
            v-if="isAuth('sys:menu:delete') && !(scope.row.children && scope.row.children.length > 0)"
            type="text"
            size="small"
            @click="deleteHandle(scope.row.id)"
          >删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
  </div>
</template>

<script>
import { isAuth } from "@/utils/auth";
import AddOrUpdate from "./menu-save-or-update";
import { listMenusTree, deleteMenu } from "@/api/sys/menu";
export default {
  data() {
    return {
      dataForm: {},
      dataList: [],
      dataListLoading: false,
      addOrUpdateVisible: false,
    };
  },
  components: {
    AddOrUpdate,
  },
  created() {
    this.getDataList();
  },
  methods: {
    // 获取数据列表
    getDataList() {
      this.dataListLoading = true;
      listMenusTree({op:"all"})
        .then((response) => {
          this.dataList = response.data;
          this.dataListLoading = false;
        })
        .catch(() => (this.dataListLoading = false));
    },
    // 新增 / 修改
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // 删除
    deleteHandle(id) {
      this.$confirm(`Do you want to delete [id=${id}]?`, "Delete", {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      })
        .then(() => {
          deleteMenu(id)
            .then((response) => {
              this.$message({
                message: "Sucess.",
                type: "success",
                duration: 1500,
                onClose: () => {
                  this.getDataList();
                },
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    isAuth,
  },
};
</script>
