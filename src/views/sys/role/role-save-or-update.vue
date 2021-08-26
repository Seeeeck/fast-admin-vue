<template>
  <el-dialog
    :title="!dataForm.id ? 'Add' : 'Update'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    @close="hanleClose"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="100px"
    >
      <el-form-item
        label="Role name"
        prop="roleName"
      >
        <el-input
          v-model="dataForm.roleName"
          placeholder="Role name"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Remark"
        prop="remark"
      >
        <el-input
          v-model="dataForm.remark"
          placeholder="Remark"
        ></el-input>
      </el-form-item>
      <el-form-item
        size="mini"
        label="permission"
      >
        <el-tree
          :data="menuList"
          :props="menuListTreeProps"
          node-key="id"
          ref="menuListTree"
          :default-expand-all="true"
          show-checkbox
        >
        </el-tree>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">Cancel</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >Ok</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listMenusTree } from "@/api/sys/menu";
import { getRoleMenuVO, saveRole, updateRole } from "@/api/sys/role";
export default {
  data() {
    return {
      visible: false,
      menuList: [],
      menuListTreeProps: {
        label: "name",
        children: "children",
      },
      dataForm: {
        id: 0,
        roleName: "",
        remark: "",
      },
      dataRule: {
        roleName: [
          {
            required: true,
            message: "Role name cannot be empty",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    hanleClose() {
      this.$refs["dataForm"].resetFields();
      this.$refs.menuListTree.setCheckedKeys([]);
    },
    filterLeafNodes(menuIdList, parentIds) {
      return menuIdList.filter((item) => {
        return !parentIds.includes(item);
      });
    },
    getParentIds(arr, parentIds) {
      arr.forEach((item) => {
        if (item.children && item.children.length > 0) {
          parentIds.push(item.id);
          this.getParentIds(item.children, parentIds);
        }
      });
    },
    init(id) {
      this.dataForm.id = id || 0;
      this.visible = true;
      listMenusTree({ op: "less" }).then((response) => {
        this.menuList = response.data;
        this.menuList.filter((item) => {
          if (!item.children || item.children.length === 0) {
            item.disabled = true;
          }
          return true;
        });
        if (this.dataForm.id) {
          let parentIds = [];
          this.getParentIds(this.menuList, parentIds);
          getRoleMenuVO(this.dataForm.id).then((response) => {
            this.dataForm.id = response.data.id;
            this.dataForm.remark = response.data.remark;
            this.dataForm.roleName = response.data.roleName;
            this.$refs.menuListTree.setCheckedKeys(
              this.filterLeafNodes(response.data.menuIdList, parentIds)
            );
          });
        }
      });
    },

    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let role = {
            id: this.dataForm.id || undefined,
            roleName: this.dataForm.roleName,
            remark: this.dataForm.remark,
            menuIdList: [].concat(
              this.$refs.menuListTree.getCheckedKeys(),
              this.$refs.menuListTree.getHalfCheckedKeys()
            ),
          };
          if (!this.dataForm.id) {
            saveRole(role)
              .then((response) => {
                this.$message({
                  message: "Success",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  },
                });
              })
              .catch((error) => {});
          } else {
            updateRole(role)
              .then((response) => {
                this.$message({
                  message: "Success",
                  type: "success",
                  duration: 1000,
                  onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  },
                });
              })
              .catch((error) => {});
          }
        }
      });
    },
  },
};
</script>
