<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="用户名"
        style="width: 200px;"
        class="filter-item"
      />
      <el-input
        v-model="listQuery.nickName"
        placeholder="昵称"
        style="width: 200px;"
        class="filter-item"
      />
      <el-select
        class="filter-item"
        v-model="listQuery.locked"
        placeholder="用户状态"
        clearable
        style="width: 130px"
      >
        <el-option label="锁定" value="1" />
        <el-option label="正常" value="0" />
      </el-select>
      <el-select
        class="filter-item"
        v-model="listQuery.roles"
        placeholder="角色"
        clearable
        style="width: 130px"
      >
        <el-option label="管理员" value="1" />
        <el-option label="编辑" value="0" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">搜索</el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px;"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >添加</el-button>
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
      <el-table-column label="ID" prop="id" align="center" width="80" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" width="150px" label="用户">
        <template slot-scope="{row}">
          <div style="text-align: left;word-break: keep-all;white-space: nowrap;">
            <img style="border-radius: 50%;width: 30px;height: 30px;" :src="row.avatar" />
            <span style="line-height: 30px;vertical-align: top;">{{ row.name }}</span>
          </div>
        </template>
      </el-table-column>

      <el-table-column width="110px" align="left" label="昵称" prop="nickName">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="角色" prop="roles">
        <template slot-scope="scope">
          <span>{{ scope.row.roles }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="状态" prop="locked">
        <template slot-scope="{row}">
          <el-tag :type="row.locked | statusFilter">{{ row.locked | lockedFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="160" align="center" label="最近更新" prop="updatedTime" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="简介" prop="introduction">
        <template slot-scope="scope">
          <span>{{ scope.row.introduction }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="{row}">
          <button
            type="button"
            class="el-button el-button--primary el-button--small is-plain"
            @click="handleUpdate(row)"
          >
            <span>编辑</span>
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
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />
    <el-dialog width="600px" :title="dialogTitle[dialogType]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="padding:20px;"
      >
        <el-form-item v-if="dialogType=='create'" label="用户名" prop="name">
          <el-input v-model="temp.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="nickName">
          <el-input v-model="temp.nickName" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="头像地址" prop="avatar">
          <el-input v-model="temp.avatar" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="选择角色" prop="roles">
          <el-input v-model="temp.roles" autocomplete="off" style="display:none;"></el-input>
          <switch-items @itemChange="handleRoleChange" :items="rolesMap" :currentItem="temp.roles" />
        </el-form-item>
        <el-form-item label="简介" prop="introduction">
          <el-input type="textarea" v-model="temp.introduction" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button type="primary" @click="dialogType==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { userList, deleteUser, createUser, updateUser, getUserInfo } from "@/api/user";
import { parseTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SwitchItems from "@/components/SwitchItems";
import { MessageBox, Message } from 'element-ui'

export default {
  name: "UserMgt",
  components: { Pagination, SwitchItems },
  directives: { waves },
  filters: {
    statusFilter(status) {
      console.log(status);
      return status == true ? "danger" : "success";
    },
    lockedFilter(status) {
      return status == true ? "锁定" : "正常";
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("用户名不能为空"));
      } else {
        getUserInfo(value)
          .then(response => {
            if (response.data != null) {
              callback(new Error("该用户名已经存在"));
            } else {
              callback();
            }
          })
          .catch(() => {
            callback(new Error("校验用户名出现异常"));
          });
      }
    };
    return {
      tableKey: 0,
      listLoading: true,
      list: null,
      total: 0,
      listQuery: {
        page: 1,
        limit: 20,
        sortBy: "id",
        sortOrder: "ASC", // ASC or DESC
        name: null,
        nickName: null,
        locked: null,
        roles: null
      },
      rolesMap: {
        admin: {
          name: "管理员",
          value: "admin"
        },
        editor: {
          name: "普通用户",
          value: "editor"
        }
      },
      dialogFormVisible: false,
      temp: {
        id: undefined,
        name: "",
        locked: "",
        nickName: "",
        avatar: "",
        introduction: "",
        roles: ""
      },
      dialogTitle: {
        create: "添加用户",
        update: "修改用户"
      },
      dialogType: "create",
      formLabelWidth: "120px",
      rules: {
        name: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        nickName: [{ required: true, message: "昵称不能为空", trigger: "blur" }]
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    handleRoleChange(newRole) {
      this.temp.roles = newRole;
    },
    getList() {
      this.listLoading = true;
      userList(this.listQuery).then(response => {
        this.list = response.data.rows;
        this.total = response.data.total;
        // Just to simulate the time of the request
        this.listLoading = false;
      });
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
      this.dialogType = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.dialogType = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        name: "",
        nickName: "",
        avatar: "",
        introduction: "",
        roles: "editor"
      };
    },
    deleteData(id) {
      MessageBox.confirm('确认要删除用户吗？', '删除确认', {
        confirmButtonText: '删除',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        deleteUser(id).then(response =>{
          this.$notify({
              title: "系统通知",
              message: "用户删除成功",
              type: "success",
              duration: 2000
            });
            this.getList();
        })
      })
    },
    createData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createUser(this.temp).then(response => {
            console.log(response);
            // this.list.unshift(response.data)
            this.dialogFormVisible = false;
            this.$notify({
              title: "创建通知",
              message: "用户添加成功",
              type: "success",
              duration: 2000
            });
            this.getList();
          });
        }
      });
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          const tempData = {};
          tempData["id"] = this.temp.id;
          tempData["nickName"] = this.temp.nickName;
          tempData["roles"] = this.temp.roles;
          tempData["avatar"] = this.temp.avatar;
          tempData["introduction"] = this.temp.introduction;

          updateUser(tempData).then(() => {
            for (const v of this.list) {
              if (v.id === this.temp.id) {
                const index = this.list.indexOf(v);
                this.list.splice(index, 1, this.temp);
                break;
              }
            }
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000
            });
            this.getList();
          });
        }
      });
    }
  }
};
</script>
<style scoped>
</style>