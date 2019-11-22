<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        class="filter-item"
        v-model="listQuery.dayType"
        placeholder="使用场景"
        clearable
        style="width: 130px"
      >
        <el-option label="白天" value="DAY" />
        <el-option label="夜晚" value="NIGHT" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="batchAddPose">批量添加姿势</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-edit" @click="editStyles">编辑姿势风格</el-button>
    </div>
    <div
      style="background-color: rgb(245,245,245);min-height:500px;min-width:700px;position:relative;"
    >
      <el-tabs
        style="padding-left: 70px;padding-right: 20px;"
        v-model="activeStyle"
        tab-position="top"
        @tab-click="handleStyleClick"
      >
        <el-tab-pane
          v-for="(item,index) in styleList"
          :key="index"
          :label="item.name"
          :name="item.id+''"
        ></el-tab-pane>
      </el-tabs>
      <el-tabs tab-position="left" v-model="activeBody" @tab-click="handleRowClick">
        <el-tab-pane label="全身" name="WHOLE"></el-tab-pane>
        <el-tab-pane label="半身" name="HALF"></el-tab-pane>
        <el-tab-pane label="特写" name="FETURE"></el-tab-pane>
      </el-tabs>
      <div
        style="background-color: white;position: absolute;left: 69px;right: 0px;top: 41px;bottom: 0px;"
      >
        <el-table
          v-loading="poseListLoading"
          :data="poseList"
          fit
          stripe
          highlight-current-row
          style="width: 100%;margin-left: 20px;"
        >
          <el-table-column width="150px" align="left" label="姿势编号">
            <template slot-scope="scope">
              <span>{{ scope.row.id }}</span>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="left" label="姿势缩略图">
            <template slot-scope="scope">
              <el-image
                :src="fdfs+scope.row.thumbnail"
                :fit="'scale-down'"
                :preview-src-list="preList(fdfs+scope.row.thumbnail)"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column width="100px" align="left" label="姿势框图">
            <template slot-scope="scope">
              <el-image
                :src="fdfs+scope.row.diagram"
                :fit="'scale-down'"
                :preview-src-list="preList(fdfs+scope.row.diagram)"
              ></el-image>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="left" label="使用场景">
            <template slot-scope="scope">
              <span>{{ scope.row.dayType | dayTypeFilter}}</span>
            </template>
          </el-table-column>
          <el-table-column width="150px" align="left" label="创建人">
            <template slot-scope="scope">
              <span>{{ scope.row.createdBy}}</span>
            </template>
          </el-table-column>
          <el-table-column width="160" align="left" label="创建时间">
            <template slot-scope="scope">
              <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
            </template>
          </el-table-column>
          <el-table-column align="center" label="操作" width="220">
            <template slot-scope="{row}">
              <button
                type="button"
                class="el-button el-button--primary el-button--small is-plain"
                @click="handleUpdate(row)"
              >
                <span>编辑配置</span>
              </button>
              <button
                type="button"
                class="el-button el-button--primary el-button--small is-plain"
                @click="deleteData(row.id)"
              >
                <span>删除</span>
              </button>
            </template>
          </el-table-column>
        </el-table>
        <pagination
          style="text-align:right;"
          v-show="total>0"
          :total="total"
          :page.sync="listQuery.page"
          :limit.sync="listQuery.limit"
          @pagination="getList"
        />
      </div>
    </div>

    <!-- 编辑姿势风格对话框 -->
    <el-dialog
      width="800px"
      :closeOnClickModal="false"
      title="编辑姿势风格"
      :visible.sync="editPoseStyleDialogVisible"
    >
      <el-table
        v-loading="poseListLoading"
        :data="tempStyles"
        fit
        stripe
        highlight-current-row
        style="width: 100%;"
      >
        <el-table-column width="150px" align="left" label="姿势风格封面">
          <template slot-scope="scope">
            <span>{{ scope.row.coverName }}</span>
          </template>
        </el-table-column>
        <el-table-column width="100px" align="left" label="封面缩略图">
          <template slot-scope="scope">
            <el-image
              :src="fdfs+scope.row.coverPath"
              :fit="'scale-down'"
              :preview-src-list="preList(fdfs+scope.row.coverPath)"
            ></el-image>
          </template>
        </el-table-column>
        <el-table-column width="150px" align="left" label="姿势风格名称">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>

        <el-table-column width align="left" label="操作">
          <template slot-scope="{row}">
            <el-upload
              style="display:inline-block;margin-right: 10px;"
              :ref="'upload'+row.id"
              :action="uploadUrl"
              :before-upload="beforeStyleUpload"
              :on-success="UploadStyleSuccess"
              :data="{'data':row.id}"
              :limit="1"
              :show-file-list="false"
              accept=".jpg, .jpeg, .png, .gif, .bmp, .JPG, .JPEG, PNG, .GIF, .BMP"
            >
              <el-button size="mini" plain type="primary">更换封面</el-button>
            </el-upload>
            <el-button size="mini" plain type="primary" @click="up(row.id)">顺序上移</el-button>
            <el-button size="mini" plain type="primary" @click="down(row.id)">顺序下移</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="cancelCommit">取 消</el-button>
        <el-button type="primary" @click="commit()">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加姿势对话框 -->
    <el-dialog
      width="530px"
      :closeOnClickModal="false"
      title="添加姿势"
      :visible.sync="addPoseDialogVisible"
    >
      <el-form
        ref="addPoseForm"
        :rules="addPoseRules"
        :model="poseTemp"
        label-position="right"
        label-width="150px"
        style="padding:20px;"
      >
        <el-form-item label="上传姿势素材文件:" prop="fileName">
          <el-input style="width:200px;" v-model="poseTemp.fileName"></el-input>
          <div style="display: inline-block;">
            <el-upload
              ref="addUpload"
              action="http://172.16.80.47:8090/api/v1/upload/file"
              :before-upload="beforePoseUpload"
              :on-success="UploadPoseSuccess"
              :limit="1"
              :show-file-list="false"
              accept=".zip"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
        </el-form-item>
        <el-form-item label="姿势风格:" prop="poseStyleId">
          <el-select filterable v-model="poseTemp.poseStyleId" placeholder="请选择姿势风格">
            <el-option
              v-for="(item,index) in styleList"
              :key="index"
              :label="item.name"
              :value="item.id+''"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="机位类型:" prop="poseType">
          <el-select filterable v-model="poseTemp.poseType" placeholder="请选择姿势风格">
            <el-option label="全身" value="WHOLE"></el-option>
            <el-option label="半身" value="HALF"></el-option>
            <el-option label="特写" value="FEATURE"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="使用场景:" prop="dayType">
          <el-input v-model="poseTemp.dayType" autocomplete="off" style="display:none;"></el-input>
          <switch-items
            @selectItem="handleDayTypeChange"
            :items="dayTypes"
            :currentItem="poseTemp.dayType"
          />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="cancelAddCommit">取 消</el-button>
        <el-button type="primary" @click="addPoseCommit()">确 定</el-button>
      </div>
    </el-dialog>
    <el-dialog
      width="700px"
      :closeOnClickModal="false"
      title="姿势配置"
      :visible.sync="editPoseDialogVisible"
    >
      <el-form
        ref="editPoseForm"
        :rules="editPoseRules"
        :model="editPose"
        label-position="right"
        label-width="100px"
      >
        <table width="100%">
          <tr>
            <td style="width:200px;vertical-align: top;">
              <el-form-item label="姿势编号:" prop="id">
                <el-input style="width:60px;" :readonly="true" v-model="editPose.id"></el-input>
              </el-form-item>
            </td>
            <td width="200px;">
              <el-form-item label="姿势缩略图:" prop="thumbnail">
                <el-upload
                  ref="thumbnailUpload"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :action="uploadUrl"
                  :before-upload="beforeStyleUpload"
                  :on-success="UploadThumbnailSuccess"
                >
                  <img :src="fdfs+editPose.thumbnail" class="avatar" />
                </el-upload>
              </el-form-item>
            </td>
            <td width="200px;">
              <el-form-item label="姿势框图:" prop="diagram">
                <el-upload
                  ref="diagramUpload"
                  class="avatar-uploader"
                  :show-file-list="false"
                  :action="uploadUrl"
                  :before-upload="beforeStyleUpload"
                  :on-success="UploadDiagramSuccess"
                >
                  <img :src="fdfs+editPose.diagram" class="avatar" />
                </el-upload>
              </el-form-item>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <el-form-item label="摄像头坐标:" prop="topBottom">
                <div
                  style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 125px;height: 178px;"
                >
                  <el-slider
                    v-model="editPose.topBottom"
                    :min="0"
                    :max="180"
                    :input="changeTB"
                    vertical
                    height="150px"
                  ></el-slider>
                  <el-input
                    style="top: 60px;position: absolute;right: 25px;width: 60px;"
                    v-model="topBottom"
                    @input="changeES($event)"
                  ></el-input>
                  <span style="top: 60px;position: absolute;right: 5px;">度</span>
                  <span style="top: 10px;position: absolute;left: 40px;">上</span>
                  <span style="bottom: 10px;position: absolute;left: 40px;">下</span>
                </div>
                <div
                  style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 125px;height: 178px;"
                >
                  <el-input
                    style="top: 60px;position: absolute;right: 40px;width: 60px;"
                    v-model="leftRight"
                    @input="changeES($event)"
                  ></el-input>
                  <span style="top: 60px;position: absolute;right: 20px;">度</span>
                  <span style="bottom: 25px;position: absolute;right: 15px;">右</span>
                  <span style="bottom: 25px;position: absolute;left: 15px;">左</span>
                  <el-slider
                    style="margin-top: 120px;"
                    v-model="editPose.leftRight"
                    :min="0"
                    :max="180"
                    :input="changeLR"
                    width="150px"
                  ></el-slider>
                </div>
                <div
                  style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 125px;height: 178px;"
                >
                  <el-slider
                    v-model="editPose.upDown"
                    :min="0"
                    :max="180"
                    :input="changeUB"
                    vertical
                    height="150px"
                  ></el-slider>
                  <el-input
                    style="top: 60px;position: absolute;right: 25px;width: 60px;"
                    v-model="upDown"
                    @input="changeES($event)"
                  ></el-input>
                  <span style="top: 60px;position: absolute;right: 5px;">度</span>
                  <span style="top: 10px;position: absolute;left: 40px;">仰</span>
                  <span style="bottom: 10px;position: absolute;left: 40px;">俯</span>
                </div>
                <div
                  style="background-color: aliceblue;padding:10px;position: relative;display: inline-block;width: 125px;height: 178px;"
                >
                  <el-input
                    style="top: 60px;position: absolute;right: 40px;width: 60px;"
                    v-model="rotate"
                    @input="changeES($event)"
                  ></el-input>
                  <span style="top: 60px;position: absolute;right: 20px;">度</span>
                  <span style="bottom: 25px;position: absolute;left: 15px;">旋转</span>
                  <el-slider
                    style="margin-top: 120px;"
                    v-model="editPose.rotate"
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
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="cancelEditCommit">取 消</el-button>
        <el-button type="primary" @click="editPoseCommit()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import Vue from "vue";
