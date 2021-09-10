<template>
  <el-dialog
    :title="!dataForm.id ? 'Add' : 'Update'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      ref="dataForm"
      :model="dataForm"
      :rules="dataRule"
      label-width="160px"
      @keyup.enter.native="dataFormSubmit()"
    >
      <el-form-item
        label="Username"
        prop="username"
      >
        <span v-if="dataForm.id !== 0" style="font-size:20px;padding-left:10px">{{ dataForm.username }}</span>
        <el-input
          v-else
          v-model="dataForm.username"
          placeholder="Username"
        />

      </el-form-item>
      <el-form-item
        label="Password"
        prop="password"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.password"
          type="password"
          placeholder="password"
        />
      </el-form-item>
      <el-form-item
        label="Comfirm password"
        prop="comfirmPassword"
        :class="{ 'is-required': !dataForm.id }"
      >
        <el-input
          v-model="dataForm.comfirmPassword"
          type="password"
          placeholder="Comfirm password"
        />
      </el-form-item>
      <el-form-item
        label="Email"
        prop="email"
      >
        <el-input
          v-model="dataForm.email"
          placeholder="Email"
        />
      </el-form-item>
      <el-form-item
        label="Phone number"
        prop="mobile"
      >
        <el-input
          v-model="dataForm.mobile"
          placeholder="Phone number"
        />
      </el-form-item>
      <el-form-item
        label="Role"
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
        label="State"
        size="mini"
        prop="enable"
      >
        <el-radio-group v-model="dataForm.enable">
          <el-radio :label="false">Disabled</el-radio>
          <el-radio :label="true">Available</el-radio>
        </el-radio-group>
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
import { isEmail, isMobile } from '@/utils/validate'
import { listRoles } from '@/api/sys/role'
import { getUserRoleVO, saveUser, updateUser } from '@/api/sys/user'
export default {
  data() {
    var validatePassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('Password cannot be empty.'))
      } else {
        callback()
      }
    }
    var validateComfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.id && !/\S/.test(value)) {
        callback(new Error('Password cannot be empty.'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('Confirm password is inconsistent with password'))
      } else {
        callback()
      }
    }
    var validateEmail = (rule, value, callback) => {
      if (!isEmail(value)) {
        callback(new Error('Email format error'))
      } else {
        callback()
      }
    }
    var validateMobile = (rule, value, callback) => {
      if (!isMobile(value)) {
        callback(new Error('Malformed phone number'))
      } else {
        callback()
      }
    }
    return {
      visible: false,
      roleList: [],
      dataForm: {
        id: 0,
        username: '',
        password: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        roleIdList: [],
        enable: true
      },
      dataRule: {
        username: [
          {
            required: true,
            message: 'Username cannot be empty',
            trigger: 'blur'
          }
        ],
        password: [{ validator: validatePassword, trigger: 'blur' }],
        comfirmPassword: [
          { validator: validateComfirmPassword, trigger: 'blur' }
        ],
        email: [
          { required: true, message: 'Email cannot be empty', trigger: 'blur' },
          { validator: validateEmail, trigger: 'blur' }
        ],
        mobile: [
          {
            required: true,
            message: 'Phone number cannot be empty',
            trigger: 'blur'
          },
          { validator: validateMobile, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id || 0
      listRoles().then((response) => {
        this.roleList = response.data
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.id) {
            getUserRoleVO(this.dataForm.id).then((response) => {
              this.dataForm.username = response.data.username
              this.dataForm.email = response.data.email
              this.dataForm.mobile = response.data.mobile
              this.dataForm.roleIdList = response.data.roleIdList || []
              this.dataForm.enable = response.data.enable
            })
          }
        })
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const user = {
            id: this.dataForm.id || undefined,
            username: this.dataForm.username,
            password: this.dataForm.password || undefined,
            email: this.dataForm.email,
            mobile: this.dataForm.mobile,
            enable: this.dataForm.enable,
            roleIds: this.dataForm.roleIdList
          }
          if (!this.dataForm.id) {
            saveUser(user)
              .then((response) => {
                this.$message({
                  message: 'Success',
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              })
              .catch(() => {})
          } else {
            updateUser(user)
              .then((response) => {
                this.$message({
                  message: 'Success',
                  type: 'success',
                  duration: 1000,
                  onClose: () => {
                    this.visible = false
                    this.$emit('refreshDataList')
                  }
                })
              })
              .catch(() => {})
          }
        }
      })
    }
  }
}
</script>
