<template>
  <div>
    <el-form
      :inline="true"
      :model="dataForm"
      @keyup.enter.native="getDataList()"
    >
      <el-form-item>
        <el-input
          v-model="dataForm.beanName"
          placeholder="Bean name"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="getDataList()">Search</el-button>
        <el-button
          v-if="isAuth('sys:schedule:save')"
          type="primary"
          @click="addOrUpdateHandle()"
        >Add</el-button>
        <el-button
          v-if="isAuth('sys:schedule:delete')"
          type="danger"
          @click="deleteHandle()"
          :disabled="dataListSelections.length <= 0"
        >Batch delete</el-button>
        <el-button
          v-if="isAuth('sys:schedule:run')"
          type="info"
          @click="runHandle()"
          :disabled="dataListSelections.length <= 0"
        >Batch run</el-button>
        <el-button
          v-if="isAuth('sys:schedule:pause')"
          type="info"
          @click="pauseHandle()"
          :disabled="dataListSelections.length <= 0"
        >Batch pause</el-button>
        <el-button
          v-if="isAuth('sys:schedule:resume')"
          type="info"
          @click="resumeHandle()"
          :disabled="dataListSelections.length <= 0"
        >Batch resume</el-button>
        <el-button
          v-if="isAuth('sys:schedule:log')"
          type="success"
          @click="logHandle()"
        >Job log</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      style="width: 100%;"
    >
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50"
      >
      </el-table-column>
      <el-table-column
        prop="id"
        header-align="center"
        align="center"
        label="ID"
      >
      </el-table-column>
      <el-table-column
        prop="beanName"
        header-align="center"
        align="center"
        label="Bean name"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="params"
        header-align="center"
        align="center"
        label="Params"
      >
      </el-table-column>
      <el-table-column
        prop="cronExpression"
        header-align="center"
        align="center"
        label="Cron expression"
      >
      </el-table-column>
      <el-table-column
        prop="status"
        header-align="center"
        align="center"
        label="Status"
      >
        <template #default="scope">
          <el-switch
            v-if="isAuth('sys:schedule:pause') && isAuth('sys:schedule:resume')"
            v-model="scope.row.status"
            :active-value="0"
            :inactive-value="1"
            @change="handleStatusChange($event,scope.row.id)"
          />
          <el-tag
            v-else
            :type="scope.row.status===0?'success':'info'"
          >{{scope.row.status===0?'Alive':'Pause'}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        prop="remark"
        header-align="center"
        align="center"
        label="Remark"
      >
      </el-table-column>
      <el-table-column
        show-overflow-tooltip
        prop="createTime"
        header-align="center"
        align="center"
        label="Create time"
      >
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="180"
        label="Operation"
      >
        <template #default="scope">
          <el-button
            type="text"
            size="small"
            v-if="isAuth('sys:schedule:run')"
            @click="runHandle(scope.row.id)"
          >Run</el-button>
          <el-button
            type="text"
            size="small"
            v-if="isAuth('sys:schedule:update')"
            @click="addOrUpdateHandle(scope.row.id)"
          >Update</el-button>
          <el-button
            type="text"
            size="small"
            v-if="isAuth('sys:schedule:delete')"
            @click="deleteHandle(scope.row.id)"
          >Delete</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper"
    >
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update
      v-if="addOrUpdateVisible"
      ref="addOrUpdate"
      @refreshDataList="getDataList"
    ></add-or-update>
    <job-log
      v-if="jobLogVisible"
      ref="jobLog"
    ></job-log>
  </div>
</template>

<script>
import { isAuth } from "@/utils/auth";
import AddOrUpdate from "./job-save-or-update";
import JobLog from "./job-log";
import {
  pageScheduleJobs,
  deleteScheduleJobs,
  runScheduleJobs,
  pauseScheduleJobs,
  resumeScheduleJobs,
} from "@/api/sys/job";
export default {
  data() {
    return {
      dataForm: {
        beanName: "",
      },
      dataList: [],
      pageIndex: 1,
      pageSize: 10,
      totalPage: 0,
      dataListLoading: false,
      dataListSelections: [],
      addOrUpdateVisible: false,
      jobLogVisible: false,
    };
  },
  components: {
    AddOrUpdate,
    JobLog
  },
  created() {
    this.getDataList();
  },
  methods: {
    getDataList() {
      if (isAuth("sys:schedule:page")) {
        this.dataListLoading = true;
        pageScheduleJobs({
          page: this.pageIndex,
          size: this.pageSize,
          beanName: this.dataForm.beanName,
        })
          .then((response) => {
            this.dataList = response.data.list;
            this.totalPage = response.data.totalCount;
            this.dataListLoading = false;
          })
          .catch(() => {
            this.dataList = [];
            this.totalPage = 0;
            this.dataListLoading = false;
          });
      } else {
        this.$message.error(
          "You don't have required permission to perform this action."
        );
      }
    },
    sizeChangeHandle(val) {
      this.pageSize = val;
      this.pageIndex = 1;
      this.getDataList();
    },
    // Current page
    currentChangeHandle(val) {
      this.pageIndex = val;
      this.getDataList();
    },
    // Multiple select
    selectionChangeHandle(val) {
      this.dataListSelections = val;
    },
    // Save / Update
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true;
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id);
      });
    },
    // Delete
    deleteHandle(id) {
      let ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`Do you want to delete [id=${ids.join(",")}]?`, "Delete", {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      })
        .then(() => {
          deleteScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: "Success",
                type: "success",
                duration: 1000,
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
    runHandle(id) {
      let ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`Do you want to run [id=${ids.join(",")}]?`, "Run", {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      })
        .then(() => {
          runScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: "Success",
                type: "success",
                duration: 1000,
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    pauseHandle(id) {
      let ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`Do you want to pause [id=${ids.join(",")}]?`, "Pause", {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      })
        .then(() => {
          pauseScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: "Success",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.getDataList();
                },
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    resumeHandle(id) {
      let ids = id
        ? [id]
        : this.dataListSelections.map((item) => {
            return item.id;
          });
      this.$confirm(`Do you want to resume [id=${ids.join(",")}]?`, "Resume", {
        confirmButtonText: "Yes",
        cancelButtonText: "No",
        type: "warning",
      })
        .then(() => {
          resumeScheduleJobs(ids)
            .then(() => {
              this.$message({
                message: "Success",
                type: "success",
                duration: 1000,
                onClose: () => {
                  this.getDataList();
                },
              });
            })
            .catch(() => {});
        })
        .catch(() => {});
    },
    handleStatusChange(val, id) {
      if (val === 0) {
        resumeScheduleJobs(id)
          .then(() => {
            this.$message({
              message: "Success",
              type: "success",
              duration: 1000,
            });
          })
          .catch(() => {
            this.getDataList();
          });
      } else {
        pauseScheduleJobs(id)
          .then(() => {
            this.$message({
              message: "Success",
              type: "success",
              duration: 1000,
            });
          })
          .catch(() => {
            this.getDataList();
          });
      }
    },
    logHandle(){
      this.jobLogVisible = true;
      this.$nextTick(()=>{
        this.$refs.jobLog.init();
      })
    }
  },
};
</script>
