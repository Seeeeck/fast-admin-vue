<template>
  <el-dialog
    title="Change profile"
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
        label="Avatar"
        prop="avatar"
      >
        <el-popover
          v-model="popoverVisible"
          placement="bottom"
          :width="400"
          trigger="click"
        >
          <div class="popover-content">
            <img
              v-for="(item,index) in avatars"
              :key="index"
              :src="item.img"
              class="popover-avatar"
              @click="handleAvatarSelected(item)"
            >
          </div>
          <template #reference>
            <img
              :src="dataForm.avatar.img"
              class="user-avatar"
              @click="popoverVisible = true"
            >
          </template>
        </el-popover>
      </el-form-item>
    </el-form>
    <span
      slot="footer"
      class="dialog-footer"
    >
      <el-button @click="handleCancel">Cancel</el-button>
      <el-button
        type="primary"
        @click="dataFormSubmit()"
      >Ok</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { isEmail, isMobile } from '@/utils/validate'
import { getUser, updateOwn } from '@/api/sys/user'
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
      popoverVisible: false,
      avatars: [],
      roleList: [],
      dataForm: {
        id: 0,
        password: '',
        comfirmPassword: '',
        email: '',
        mobile: '',
        avatar: {
          img: '',
          url: ''
        }
      },
      dataRule: {
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
        ],
        avatar: [
          {
            required: true,
            message: 'Avatar cannot be empty',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    handleCancel() {
      this.visible = false
      this.popoverVisible = false
    },
    handleAvatarSelected(filePath) {
      this.dataForm.avatar = filePath
      this.popoverVisible = false
    },
    init() {
      this.dataForm.id = this.$store.getters.user_id
      const imgs = require.context('@/assets/avatar/', false, /.(png|jpg|gif)$/)
      this.avatars = imgs.keys().map((key) => {
        return { url: '@/assets/avatar/' + key.substring(2), img: imgs(key) }
      })
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
        this.popoverVisible = false
        getUser(this.dataForm.id).then((response) => {
          this.dataForm.email = response.data.email
          this.dataForm.mobile = response.data.mobile
          this.dataForm.avatar = this.avatars.find(avatar => avatar.url === response.data.avatar)
        })
      })
    },
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const user = {
            id: this.dataForm.id,
            password: this.dataForm.password || undefined,
            email: this.dataForm.email,
            mobile: this.dataForm.mobile,
            avatar: this.dataForm.avatar.url
          }
          updateOwn(user)
            .then((response) => {
              this.$message({
                message: 'Success',
                type: 'success',
                duration: 1000,
                onClose: () => {
                  this.visible = false
                  this.$emit('resetAvatar')
                }
              })
            })
            .catch(() => {})
        }
      })
    }
  }
}
</script>
<style scoped>
.user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.popover-content {
  padding: 5px;
}
.popover-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  margin: 10px;
}
</style>
