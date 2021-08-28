<template>
  <el-dialog
    :title="!dataForm.id ? 'Add' : 'Update'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="140px"
    >
      <el-form-item
        label="Type"
        prop="type"
      >
        <el-radio-group v-model="dataForm.type" :disabled="dataForm.id">
          <el-radio
            v-for="(type, index) in typeList"
            :label="index"
            :key="index"
          >{{ type }}</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item
        :label="typeList[dataForm.type] + ' name'"
        prop="name"
      >
        <el-input
          v-model="dataForm.name"
          :placeholder="typeList[dataForm.type] + ' name'"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Parent menu"
        prop="parentName"
      >
        <el-popover
          ref="menuListPopover"
          placement="bottom-start"
          trigger="click"
        >
          <el-tree
            :data="menuList"
            :props="menuListTreeProps"
            node-key="id"
            ref="menuListTree"
            @current-change="menuListTreeCurrentChangeHandle"
            :default-expand-all="true"
            :highlight-current="true"
            :expand-on-click-node="false"
          >
          </el-tree>
        </el-popover>
        <el-input
          v-model="dataForm.parentName"
          v-popover:menuListPopover
          :readonly="true"
          placeholder="Select the parent menu"
          class="menu-list__input"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="Menu path"
        prop="path"
      >
        <el-input
          v-model="dataForm.path"
          placeholder="Menu path"
        ></el-input>
      </el-form-item>
      <el-form-item
        v-if="dataForm.type === 2"
        label="Permission"
        prop="perms"
      >
        <el-input
          v-model="dataForm.perms"
          placeholder="Multiple separated by comma, E.g: sys:user:page,sys:user:save"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="Order number"
        prop="orderNum"
      >
        <el-input-number
          v-model="dataForm.orderNum"
          controls-position="right"
          :min="0"
          label="Order number"
        ></el-input-number>
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !==2"
        label="Whether to hidden"
      >
        <el-switch v-model="dataForm.hidden" />
      </el-form-item>
      <el-form-item
        v-if="dataForm.type !== 2"
        label="Menu icon"
        prop="icon"
      >
        <el-row>
          <el-col :span="22">
            <el-popover
              ref="iconListPopover"
              placement="bottom-start"
              trigger="click"
              popper-class="mod-menu__icon-popover"
            >
              <div class="mod-menu__icon-inner">
                <div class="mod-menu__icon-list">
                  <el-button
                    v-for="(item, index) in iconList"
                    :key="index"
                    @click="iconActiveHandle(item)"
                    :class="{ 'is-active': item === dataForm.icon }"
                  >
                    <svg-icon :icon-class="item" />
                  </el-button>
                </div>
              </div>
            </el-popover>
            <el-input
              v-model="dataForm.icon"
              v-popover:iconListPopover
              :readonly="true"
              placeholder="Menu icon"
              class="icon-list__input"
            ></el-input>
          </el-col>
          <el-col
            :span="2"
            class="icon-list__tips"
          >
            <el-tooltip
              placement="top"
              effect="light"
            >
              <div slot="content">Recommend using SVG files, please see <a
                  href="https://github.com/Seeeeck/fast-admin-vue/blob/master/README.md"
                  target="_blank"
                >fast-admin-vue</a> for details</div>
              <i class="el-icon-warning"></i>
            </el-tooltip>
          </el-col>
        </el-row>
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
import {
  listMenusTree,
  updateMenu,
  saveMenu,
  getMenu,
  getParentMenu,
} from "@/api/sys/menu";
export default {
  data() {
    var validatePath = (rule, value, callback) => {
      if (this.dataForm.type === 1 && !/\S/.test(value)) {
        callback(new Error("Menu path cannot be empty."));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      typeList: ["Catalog", "Menu", "Button"],
      dataForm: {
        id: 0,
        type: 1,
        name: "",
        parentId: 0,
        parentName: "",
        path: "",
        perms: "",
        orderNum: 0,
        icon: "",
        hidden: false,
      },
      iconList: [],
      dataRule: {
        name: [
          {
            required: true,
            message: "Menu name cannot be empty",
            trigger: "blur",
          },
        ],
        parentName: [
          {
            required: true,
            message: "Parent menu cannot be empty",
            trigger: "change",
          },
        ],
        path: [{ validator: validatePath, trigger: "blur" }],
      },
      menuList: [
        {
          id: 0,
          name: "Top menu",
          children: [],
        },
      ],
      menuListTreeProps: {
        label: "name",
        children: "children",
      },
    };
  },
  mounted() {
    this.iconList = require
      .context("@/icons/svg/", false, /.svg$/)
      .keys()
      .map((icon) => icon.substring(2, icon.length - 4));
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0;
      listMenusTree({ op: "less", noButtonType: true }).then((response) => {
        this.visible = true;
        this.menuList[0].children = response.data;
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields();
          if (this.dataForm.id) {
            getMenu(id).then((response) => {
              this.dataForm.id = response.data.id;
              this.dataForm.type = response.data.type;
              this.dataForm.name = response.data.name;
              this.dataForm.parentId = response.data.parentId;
              this.dataForm.path = response.data.path;
              this.dataForm.perms = response.data.perms;
              this.dataForm.orderNum = response.data.orderNum;
              this.dataForm.icon = response.data.icon;
              this.menuListTreeSetCurrentNode();
            });
          } else {
            this.menuListTreeSetCurrentNode();
          }
        });
      });
    },
    // 菜单树选中
    menuListTreeCurrentChangeHandle(data, node) {
      this.dataForm.parentId = data.id;
      this.dataForm.parentName = data.name;
      getParentMenu(data.id)
        .then((response) => {
          if (response.data && response.data.path) {
            this.dataForm.path = response.data.path;
          } else {
            this.dataForm.path = "";
          }
        })
        .catch(() => {});
    },
    // 菜单树设置当前选中节点
    menuListTreeSetCurrentNode() {
      this.$refs.menuListTree.setCurrentKey(this.dataForm.parentId);
      this.dataForm.parentName = (this.$refs.menuListTree.getCurrentNode() ||
        {})["name"];
    },
    // 图标选中
    iconActiveHandle(iconName) {
      this.dataForm.icon = iconName;
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let menu = {
            id: this.dataForm.id || undefined,
            type: this.dataForm.type,
            name: this.dataForm.name,
            parentId: this.dataForm.parentId,
            orderNum: this.dataForm.orderNum,
          };
          if (this.dataForm.type === 0 || this.dataForm.type === 1) {
            menu.icon = this.dataForm.icon;
            menu.hidden = this.dataForm.hidden;
            menu.path = this.dataForm.path;
          } else {
            menu.perms = this.dataForm.perms;
            menu.hidden = true;
          }
          if (!this.dataForm.id) {
            saveMenu(menu)
              .then(() => {
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
            updateMenu(menu)
              .then(() => {
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

<style lang="scss">
.mod-menu {
  .menu-list__input,
  .icon-list__input {
    > .el-input__inner {
      cursor: pointer;
    }
  }
  &__icon-popover {
    width: 458px;
    overflow: hidden;
  }
  &__icon-inner {
    width: 478px;
    max-height: 258px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &__icon-list {
    width: 458px;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
  .icon-list__tips {
    font-size: 18px;
    text-align: center;
    color: #e6a23c;
    cursor: pointer;
  }
}
</style>
