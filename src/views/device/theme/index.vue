<template>
  <div class="app-container">
    <div class="operater-container">
      <el-button class="operater-item" type="info" icon="el-icon-plus" @click="handleCreate">添加主题</el-button>
    </div>
    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
    >
      <el-table-column width="200px" align="left" label="主题名称">
        <template slot-scope="scope">
          <span>{{ scope.row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column width="200px" align="left" label="主题素材文件">
        <template slot-scope="scope">
          <span style="color: blue;">{{ scope.row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>

      <el-table-column width="" align="left" label="创建时间">
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="left" label="操作">
        <template slot-scope="{row}">
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
    <el-dialog
      width="530px"
      :closeOnClickModal="false"
      :title="dialogTitle"
      :visible.sync="dialogFormVisible"
    >
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="right"
        label-width="150px"
        style="padding:20px;"
      >
        <el-form-item label="主题名称:" prop="name">
          <el-input
            style="width:200px;"
            v-model="temp.name"
            placeholder="请输入主题名称"
            maxlength="10"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>

        <el-form-item label="上传主题素材文件:" prop="fileName">
          <el-input style="width:200px;" v-model="temp.fileName"></el-input>
          <div style="display: inline-block;">
            <el-upload
            ref="upload"
              action="http://172.16.80.47:8090/api/v1/upload/file"
              :before-upload="beforeUpload"
              :on-success="UploadSuccess"
              :limit="1"
              :show-file-list="false"
            >
              <el-button size="small" type="primary">点击上传</el-button>
            </el-upload>
          </div>
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
import { themeList, createTheme, deleteTheme } from "@/api/theme";
import { parseTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { MessageBox, Message } from "element-ui";

var myvue = {};
export default {
  name: "ThemeList",
  components: { Pagination },
  directives: { waves },
  filters: {},
  data() {
    return {
      listLoading: true,
      tableKey: 0,
      list: null,
      total: 0,

      listQuery: {
        page: 1,
        limit: 20
      },
      dialogFormVisible: false,
      temp: {
        id: 0,
        name: "",
        fileName: "",
        filePath: ""
      },
      dialogTitle: "添加主题",
      rules: {
        name: [
          { required: true, message: "主题名称不能为空", trigger: "blur" }
        ],
        fileName: [
          { required: true, trigger: "blur", message: "请上传主题文件" }
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

    getList() {
      this.listLoading = true;

      themeList(this.listQuery)
        .then(response => {
          console.log(response.data);
          this.list = response.data.rows;
          this.total = response.data.total;
          this.listLoading = false;
        })
        .catch(() => {});
    },
    beforeUpload(file) {
      let fsize = file.size / 1024 / 1024;
      if (fsize > 5) {
        return false;
      }
      return true;
    },
    UploadSuccess(response, file) {
      console.log(response.data);
      console.log(file);
      this.temp.filePath = response.data;
      this.temp.fileName = file.name;
      this.$refs.upload.clearFiles(); //上传成功之后清除历史记录
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
        fileName: "",
        filePath: ""
      };
    },
    deleteData(id) {
      MessageBox.confirm("确认要删除该主题吗？", "删除确认", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteTheme(id).then(response => {
            this.$notify({
              title: "删除通知",
              message: "数据删除成功",
              type: "success",
              duration: 2000
            });
            this.getList();
          });
        })
        .catch(() => {});
    },
    createData() {
      let newTemp = Object.assign({}, this.temp); // copy obj
      newTemp.createdBy = this.$store.state.user.name;
      newTemp.updatedBy = this.$store.state.user.name;
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createTheme(newTemp)
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