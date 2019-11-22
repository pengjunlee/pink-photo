<template>
  <div v-loading="dataLoading">
    <el-form
      ref="globalForm"
      :rules="s1Rules"
      :model="s1Temp"
      label-position="right"
      label-width="180px"
      style="padding:20px;"
    >
      <table width="100%">
        <tr>
          <td>
            <el-form-item label="开启拍照价格:" prop="startPrice">
              <el-input style="width:200px;" :readonly="readonly" v-model="s1Temp.startPrice"></el-input>
              <span style="width:50px;text-align:left;">元</span>
            </el-form-item>
          </td>

          <td>
            <el-form-item label="获取照片单价:" prop="photoPrice">
              <el-input style="width:200px;" :readonly="readonly" v-model="s1Temp.photoPrice"></el-input>
              <span style="width:50px;text-align:left;">元/张</span>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <el-form-item label="拍照可操作时长:" prop="takeTime">
              <el-input style="width:200px;" :readonly="readonly" v-model="s1Temp.takeTime"></el-input>
              <span style="width:50px;text-align:left;">s（秒）</span>
            </el-form-item>
          </td>

          <td>
            <el-form-item label="选照片可操作时长:" prop="choseTime">
              <el-input style="width:200px;" :readonly="readonly" v-model="s1Temp.choseTime"></el-input>
              <span style="width:50px;text-align:left;">s（秒）</span>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <el-form-item label="支付剩余时长:" prop="payTime">
              <el-input style="width:200px;" :readonly="readonly" v-model="s1Temp.payTime"></el-input>
              <span style="width:50px;text-align:left;">s（秒）</span>
            </el-form-item>
          </td>

          <td>
            <el-form-item label="照片水印地址:" prop="waterFile">
              <el-input style="width:200px;" :readonly="readonly" v-model="s1Temp.waterFile"></el-input>
              <div style="display: inline-block;">
                <el-upload
                  action="http://172.16.80.47:8090/api/v1/upload/file"
                  :before-upload="beforeUpload"
                  :on-success="UploadSuccess"
                  :limit="1"
                  :show-file-list="false"
                >
                  <el-button size="small" :disabled="readonly" type="primary">点击上传</el-button>
                </el-upload>
              </div>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td>
            <el-form-item label="主题风格:" prop="themeId">
              <el-select
                :disabled="readonly"
                filterable
                v-model="s1Temp.themeId"
                placeholder="请选择主题风格"
              >
                <el-option
                  v-for="item in searches"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value+''"
                ></el-option>
              </el-select>
            </el-form-item>
          </td>
          <td></td>
        </tr>
        <tr>
          <td colspan="2">
            <el-form-item label="用户操作限制:" prop="takeRestTime">
              <div
                style="line-height: 60px; height: 60px;background-color: aliceblue;padding: 0 20px;"
              >
                <span>当拍照可操作剩余时长小于</span>
                <el-input style="width:50px;" :readonly="readonly" v-model="s1Temp.takeRestTime"></el-input>
                <span style="width:50px;text-align:left;">s（秒）时可重新拍照</span>
              </div>
              <div
                style="line-height: 60px; height: 60px;background-color: aliceblue;padding: 0 20px;"
              >
                <span>当选照片可操作剩余时长小于</span>
                <el-input style="width:50px;" :readonly="readonly" v-model="s1Temp.choseRestTime"></el-input>
                <span style="width:50px;text-align:left;">s（秒）时可重新选择照片</span>
              </div>
            </el-form-item>
          </td>
        </tr>
        <tr>
          <td colspan="2">
            <el-form-item label="摄像头初始化坐标:" prop="topBottom">
              <div
                style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 180px;height: 178px;"
              >
                <el-slider
                  :disabled="readonly"
                  v-model="s1Temp.topBottom"
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
                  v-model="s1Temp.leftRight"
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
                  v-model="s1Temp.upDown"
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
                  v-model="s1Temp.rotate"
                  :min="0"
                  :max="180"
                  :input="changeR"
                  width="150px"
                ></el-slider>
              </div>
            </el-form-item>
          </td>
        </tr>
      </table>
    </el-form>
  </div>
</template>
<script>
import { getDeviceGlobal, updateDeviceGlobal } from "@/api/device";

