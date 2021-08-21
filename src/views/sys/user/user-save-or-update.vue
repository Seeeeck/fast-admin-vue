<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-form-item
        label="用户名"
        prop="username"
      >
        <el-input
          v-model="dataForm.username"
          placeholder="登录帐号"
          :disabled="dataForm.id"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="密码"
        prop="password"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="确认密码"
        prop="comfirmPassword"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.comfirmPassword"
          type="password"
          placeholder="确认密码"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="邮箱"
        prop="email"
      >
        <el-input
          v-model="dataForm.email"
          placeholder="邮箱"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="手机号"
        prop="mobile"
      >
        <el-input
          v-model="dataForm.mobile"
          placeholder="手机号"
        ></el-input>
      </el-form-item>
      <el-form-item
        label="角色"
        size="mini"
        prop="roleIdList"
      >
        <el-checkbox-group v-model="dataForm.roleIdList">
          <el-checkbox
            v-for="role in roleList"
            :key="role.id"
            :label="role.id"
          >{{ role.remark }}</el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item
        label="状态"
        size="mini"
        prop="enable"
      >
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">禁用</el-radio>
          <el-radio :label="true">正常</el-radio>
        </el-radio-group>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="visible = false">取消</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from "@/utils/validate";
import { listRoles } from "@/api/sys/role";
import { getUserRoleVO, saveUser, updateUser } from "@/api/sys/user";
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("密码不能为空"));
      } else {
        callback();
      }
    };
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error("确认密码不能为空"));
      } else if (this.dataForm.password !== value) {
        callback(new Error("确认密码与密码输入不一致"));
      } else {
        callback();
      }
    };
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式错误"));
      } else {
        callback();
      }
    };
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error("手机号格式错误"));
      } else {
        callback();
      }
    };
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        username: "",
        password: "",
        comfirmPassword: "",
        email: "",
        mobile: "",
        roleIdList: [],
        enable: true,
      },
      dataRule: {
        username: [
          { required: true, message: "用户名不能为空", trigger: "blur" },
        ],
        password: [{ validator: validatePassword, trigger: "blur" }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: "blur" },
        ],
        email: [
          { required: true, message: "邮箱不能为空", trigger: "blur" },
          { validator: validateEmail, trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "手机号不能为空", trigger: "blur" },
          { validator: validateMobile, trigger: "blur" },
        ],
      },
    };
  },
  methods: {
    init(id) {
      this.resetForm();
      this.dataForm.id = id || 0;
      listRoles().then((response) => {
        this.roleList = response.data;
      });
      if (this.dataForm.id) {
        getUserRoleVO(this.dataForm.id).then((response) => {
          this.dataForm.username = response.data.username;
          this.dataForm.email = response.data.email;
          this.dataForm.mobile = response.data.mobile;
          this.dataForm.roleIdList = response.data.roleIdList;
          this.dataForm.enable = response.data.enable;
        });
      }
      this.visible = true;
    },
    resetForm() {
        this.dataForm = {
        id: 0,
        username: "",
        password: "",
        comfirmPassword: "",
        email: "",
        mobile: "",
        roleIdList: [],
        enable: true,
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          let user = {
            id: this.dataForm.id || undefined,
            username: this.dataForm.username,
            password: this.dataForm.password || undefined,
            email: this.dataForm.email,
            mobile: this.dataForm.mobile,
            enable: this.dataForm.enable,
            roleIdList: this.dataForm.roleIdList,
          };
          if (!this.dataForm.id) {
            saveUser(user)
              .then((response) => {
                this.$message({
                  message: "Success",
                  type: "success",
                  duration: 1500,
                  onClose: () => {
                    this.visible = false;
                    this.$emit("refreshDataList");
                  },
                });
              })
              .catch((error) => {});
          } else {
            updateUser(user)
              .then((response) => {
                this.$message({
                  message: "Success",
                  type: "success",
                  duration: 1500,
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