import {
  poseList,
  updatePoseStyle,
  batchAddPose,
  deletePose,
  updatePose
} from "@/api/pose";
import { parseTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { MessageBox, Message } from "element-ui";
import SwitchItems from "@/components/SwitchItems";
import { VUE_APP_BASE_FDFS } from "@/utils/common";

var myvue = {};
export default {
  name: "PoseList",
  components: { Pagination, SwitchItems },
  directives: { waves },
  filters: {
    dayTypeFilter(status) {
      const map = {
        DAY: "白天",
        NIGHT: "夜晚"
      };
      return map[status];
    }
  },
  data() {
    return {
      activeStyle: "1",
      activeBody: "WHOLE",
      poseListLoading: true,
      styleList: null,
      poseList: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        dayType: null,
        poseType: null,
        poseStyleId: null
      },
      editPoseDialogVisible: false,
      editPoseStyleDialogVisible: false,
      addPoseDialogVisible: false,
      tempStyles: null,
      addPoseRules: {
        poseStyleId: [
          { required: true, message: "请选择姿势风格", trigger: "blur" }
        ],
        fileName: [
          { required: true, trigger: "blur", message: "请上传姿势素材文件" }
        ]
      },
      editPoseRules: {
        poseStyleId: [
          { required: true, message: "请选择姿势风格", trigger: "blur" }
        ],
        fileName: [
          { required: true, trigger: "blur", message: "请上传姿势素材文件" }
        ]
      },
      poseTemp: {},
      editPose: {},
      dayTypes: [
        {
          name: "白天",
          value: "DAY"
        },
        {
          name: "夜晚",
          value: "NIGHT"
        }
      ]
    };
  },
  created() {
    this.getList();
  },
  beforeCreate() {
    myvue = this;
  },
  computed: {
    uploadUrl: {
      get() {
        return "http://172.16.80.47:8090/api/v1/upload/file";
      }
    },
    fdfs: {
      get() {
        return VUE_APP_BASE_FDFS;
      }
    },
    topBottom: {
      get() {
        return this.editPose.topBottom;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.editPose.topBottom = nVal;
        }
      }
    },
    upDown: {
      get() {
        return this.editPose.upDown;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.editPose.upDown = nVal;
        }
      }
    },
    leftRight: {
      get() {
        return this.editPose.leftRight;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.editPose.leftRight = nVal;
        }
      }
    },
    rotate: {
      get() {
        return this.editPose.rotate;
      },
      set(val) {
        var isnum = /^(([0-9]+))$/.test(val);
        if (isnum) {
          let nVal = parseInt(val);
          if (nVal >= 0 && nVal <= 180) this.editPose.rotate = nVal;
        }
      }
    }
  },
  methods: {
    handleStyleClick(tab) {
      this.activeStyle = tab.name;
      this.listQuery.poseStyleId = tab.name;
      this.getList();
    },
    handleRowClick(tab) {
      this.activeBody = tab.name;
      this.listQuery.poseType = tab.name;
      this.getList();
    },
    up(id) {
      this.tempStyles.forEach((value, index) => {
        if (value.id === id && index > 0) {
          let tm = Object.assign({}, this.tempStyles[index - 1]);
          tm.orderNum = value.orderNum;
          value.orderNum = this.tempStyles[index - 1].orderNum;
          this.$set(this.tempStyles, index, tm);
          this.$set(this.tempStyles, index - 1, value);
          return false;
        }
      });
      console.log(this.tempStyles);
    },
    down(id) {
      let flag = true;
      this.tempStyles.forEach((value, index) => {
        if (
          value.id === id &&
          index < this.tempStyles.length - 1 &&
          flag == true
        ) {
          let tm = Object.assign({}, this.tempStyles[index + 1]);
          console.log(tm);
          tm.orderNum = value.orderNum;
          value.orderNum = this.tempStyles[index + 1].orderNum;
          this.$set(this.tempStyles, index, tm);
          this.$set(this.tempStyles, index + 1, value);
          flag = false;
        }
      });
      console.log(this.tempStyles);
    },
    copyArr(arr) {
      let res = [];
      for (let i = 0; i < arr.length; i++) {
        res.push(arr[i]);
      }
      return res;
    },
    preList(url) {
      return new Array(url);
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    cancelCommit() {
      this.editPoseStyleDialogVisible = false;
    },
    cancelAddCommit() {
      this.addPoseDialogVisible = false;
    },
    cancelEditCommit() {
      this.editPoseDialogVisible = false;
    },
    batchAddPose() {
      this.poseTemp = {
        filePath: "",
        fileName: "",
        poseStyleId: null,
        poseType: "WHOLE",
        dayType: "DAY"
      };
      this.addPoseDialogVisible = true;
    },
    commit() {
      updatePoseStyle(this.tempStyles)
        .then(response => {
          this.styleList = response.data;
          this.editPoseStyleDialogVisible = false;
        })
        .catch(() => {});
    },
    addPoseCommit() {
      this.$refs["addPoseForm"].validate(valid => {
        if (valid) {
          this.poseTemp.createdBy = this.$store.state.user.name;
          batchAddPose(this.poseTemp)
            .then(response => {
              this.addPoseDialogVisible = false;
              this.getList();
            })
            .catch(() => {});
        }
      });
    },
    editPoseCommit() {
      this.$refs["editPoseForm"].validate(valid => {
        if (valid) {
          this.editPose.updatedBy = this.$store.state.user.name;
          updatePose(this.editPose)
            .then(response => {
              this.editPoseDialogVisible = false;
              this.getList();
            })
            .catch(() => {});
        }
      });
    },
    handleUpdate(row) {
      this.editPose = Object.assign({}, row); // copy obj
      console.log(this.editPose);
      this.editPoseDialogVisible = true;
      this.$nextTick(() => {
        this.$refs["editPoseForm"].clearValidate();
      });
    },
    getList() {
      this.poseListLoading = true;
      poseList(this.listQuery)
        .then(response => {
          console.log(response.data);
          this.styleList = response.data.styles;
          this.poseList = response.data.poses.rows;
          this.total = response.data.poses.total;
          this.poseListLoading = false;
        })
        .catch(() => {});
    },
    deleteData(id) {
      MessageBox.confirm("确认要删除用户吗？", "删除确认", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      }).then(() => {
        deletePose(id).then(response => {
          this.$notify({
            title: "系统通知",
            message: "姿势删除成功",
            type: "success",
            duration: 2000
          });
          this.getList();
        });
      });
    },
    editStyles() {
      this.tempStyles = this.copyArr(this.styleList);
      this.editPoseStyleDialogVisible = true;
    },
    beforeStyleUpload(file) {
      let ext = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      const exts = ["jpg", "jpeg", "png", "gif", "bmp"];
      const flag = exts.indexOf(ext) >= 0;
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!flag) {
        this.$message({
          message: "请上传jpg/png格式的文件!",
          type: "error"
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 2MB!",
          type: "error"
        });
      }
      return flag && isLt2M;
    },
    changeTB(val) {
      this.editPose.topBottom = parseInt(val);
    },
    changeES(e) {
      this.$forceUpdate();
    },
    changeUB(val) {
      this.editPose.upDown = parseInt(val);
    },
    changeLR(val) {
      this.editPose.leftRight = parseInt(val);
    },
    changeR(val) {
      this.editPose.rotate = parseInt(val);
    },
    UploadStyleSuccess(response, file) {
      let styleId = response.data.params;
      console.log(styleId);
      let flag = true;
      this.tempStyles.forEach((value, index) => {
        if (value.id + "" === styleId && flag == true) {
          value.coverName = file.name;
          value.coverPath = response.data.filePath;
          this.$set(this.tempStyles, index, value);
          flag = false;
        }
      });
      let upload = "upload" + styleId;
      this.$refs[upload].clearFiles(); //上传成功之后清除历史记录
    },
    beforePoseUpload(file) {
      let ext = file.name
        .substring(file.name.lastIndexOf(".") + 1)
        .toLowerCase();
      const flag = ext === "zip";
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!flag) {
        this.$message({
          message: "请上传.zip格式的文件!",
          type: "error"
        });
      }
      if (!isLt2M) {
        this.$message({
          message: "上传文件大小不能超过 2MB!",
          type: "error"
        });
      }
      return flag && isLt2M;
    },
    UploadPoseSuccess(response, file) {
      this.poseTemp.filePath = response.data.filePath;
      this.poseTemp.fileName = file.name;
      this.$refs.addUpload.clearFiles(); //上传成功之后清除历史记录
    },
    UploadThumbnailSuccess(response, file) {
      this.editPose.thumbnail = response.data.filePath;
      this.$refs.thumbnailUpload.clearFiles(); //上传成功之后清除历史记录
    },
    UploadDiagramSuccess(response, file) {
      this.editPose.diagram = response.data.filePath;
      this.$refs.diagramUpload.clearFiles(); //上传成功之后清除历史记录
    },
    handleDayTypeChange(dayType) {
      this.poseTemp.dayType = dayType;
    }
  }
};
</script>
<style scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 80px;
  height: 80px;
  line-height: 80px;
  text-align: center;
}
.avatar {
  width: 80px;
  height: 80px;
  display: block;
}
</style>