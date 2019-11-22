<template>
  <div class="app-container">
    <div class="filter-container">
        <div>
      <el-input
        class="filter-item"
        v-model="listQuery.name"
        placeholder="设备名称"
        clearable
        style="width: 200px;"
      />
      <el-input
        class="filter-item"
        v-model="listQuery.mac"
        placeholder="设备MAC"
        clearable
        style="width: 200px;"
      />
      <el-select
        class="filter-item"
        filterable
        v-model="listQuery.userId"
        placeholder="所属合作商"
        clearable
        style="width: 130px"
      >
        <el-option
          v-for="item in searches"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        ></el-option>
      </el-select>
      <el-input
        class="filter-item"
        v-model="listQuery.location"
        placeholder="当前位置"
        clearable
        style="width: 200px;"
      />
      <el-select
        class="filter-item"
        v-model="listQuery.enabled"
        placeholder="使用权限"
        clearable
        style="width: 130px"
      >
        <el-option label="启用" value="1" />
        <el-option label="禁用" value="0" />
      </el-select>
      </div>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <div class="operater-container">
      <el-button class="operater-item" type="info" icon="el-icon-plus" @click="handleCreate">添加设备</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column width="100px" align="left" label="编号">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="left" label="设备名称">
        <template slot-scope="scope">
          <router-link :to="{ name: 'DeviceDetail', params: { deviceId: scope.row.id }}">
          <span style="color: blue;">{{ scope.row.name }}</span>
          </router-link>
        </template>
      </el-table-column>
      <el-table-column width="150px" align="left" label="设备MAC">
        <template slot-scope="scope">
          <span>{{ scope.row.mac }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="所属合作商">
        <template slot-scope="scope">
          <span>{{ scope.row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="分润比例"
        prop="royalty_ratio"
        align="left"
        width="110px"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.royaltyRatio+"%" }}</span>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="left" label="场景分类">
        <template slot-scope="scope">
          <span>{{ scope.row.sceneType |sceneTypeFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="场景等级">
        <template slot-scope="scope">
          <span>{{ scope.row.sceneLevel}}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="运行状态">
        <template slot-scope="scope">
          <el-tag
            :type="scope.row.runStatus | runStatusTextFilter"
          >{{ scope.row.runStatus | runStatusFilter }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="left" label="设备当前位置">
        <template slot-scope="scope">
          <span>{{ scope.row.location }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="使用权限">
        <template slot-scope="{row}">
          <el-tag :type="row.enabled | statusFilter">{{ row.enabled | enabledFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="操作人">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedBy }}</span>
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
        <el-button type="primary" @click="createData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  deviceList,
  createDevice,
  updateUser,
  getDeviceInfo
} from "@/api/device";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { MessageBox, Message } from "element-ui";

var myvue = {};
export default {
  name: "DeviceList",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return status == true ? "success" : "danger";
    },
    enabledFilter(status) {
      return status == true ? "启用" : "禁用";
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
    runStatusTextFilter(status) {
      return status == "A" ? "success" : "danger";
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
    }
  },
  data() {
    const validateDeviceMac = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("MAC地址不能为空"));
      } else {
        getDeviceInfo(value.trim())
          .then(response => {
            if (response.data != null) {
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
      listLoading: true,
      tableKey: 0,
      list: null,
      total: 0,
      searches: null,
      sceneTypeList: [
        { id: "A", name: "商场" },
        { id: "B", name: "KTV" },
        { id: "C", name: "店铺" },
        { id: "D", name: "旅游景点" },
        { id: "E", name: "公园" },
        { id: "F", name: "酒店" }
      ],
      listQuery: {
        page: 1,
        limit: 20,
        sortBy: "created_time",
        sortOrder: "desc", // ASC or DESC
        name: null,
        mac: null,
        userId: null,
        location: null,
        enabled: null
      },
      dialogFormVisible: false,
      temp: {
        id: 0,
        name: "",
        mac: "",
        userId: "",
        sceneType: "",
        sceneLevel: ""
      },
      dialogTitle: "添加设备",
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
    this.getList();
  },
  beforeCreate() {
    myvue = this;
  },
  methods: {
    cancelCommit() {
      this.dialogFormVisible = false;
    },
    resetFilter() {
      this.listQuery.name = null;
      this.listQuery.enabled = null;
      this.listQuery.mac = null;
      this.listQuery.userId = null;
      this.listQuery.location = null;
    },

    getList() {
      this.listLoading = true;

      deviceList(this.listQuery)
        .then(response => {
          console.log(response.data);
          this.list = response.data.rows;
          this.total = response.data.total;
          this.searches = response.data.searches;
          this.listLoading = false;
        })
        .catch(() => {});
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sortBy = prop;
      this.listQuery.sortOrder = order === "ascending" ? "ASC" : "DESC";
      this.handleFilter();
    },
    handleCreate() {
      this.resetTemp();
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },

    resetTemp() {
      this.temp = {
        id: 0,
        name: "",
        mac: "",
        userId: "",
        sceneType: "",
        sceneLevel: ""
      };
    },

    createData() {
      let newTemp = Object.assign({}, this.temp); // copy obj
      newTemp.createdBy = this.$store.state.user.name;
      newTemp.updatedBy = this.$store.state.user.name;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createDevice(newTemp)
            .then(response => {
              console.log(response);
              // this.list.unshift(response.data)
              this.dialogFormVisible = false;
              this.$notify({
                title: "创建通知",
                message: "数据添加成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            })
            .catch(() => {});
        }
      });
    }
  }
};
</script>
<style scoped>
</style>