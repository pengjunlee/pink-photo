<template>
  <div class="app-container">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="设备基本信息" name="first">
        <div style="padding: 20px;">
          <table width="100%" v-loading="dataLoading">
            <tr style="height: 40px;">
              <td>
                <span style="color:red;">*</span>设备编号：
                <span style="color:gray;">{{device.id}}</span>
              </td>
              <td>
                <span style="color:red;">*</span>设备名称：
                <span style="color:gray;">{{device.name}}</span>
              </td>
              <td>
                <span style="color:red;">*</span>设备MAC：
                <span style="color:gray;">{{device.mac}}</span>
              </td>
            </tr>
            <tr style="height: 40px;">
              <td>
                <span style="color:red;">*</span>所属合作商：
                <span style="color:gray;">{{device.userName}}</span>
              </td>
              <td>
                <span style="color:red;">*</span>运行状态：
                <span style="color:gray;">{{ device.runStatus | runStatusFilter }}</span>
              </td>
              <td>
                <span style="color:red;">*</span>使用状态：
                <span style="color:gray;">{{ device.enabled | enabledFilter }}</span>
              </td>
            </tr>
            <tr style="height: 40px;">
              <td>
                <span style="color:red;">*</span>操作人：
                <span style="color:gray;">{{device.updatedBy}}</span>
              </td>
              <td>
                <span style="color:red;">*</span>导入时间：
                <span
                  style="color:gray;"
                >{{ device.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
              </td>
              <td>
                <span style="color:red;">*</span>分润比例：
                <span style="color:gray;">{{ device.royaltyRatio+'%' }}</span>
              </td>
            </tr>
            <tr style="height: 40px;">
              <td>
                <span style="color:red;">*</span>场景类型：
                <span style="color:gray;">{{device.sceneType | sceneTypeFilter}}</span>
              </td>
              <td>
                <span style="color:red;">*</span>场景等级：
                <span style="color:gray;">{{ device.sceneLevel }}</span>
              </td>
              <td></td>
            </tr>
          </table>
          <hr width="100%" />
          <div style="padding:10px 0;">
            <span style="color:red;">*</span>设备当前位置：
            <span style="color:gray;">{{device.location}}</span>
            <div style="display: inline-block;float: right;">
              <el-button type="primary" size="mini" @click="handleUpdate()">编辑设备</el-button>
              <el-button
                type="primary"
                size="mini"
                @click="enabledData()"
              >{{device.enabled | enabledTextFilter }}</el-button>
            </div>
          </div>
          <div class="bm-view">
            <baidu-map @submit="submitPlace"></baidu-map>
          </div>

          <el-dialog
            width="610px"
            :closeOnClickModal="false"
            :title="dialogTitle"
            :visible.sync="dialogFormVisible"
          >
            <el-form
              ref="dataForm"
              :rules="rules"
              :model="temp"
              label-position="left"
              label-width="120px"
              style="padding:20px;"
            >
              <el-form-item label="设备名称:" prop="name">
                <el-input
                  v-model="temp.name"
                  placeholder="请输入设备名称"
                  maxlength="30"
                  show-word-limit
                  autocomplete="off"
                ></el-input>
              </el-form-item>
              <el-form-item label="设备MAC:" prop="mac">
                <el-input v-model="temp.mac" placeholder="请输入设备MAC" autocomplete="off"></el-input>
              </el-form-item>

              <el-form-item label="所属合作商:" prop="userId">
                <el-select filterable v-model="temp.userId" placeholder="请选择所属合作商">
                  <el-option
                    v-for="item in searches"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="场景类型:" prop="sceneType">
                <el-select filterable v-model="temp.sceneType" placeholder="请选择场景类型">
                  <el-option
                    v-for="item in sceneTypeList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                  ></el-option>
                </el-select>
              </el-form-item>
              <el-form-item label="场景等级:" prop="sceneLevel">
                <el-select filterable v-model="temp.sceneLevel" placeholder="请选择场景等级">
                  <el-option
                    v-for="item in ['A','B','C','D']"
                    :key="item"
                    :label="item"
                    :value="item"
                  ></el-option>
                </el-select>
              </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer" style="text-align:center;">
              <el-button @click="cancelCommit">取 消</el-button>
              <el-button type="primary" @click="updateData()">确 定</el-button>
            </div>
          </el-dialog>
        </div>
      </el-tab-pane>
      <el-tab-pane label="设备数据统计" name="second">设备数据统计</el-tab-pane>
      <el-tab-pane label="设备配置信息" name="third">
        <div style="margin-top:20px;position:relative;">
          <span v-if="readonly">
            <el-button
              style="position: absolute;right: 0px;z-index: 99;"
              type="primary"
              size="mini"
              @click="editSettings()"
            >修改配置</el-button>
          </span>
          <span v-else>
            <el-button
              style="position: absolute;right: 100px;z-index: 99;"
              type="primary"
              size="mini"
              @click="cancelSettings()"
            >取消</el-button>
            <el-button
              style="position: absolute;right: 0px;z-index: 99;"
              type="primary"
              size="mini"
              @click="saveSettings()"
            >保存配置</el-button>
          </span>
          <el-tabs v-model="activeSettings" type="card" @tab-click="handleClick">
            <el-tab-pane label="全局配置" name="s1">
              <global-settings
                ref="globalform"
                :deviceId="deviceId"
                :readonly="readonly"
                @disableReadOnly="cancelSettings"
              ></global-settings>
            </el-tab-pane>
            <el-tab-pane label="全/半身配置" name="s2">
              <body-settings
                ref="bodyform"
                :deviceId="deviceId"
                :readonly="readonly"
                :styles="styleList"
                @disableReadOnly="cancelSettings"
              ></body-settings>
            </el-tab-pane>
            <el-tab-pane label="姿势配置" name="s3">
              <pose-settings
                ref="poseform"
                :deviceId="deviceId"
                :readonly="readonly"
                :styles="styleList"
                @disableReadOnly="cancelSettings"
              ></pose-settings>
            </el-tab-pane>
            <el-tab-pane label="背景乐配置" name="s4">背景乐配置</el-tab-pane>
            <el-tab-pane label="补光灯配置" name="s5">补光灯配置</el-tab-pane>
            <el-tab-pane label="美颜配置" name="s6">美颜配置</el-tab-pane>
          </el-tabs>
        </div>
      </el-tab-pane>
      <el-tab-pane label="定时任务补偿" name="fourth">定时任务补偿</el-tab-pane>
    </el-tabs>
  </div>
</template>
<script>
import { parseTime } from "@/utils";
import { getDeviceBasic, updateDevice, getDeviceInfo } from "@/api/device";
import BaiduMap from "@/components/BaiduMap"; // secondary package based on el-pagination
import GlobalSettings from "./components/GlobalSettings";
import BodySettings from "./components/BodySettings";
import PoseSettings from "./components/PoseSettings";

var myVue = {};

export default {
  components: {
    BaiduMap,
    GlobalSettings,
    BodySettings,
    PoseSettings
  },
  filters: {
    enabledTextFilter(status) {
      return status == true ? "禁用设备" : "启用设备";
    },
    sceneTypeFilter(sceneType) {
      let sceneTypeMap = {
        A: "商场",
        B: "KTV",
        C: "店铺",
        D: "旅游景点",
        E: "公园",
        F: "酒店"
      };
      return sceneTypeMap[sceneType];
    },
    runStatusFilter(runStatus) {
      let runStatusMap = {
        A: "正常运行",
        B: "网络异常",
        C: "摄像头异常",
        D: "补光灯异常",
        E: "播放器异常"
      };
      return runStatusMap[runStatus];
    },
    enabledFilter(status) {
      return status == true ? "启用" : "禁用";
    }
  },
  data() {
    const validateDeviceMac = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("MAC地址不能为空"));
      } else {
        getDeviceInfo(value.trim())
          .then(response => {
            if (response.data != null && response.data.id != myVue.deviceId) {
              callback(new Error("该MAC地址已经存在"));
            } else {
              callback();
            }
          })
          .catch(() => {
            callback(new Error("校验MAC地址出现异常"));
          });
      }
    };
    return {
      readonly: true,
      activeName: "first",
      activeSettings: "s1",
      dataLoading: true,
      deviceId: 0,
      center: { lng: 0, lat: 0 },
      zoom: 3,
      device: {},
      searches: [],
      styleList: [],
      dialogFormVisible: false,
      temp: {
        id: 0,
        name: "",
        mac: "",
        userId: "",
        sceneType: "",
        sceneLevel: ""
      },

      dialogTitle: "编辑设备",
      sceneTypeList: [
        { id: "A", name: "商场" },
        { id: "B", name: "KTV" },
        { id: "C", name: "店铺" },
        { id: "D", name: "旅游景点" },
        { id: "E", name: "公园" },
        { id: "F", name: "酒店" }
      ],
      rules: {
        name: [
          { required: true, message: "设备名称不能为空", trigger: "blur" }
        ],
        mac: [
          { required: true, trigger: "blur", validator: validateDeviceMac }
        ],
        userId: [{ required: true, message: "请选择合作商", trigger: "blur" }],
        sceneType: [
          {
            required: true,
            trigger: "blur",
            message: "请选择场景类型"
          }
        ],
        sceneLevel: [
          { required: true, message: "请选择场景等级", trigger: "blur" }
        ]
      }
    };
  },
  created() {
    let did = this.$route.params && this.$route.params.deviceId;
    this.deviceId = parseInt(did);
    this.getFirst();
  },
  beforeCreate() {
    myVue = this;
  },
  methods: {
    cancelCommit() {
      this.dialogFormVisible = false;
    },
    submitPlace(place) {
      let newTemp = {};
      newTemp.id = this.deviceId;
      newTemp.location = place;
      updateDevice(newTemp).then(response => {
        this.$notify({
          title: "系统通知",
          message: "数据更新成功",
          type: "success",
          duration: 2000
        });
        this.getFirst();
      });
    },
    handleClick(tab, event) {
      console.log(tab, event);
    },
    getFirst() {
      this.dataLoading = true;
      getDeviceBasic(this.deviceId)
        .then(response => {
          console.log(response.data);
          this.device = response.data.device.row;
          this.searches = response.data.device.searches;
          this.styleList = response.data.styles;
          this.dataLoading = false;
        })
        .catch(() => {});
    },
    handleUpdate() {
      this.temp.id = this.device.id;
      this.temp.name = this.device.name;
      this.temp.sceneType = this.device.sceneType;
      this.temp.sceneLevel = this.device.sceneLevel;
      this.temp.mac = this.device.mac;
      this.temp.userId = this.device.userId;
      this.dialogFormVisible = true;
      console.log(this.temp);
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          updateDevice(this.temp).then(response => {
            this.$notify({
              title: "系统通知",
              message: "数据更新成功",
              type: "success",
              duration: 2000
            });
            this.dialogFormVisible = false;
            this.getFirst();
          });
        }
      });
    },
    enabledData() {
      let newTemp = { id: this.deviceId };
      newTemp.enabled = this.device.enabled == 1 ? 0 : 1;
      updateDevice(newTemp)
        .then(() => {
          this.$notify({
            title: "更新通知",
            message: "数据更新成功",
            type: "success",
            duration: 2000
          });
          this.getFirst();
        })
        .catch(() => {});
    },
    editSettings() {
      this.readonly = false;
    },
    saveSettings() {
      if (this.activeSettings == "s1") {
        console.log("保存全局配置");
        // 父组件调用子组件方法进行校验，并提交新增数据
        this.$refs.globalform.validataForm();
      } else if (this.activeSettings == "s2") {
        console.log("保存全身半身配置");
        // 父组件调用子组件方法进行校验，并提交新增数据
        this.$refs.bodyform.validataForm();
      } else if (this.activeSettings == "s3") {
        console.log("保存姿势配置");
        // 父组件调用子组件方法进行校验，并提交新增数据
        this.$refs.poseform.validataForm();
      }
    },
    cancelSettings() {
      this.readonly = true;
    },
    s1Change(val) {
      console.log(val);
    }
  }
};
</script>
<style scoped>
.bm-view {
  width: 100%;
  height: 300px;
}
</style>