<template>
  <div v-loading="dataLoading">
    <div
      style="border-radius: 4px;background-color: aliceblue;border: 1px solid gray;min-height:400px;min-width:700px;position:relative;"
    >
      <el-tabs
        style="padding-left: 70px;padding-right: 20px;"
        v-model="activeRow"
        @tab-click="handleRowClick"
      >
        <el-tab-pane label="全身" name="WHOLE"></el-tab-pane>
        <el-tab-pane label="半身" name="HALF"></el-tab-pane>
        <el-tab-pane label="特写" name="FEATURE"></el-tab-pane>
      </el-tabs>
      <el-tabs style v-model="currentStyle" tab-position="left" @tab-click="handleColClick">
        <el-tab-pane
          v-for="(item,index) in styleList"
          :key="index"
          :label="item.name"
          :name="item.id+''"
        ></el-tab-pane>
      </el-tabs>
      <div
        style="border-radius: 4px;left: 68px;background-color: white;position: absolute;;top: 40px;right: 0px;bottom: 0px;"
      >
        <div style="margin-left: 20px;margin-top: 10px;font-size: 14px;">姿势不变，切换机位时各摄像头默认坐标：</div>
        <el-form
          ref="bodyForm"
          :rules="s1Rules"
          :model="bodyTemp"
          label-position="right"
          label-width="0px"
          style="padding:20px;"
        >
          <el-form-item label prop="topBottom">
            <div
              style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 180px;height: 178px;"
            >
              <el-slider
                :disabled="readonly"
                v-model="bodyTemp.topBottom"
                :min="0"
                :max="180"
                :input="changeTB"
                vertical
                height="150px"
              ></el-slider>
              <el-input
                style="top: 60px;position: absolute;right: 60px;width: 60px;"
                :readonly="readonly"
                v-model="topBottom"
                @input="changeES($event)"
              ></el-input>
              <span style="top: 60px;position: absolute;right: 40px;">度</span>
              <span style="top: 10px;position: absolute;left: 40px;">上</span>
              <span style="bottom: 10px;position: absolute;left: 40px;">下</span>
            </div>
            <div
              style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 180px;height: 178px;"
            >
              <el-input
                style="top: 60px;position: absolute;right: 60px;width: 60px;"
                :readonly="readonly"
                v-model="leftRight"
                @input="changeES($event)"
              ></el-input>
              <span style="top: 60px;position: absolute;right: 40px;">度</span>
              <span style="bottom: 25px;position: absolute;right: 15px;">右</span>
              <span style="bottom: 25px;position: absolute;left: 15px;">左</span>
              <el-slider
                style="margin-top: 120px;"
                :disabled="readonly"
                v-model="bodyTemp.leftRight"
                :min="0"
                :max="180"
                :input="changeLR"
                width="150px"
              ></el-slider>
            </div>
            <div
              style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 180px;height: 178px;"
            >
              <el-slider
                :disabled="readonly"
                v-model="bodyTemp.upDown"
                :min="0"
                :max="180"
                :input="changeUB"
                vertical
                height="150px"
              ></el-slider>
              <el-input
                style="top: 60px;position: absolute;right: 60px;width: 60px;"
                :readonly="readonly"
                v-model="upDown"
                @input="changeES($event)"
              ></el-input>
              <span style="top: 60px;position: absolute;right: 40px;">度</span>
              <span style="top: 10px;position: absolute;left: 40px;">仰</span>
              <span style="bottom: 10px;position: absolute;left: 40px;">俯</span>
            </div>
            <div
              style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 180px;height: 178px;"
            >
              <el-input
                style="top: 60px;position: absolute;right: 60px;width: 60px;"
                :readonly="readonly"
                v-model="rotate"
                @input="changeES($event)"
              ></el-input>
              <span style="top: 60px;position: absolute;right: 40px;">度</span>
              <span style="bottom: 25px;position: absolute;left: 15px;">旋转</span>
              <el-slider
                style="margin-top: 120px;"
                :disabled="readonly"
                v-model="bodyTemp.rotate"
                :min="0"
                :max="180"
                :input="changeR"
                width="150px"
              ></el-slider>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script>
import { getDeviceBody, updateDeviceBody } from "@/api/device";

export default {
  name: "body-settings",
  props: {
    deviceId: Number,
    readonly: Boolean,
    styles: Array
  },
  data() {
    const validateNumber = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("该值不能为空，请填写有效值"));
      } else {
        var isnum = /^(([0-9]+))$/.test(value);
        if (isnum != true) {
          callback(new Error("键入值无效，请输入正整数"));
        } else {
          callback();
        }
      }
    };
    return {
      dataLoading: false,
      activeRow: "WHOLE",
      currentStyle: '1',
      s1Rules: {
        topBottom: [
          { required: true, trigger: "blur", validator: validateNumber }
        ],
        leftRight: [
          { required: true, trigger: "blur", validator: validateNumber }
        ],
        upDown: [
          { required: true, trigger: "blur", validator: validateNumber }
        ],
        rotate: [{ required: true, trigger: "blur", validator: validateNumber }]
      },
      queryForm: {
        deviceId: 0,
        poseStyleId: '1',
        poseType: "WHOLE"
      },
      bodyTemp: {
        id: 0,
        deviceId: 0,
        poseStyleId: '1',
        poseType: "WHOLE",
        topBottom: 0,
        leftRight: 0,
        upDown: 0,
        rotate: 0
      }
    };
  },
  created() {
    this.queryForm.deviceId = this.dId;
    this.getData();
  },
  beforeCreate() {},
  computed: {
    styleList: {
      get() {
        return this.styles;
      }
    },
    dId: {
      get() {
        return this.deviceId;
      }
    },
    topBottom: {
      get() {
        return this.bodyTemp.topBottom;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.bodyTemp.topBottom = nVal;
        }
      }
    },
    upDown: {
      get() {
        return this.bodyTemp.upDown;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.bodyTemp.upDown = nVal;
        }
      }
    },
    leftRight: {
      get() {
        return this.bodyTemp.leftRight;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.bodyTemp.leftRight = nVal;
        }
      }
    },
    rotate: {
      get() {
        return this.bodyTemp.rotate;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.bodyTemp.rotate = nVal;
        }
      }
    }
  },
  methods: {
    handleRowClick(tab, event) {
      this.queryForm.poseType = tab.name;
      console.log(this.queryForm);
      this.getData();
    },
    handleColClick(tab, event) {
      this.queryForm.poseStyleId = tab.name;
      this.getData();
    },
    getData() {
      this.dataLoading = true;
      getDeviceBody(this.queryForm)
        .then(response => {
          console.log(response.data);
          this.bodyTemp = response.data;
          this.dataLoading = false;
        })
        .catch(() => {});
    },
    changeTB(val) {
      this.bodyTemp.topBottom = parseInt(val);
    },
    changeES(e) {
      this.$forceUpdate();
    },
    changeUB(val) {
      this.bodyTemp.upDown = parseInt(val);
    },
    changeLR(val) {
      this.bodyTemp.leftRight = parseInt(val);
    },
    changeR(val) {
      this.bodyTemp.rotate = parseInt(val);
    },

    // 子组件校验表单
    validataForm() {
      this.$refs["bodyForm"].validate(valid => {
        if (valid) {
          console.log(this.bodyTemp);
          //提交表单
          updateDeviceBody(this.bodyTemp).then(response => {
            this.$notify({
              title: "系统通知",
              message: "数据更新成功",
              type: "success",
              duration: 2000
            });
            this.$emit("disableReadOnly");
          });
        } else {
          return false;
        }
      });
    }
  }
};
</script>
<style scoped></style>