var myvue = {};
export default {
  name: "global-settings",
  props: {
    deviceId: Number,
    readonly: Boolean
  },
  data() {
    const validateFloat = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("该值不能为空，请填写有效值"));
      } else {
        var isnum = /^(([0-9]+)|(([0-9]+\.\d{1,2})))$/.test(value);
        if (isnum != true) {
          callback(new Error("键入值无效，请输入两位小数"));
        } else {
          callback();
        }
      }
    };
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
    const validateOperate = (rule, value, callback) => {
      let choseRestTime = myvue.s1Temp.choseRestTime;
      if (value.length == 0 || choseRestTime.length == 0) {
        callback(new Error("请将数据填写完整"));
      } else {
        var isnum = /^(([0-9]+))$/.test(value);
        var isnum2 = /^(([0-9]+))$/.test(choseRestTime);
        if (isnum != true || isnum2 != true) {
          callback(new Error("键入值无效，请输入正整数"));
        } else {
          callback();
        }
      }
    };
    return {
      dataLoading: false,
      s1Rules: {
        startPrice: [
          { required: true, trigger: "blur", validator: validateFloat }
        ],
        photoPrice: [
          { required: true, trigger: "blur", validator: validateFloat }
        ],
        takeTime: [
          { required: true, trigger: "blur", validator: validateNumber }
        ],
        choseTime: [
          { required: true, trigger: "blur", validator: validateNumber }
        ],
        payTime: [
          { required: true, trigger: "blur", validator: validateNumber }
        ],
        waterFile: [
          { required: true, trigger: "blur", message: "请上传水印照片" }
        ],
        themeId: [
          { required: true, trigger: "blur", message: "请选择应用的主题" }
        ],
        takeRestTime: [
          { required: true, trigger: "blur", validator: validateOperate }
        ],
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
      searches: [],
      s1Temp: {
        id: 0,
        deviceId: 0,
        startPrice: 0,
        photoPrice: 0,
        takeTime: 0,
        choseTime: 0,
        payTime: 0,
        waterFile: "",
        waterPath: "",
        themeId: null
      }
    };
  },
  created() {
    this.getData();
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
    topBottom: {
      get() {
        return this.s1Temp.topBottom;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.s1Temp.topBottom = nVal;
        }
      }
    },
    upDown: {
      get() {
        return this.s1Temp.upDown;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.s1Temp.upDown = nVal;
        }
      }
    },
    leftRight: {
      get() {
        return this.s1Temp.leftRight;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.s1Temp.leftRight = nVal;
        }
      }
    },
    rotate: {
      get() {
        return this.s1Temp.rotate;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.s1Temp.rotate = nVal;
        }
      }
    }
  },
  methods: {
    getData() {
      this.dataLoading = true;
      console.log(this.dId);
      getDeviceGlobal(this.dId)
        .then(response => {
          console.log(response.data);
          this.s1Temp = response.data.row;
          this.searches = response.data.searches;
          if(this.searches.length >0){
this.s1Temp.themeId = this.searches[0].value+''
          }
          this.dataLoading = false;
        })
        .catch(() => {});
    },
    beforeUpload(file) {
      if (this.readonly == true) {
        console.log(this.readonly)
        return false;
      }
      let fsize = file.size / 1024;
      if (fsize > 50) {
        return false;
      }
      return true;
    },
    UploadSuccess(response, file) {
      console.log(response.data);
      console.log(file);
      this.s1Temp.waterPath = response.data.filePath;
      this.s1Temp.waterFile = file.name;
    },
    changeTB(val) {
      this.s1Temp.topBottom = parseInt(val);
    },
    changeES(e) {
      this.$forceUpdate();
    },
    changeUB(val) {
      this.s1Temp.upDown = parseInt(val);
    },
    changeLR(val) {
      this.s1Temp.leftRight = parseInt(val);
    },
    changeR(val) {
      this.s1Temp.rotate = parseInt(val);
    },

    // 子组件校验表单
    validataForm() {
      this.$refs["globalForm"].validate(valid => {
        if (valid) {
          console.log(this.s1Temp);
          //提交表单
          updateDeviceGlobal(this.s1Temp).then(response => {
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