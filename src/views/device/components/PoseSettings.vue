<template>
  <div v-loading="dataLoading">
    <el-form
      ref="poseform"
      :rules="poseRules"
      :model="devicePose"
      label-position="left"
      label-width="100px"
    >
      <table width="100%">
        <tr>
          <td>
            <el-form-item label="白天时间段:" prop="dayTime">
              <el-time-picker
                is-range
                arrow-control
                v-model="devicePose.dayTime"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
                :readonly="readonly"
              ></el-time-picker>
            </el-form-item>
          </td>

          <td>
            <el-form-item label="夜晚时间段:" prop="nightTime">
              <el-time-picker
                is-range
                arrow-control
                v-model="devicePose.nightTime"
                range-separator="~"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                placeholder="选择时间范围"
                format="HH:mm"
                :readonly="readonly"
              ></el-time-picker>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <el-form-item label="使用场景:">
              <el-radio v-model="queryForm.dayType" label="DAY">白天</el-radio>
              <el-radio v-model="queryForm.dayType" label="NIGHT">夜晚</el-radio>
            </el-form-item>
          </td>

          <td></td>
        </tr>
        <tr>
          <td colspan="2">
            <div
              style="border-radius: 4px;background-color: aliceblue;border: 1px solid gray;min-height:400px;min-width:700px;position:relative;"
            >
              <div style="right: 5px;z-index: 99;position: absolute;top: 5px;">
                <el-button
                  class="filter-item"
                  size="mini"
                  type="primary"
                  icon="el-icon-plus"
                  @click="batchAddPose"
                >添加姿势</el-button>
              </div>
              <el-tabs
                style="padding-left: 120px;padding-right: 20px;"
                v-model="activeRow"
                @tab-click="handleRowClick"
              >
                <el-tab-pane name="WHOLE">
                  <span slot="label">
                    <div style="width:80px;text-align:left;">全身（666）</div>
                  </span>
                </el-tab-pane>
                <el-tab-pane name="HALF">
                  <span slot="label">
                    <div style="width:80px;text-align:left;">半身（66）</div>
                  </span>
                </el-tab-pane>
                <el-tab-pane name="FEATURE">
                  <span slot="label">
                    <div style="width:80px;text-align:left;">特写（6）</div>
                  </span>
                </el-tab-pane>
              </el-tabs>
              <el-tabs style v-model="currentStyle" tab-position="left" @tab-click="handleColClick">
                <el-tab-pane v-for="(item,index) in styles" :key="index" :name="item.id+''">
                  <span slot="label">
                    <div style="width:80px;text-align:left;">{{item.name}}（666）</div>
                  </span>
                </el-tab-pane>
              </el-tabs>
              <div
                style="border-radius: 4px;left: 120px;background-color: white;position: absolute;;top: 40px;right: 0px;bottom: 0px;"
              >
                <div class="flex-box">
                  <div v-for="(item,index) in devicePoses" :key="index" class="flex-item goods-box">
                    <img
                      style=" width: 100%;height: 100%;"
                      :src="fdfs + item.diagram"
                      crossorigin="anonymous"
                    />
                  </div>
                </div>
                <pagination
                  style="text-align:right;"
                  v-show="total>0"
                  :total="total"
                  :page.sync="queryForm.page"
                  :limit.sync="queryForm.limit"
                  @pagination="getList"
                />
              </div>
            </div>
          </td>
        </tr>
      </table>
    </el-form>
    <!-- 添加姿势对话框 -->
    <el-dialog
      width="714px"
      :closeOnClickModal="false"
      title="添加姿势"
      :visible.sync="addPoseDialogVisible"
    >
      <el-form ref="addPoseForm" :rules="addPoseRules" :model="tempNull"></el-form>
      <div
        style="border-radius: 4px;background-color: aliceblue;border: 1px solid gray;position:relative;    height: 430px;"
      >
        <el-tabs
          style="padding-left: 120px;padding-right: 20px;"
          v-model="activeRow"
          @tab-click="handleRowClick"
        >
          <el-tab-pane name="WHOLE">
            <span slot="label">
              <div style="width:80px;text-align:left;">全身（666）</div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="HALF">
            <span slot="label">
              <div style="width:80px;text-align:left;">半身（66）</div>
            </span>
          </el-tab-pane>
          <el-tab-pane name="FEATURE">
            <span slot="label">
              <div style="width:80px;text-align:left;">特写（6）</div>
            </span>
          </el-tab-pane>
        </el-tabs>
        <el-tabs style v-model="currentStyle" tab-position="left" @tab-click="handleColClick">
          <el-tab-pane v-for="(item,index) in styles" :key="index" :name="item.id+''">
            <span slot="label">
              <div style="width:80px;text-align:left;">{{item.name}}（666）</div>
            </span>
          </el-tab-pane>
        </el-tabs>
        <div
          style="border-radius: 4px;left: 120px;background-color: white;position: absolute;top: 40px;right: 0px;bottom: 0px;"
        >
          <div class="flex-box">
            <div
              v-for="(item,index) in poses"
              :key="index"
              @click="selectThis($event)"
              class="flex-item goods-box border-gray"
            >
              <img
                style=" width: 100%;height: 100%;"
                :src="fdfs + item.diagram"
                crossorigin="anonymous"
              />
            </div>
          </div>
          <div style="text-align: right;padding-top: 20px;">
            <el-pagination
              @current-change="handleCurrentChange"
              :current-page="listQuery.page"
              page-size="10"
              layout="total, prev, pager, next, jumper"
              :total="poseTotal"
            ></el-pagination>
          </div>
        </div>
      </div>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="cancelAddCommit">取 消</el-button>
        <el-button type="primary" @click="addPoseCommit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { poseList } from "@/api/pose";
