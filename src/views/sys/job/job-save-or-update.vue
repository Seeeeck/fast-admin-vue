<template>
  <el-dialog
    :title="!dataForm.id ? 'Add' : 'Update'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="150px">
    <el-form-item label="Bean name" prop="beanName">
      <el-input v-model="dataForm.beanName" placeholder="Bean name"></el-input>
    </el-form-item>
    <el-form-item label="Params" prop="params">
      <el-input v-model="dataForm.params" placeholder="Params"></el-input>
    </el-form-item>
    <el-form-item label="Cron expression" prop="cronExpression">
      <el-input v-model="dataForm.cronExpression" placeholder="Cron expression"></el-input>
    </el-form-item>
    <el-form-item label="Remark" prop="remark">
      <el-input v-model="dataForm.remark" placeholder="Remark"></el-input>
    </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">Cancel</el-button>
      <el-button type="primary" @click="dataFormSubmit()">OK</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getScheduleJob,saveScheduleJob,updateScheduleJob } from '@/api/sys/job'
export default {
  data () {
    return {
      visible: false,
      dataForm: {
        id: 0,
        beanName: '',
        params: '',
        cronExpression: '',
        remark: '',
      },
      dataRule: {
        beanName: [
          { required: true, message: 'Bean name cannot be empty', trigger: 'blur' }
        ],

        cronExpression: [
          { required: true, message: 'Cron expression cannot be empty', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init (id) {
      this.dataForm.id = id || 0
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields();
        if (this.dataForm.id) {
          getScheduleJob(this.dataForm.id).then(response => {
            this.dataForm.id = response.data.id;
            this.dataForm.beanName = response.data.beanName;
            this.dataForm.params = response.data.params;
            this.dataForm.cronExpression = response.data.cronExpression;
            this.dataForm.remark = response.data.remark;
          });
        }
      });
    },
    dataFormSubmit () {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          let data = {
          id: this.dataForm.id || undefined,
          beanName: this.dataForm.beanName,
          params: this.dataForm.params,
          cronExpression: this.dataForm.cronExpression,
          remark: this.dataForm.remark,
          };
          if(this.dataForm.id){
            updateScheduleJob(data).then((response) => {
              this.$message({
                message: "Success",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            }).catch((error) => {});
          }else {
            saveScheduleJob(data).then((response) => {
              this.$message({
                message: "Success",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.visible = false;
                  this.$emit("refreshDataList");
                },
              });
            }).catch((error) => {});
          }
        }
      });
    },
  }
}
</script>