import { devicePoseList } from "@/api/device";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination
import { VUE_APP_BASE_FDFS } from "@/utils/common";

var myvue = {};
export default {
  name: "pose-settings",
  components: {
    Pagination
  },
  props: {
    deviceId: Number,
    readonly: Boolean,
    styles: Array
  },
  data() {
    return {
      addPoseRules: {},
      addPoseDialogVisible: false,
      activeRow: "WHOLE",
      currentStyle: "1",
      dataLoading: false,
      total: 0,
      devicePoses: [],
      tempNull: null,
      poses: [],
      poseRules: {},
      selectedPoses: [],
      devicePose: {
        dayTime: new Date(),
        nightTime: new Date()
      },
      queryForm: {
        page: 1,
        limit: 20,
        deviceId: 0,
        poseStyleId: "1",
        poseType: "WHOLE",
        dayType: "DAY"
      },
      poseTotal: 0,
      listQuery: {
        page: 1,
        limit: 20,
        dayType: null,
        poseType: null,
        poseStyleId: null
      }
    };
  },
  created() {
    this.queryForm.deviceId = this.dId;
  },
  beforeCreate() {
    myvue = this;
  },
  computed: {
    dId: {
      get() {
        return this.deviceId;
      }
    },
    fdfs: {
      get() {
        return VUE_APP_BASE_FDFS;
      }
    }
  },
  methods: {
    handleRowClick(tab, event) {
      this.queryForm.poseType = tab.name;
    },
    handleColClick(tab, event) {
      this.queryForm.poseStyleId = tab.name;
    },
    cancelAddCommit() {
      this.addPoseDialogVisible = false;
    },
    addPoseCommit() {
      this.$refs["addPoseForm"].validate(valid => {
        if (valid) {
          this.addPoseDialogVisible = false;
        }
      });
    },
    getList() {
      this.dataLoading = true;
      devicePoseList(this.queryForm)
        .then(response => {
          console.log(response.data);
          this.devicePoses = response.data.row;
          this.total = response.data.total;
          this.dataLoading = false;
        })
        .catch(() => {});
    },
    handleCurrentChange(val) {
      this.listQuery.page = val;
      this.getPoseList();
    },
    selectThis(e) {
      var $this = $(e.currentTarget );
      console.log($this)
      if ($this.hasClass("border-gray")) {
        $this.removeClass("border-gray");
        $this.addClass("border-blue");
      } else {
        $this.removeClass("border-blue");
        $this.addClass("border-gray");
      }
    },
    getPoseList() {
      this.dataLoading = true;
      poseList(this.listQuery)
        .then(response => {
          console.log(response.data);
          this.poses = response.data.poses.rows;
          this.poseTotal = response.data.poses.total;
          this.dataLoading = true;
        })
        .catch(() => {});
    },
    batchAddPose() {
      this.getPoseList();
      this.addPoseDialogVisible = true;
    },
    // 子组件校验表单
    validataForm() {
      const startDayTime = this.devicePose.dayTime[0];
      const endDayTime = this.devicePose.dayTime[1];
      const startNightTime = this.devicePose.nightTime[0];
      const endNightTime = this.devicePose.nightTime[1];
      console.log(endNightTime.getHours());
      this.$refs["poseform"].validate(valid => {
        if (valid) {
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped>
.flex-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  align-items: flex-start;
}
.flex-item {
  order: 1;
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: auto;
  align-self: auto;
}
.goods-box {
  box-sizing: border-box;
  width: 100px;
  height: 150px;
  margin: 5px 5px 5px 5px;
  padding: 5px;

  border-radius: 3px;
  font-size: 12px;
}
.border-gray {
  border: 2px solid #f0f8ff;
}
.border-blue {
  border: 2px solid #1890ff;
}
</style>