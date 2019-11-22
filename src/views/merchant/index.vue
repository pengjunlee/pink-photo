<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        class="filter-item"
        filterable
        v-model="listQuery.id"
        placeholder="请选择合作商"
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
        v-model="listQuery.contactPhone"
        placeholder="联系手机"
        clearable
        style="width: 200px;"
      />
      <el-select
        class="filter-item"
        v-model="listQuery.enabled"
        placeholder="用户状态"
        clearable
        style="width: 130px"
      >
        <el-option label="启用" value="1" />
        <el-option label="禁用" value="0" />
      </el-select>
      <el-button class="filter-item" type="primary" icon="el-icon-refresh" @click="resetFilter">重置</el-button>
      <el-button class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">查询</el-button>
    </div>
    <div class="filter-container">
      <el-button class="filter-item" type="info" icon="el-icon-plus" @click="handleCreate">添加合作商</el-button>
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
      <el-table-column width="150px" align="left" label="合作商" prop="nickName">
        <template slot-scope="scope">
          <span>{{ scope.row.nickName }}</span>
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
      <el-table-column width="110px" align="left" label="联系人" prop="contactName">
        <template slot-scope="scope">
          <span>{{ scope.row.contactName }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="联系电话" prop="contactPhone">
        <template slot-scope="scope">
          <span>{{ scope.row.contactPhone }}</span>
        </template>
      </el-table-column>
      <el-table-column align="left" label="联系地址">
        <template slot-scope="scope">
          <span>{{ scope.row.province+scope.row.city+scope.row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="状态">
        <template slot-scope="{row}">
          <el-tag :type="row.enabled | statusFilter">{{ row.enabled | enabledFilter}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="left" label="创建人">
        <template slot-scope="scope">
          <span>{{ scope.row.createdBy }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="160px"
        align="left"
        label="创建时间"
        prop="created_time"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.createdTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>

      <el-table-column align="left" label="操作" width="320px">
        <template slot-scope="{row}">
          <button
            type="button"
            class="el-button el-button--primary el-button--small is-plain"
            @click="deleteData(row.id)"
          >
            <span>删除</span>
          </button>
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
            @click="enabledData(row.id,row.enabled)"
          >
            <span>{{ !row.enabled | enabledFilter}}</span>
          </button>
          <button
            type="button"
            class="el-button el-button--primary el-button--small is-plain"
            @click="resetPassword(row.name)"
          >
            <span>重置密码</span>
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
      width="610px"
      :closeOnClickModal="false"
      :title="dialogTitle[dialogType]"
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
        <el-form-item v-if="dialogType=='create'" label="登录账号:" prop="name">
          <el-input
            v-model="temp.name"
            placeholder="请输入登录账号"
            maxlength="20"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item v-if="dialogType=='create'" prop="password" label="登录密码:">
          <el-input
            style="width:280px;"
            name="password"
            v-model="temp.password"
            autocomplete="off"
            placeholder="请输入登录密码"
            :type="showPassword?'':'password'"
          ></el-input>
          <el-checkbox style="margin-left:20px;" v-model="showPassword">显示明文</el-checkbox>
        </el-form-item>
        <el-form-item label="合作商名称:" prop="nickName">
          <el-input
            v-model="temp.nickName"
            placeholder="请输入合作商名称"
            maxlength="20"
            show-word-limit
            autocomplete="off"
          ></el-input>
        </el-form-item>
        <el-form-item label="分润比例:" prop="royaltyRatio">
          <el-input v-model="temp.royaltyRatio" placeholder="请输入分润比例" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="照片浏览权限:" prop="imageBrowse">
          <el-input v-model="temp.imageBrowse" autocomplete="off" style="display:none;"></el-input>
          <switch-items
            @itemChange="handleFlagChange"
            :items="imageBrowseMap"
            :currentItem="temp.imageBrowse"
          />
        </el-form-item>
        <el-form-item label="联系人:" prop="contactName">
          <el-input v-model="temp.contactName" placeholder="请输入联系人" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="联系电话:" prop="contactPhone">
          <el-input v-model="temp.contactPhone" placeholder="请输入联系电话" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item style="margin-bottom:0px;" label="联系地址:" prop="province">
          <el-input v-model="temp.province" autocomplete="off" style="display:none;"></el-input>
          <el-input v-model="temp.city" autocomplete="off" style="display:none;"></el-input>
          <address-select
            @currentSelected="selected"
            :currentAddress="currentAddress"
            :resetData="resetData"
          />
          <el-input
            style="margin-top:10px;"
            type="textarea"
            v-model="temp.address"
            placeholder="请输入详细地址"
            autocomplete="off"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer" style="text-align:center;">
        <el-button @click="cancelCommit">取 消</el-button>
        <el-button type="primary" @click="dialogType==='create'?createData():updateData()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import {
  userList,
  deleteUser,
  createUser,
  updateUser,
  getUserInfo,
  updatePassword
} from "@/api/user";
import { parseTime } from "@/utils";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import SwitchItems from "@/components/SwitchItems";
import AddressSelect from "@/components/AddressSelect";
import { MessageBox, Message } from "element-ui";

var myvue = {};
export default {
  name: "MerchantList",
  components: { Pagination, SwitchItems, AddressSelect },
  directives: { waves },
  filters: {
    statusFilter(status) {
      return status == true ? "success" : "danger";
    },
    enabledFilter(status) {
      return status == true ? "启用" : "禁用";
    }
  },
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("登录账号不能为空"));
      } else {
        getUserInfo(value)
          .then(response => {
            if (response.data != null) {
              callback(new Error("该账号已经存在"));
            } else {
              callback();
            }
          })
          .catch(() => {
            callback(new Error("校验账号出现异常"));
          });
      }
    };
    const validateRoyaltyRatio = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("分润比例不能为空"));
      } else {
        var isnum = /^(([0-9]{0,3})|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(
          value
        );
        if (isnum != true) {
          callback(new Error("键入值无效，请输入两位小数"));
        } else {
          if (value > 100 || value < 0) {
            callback(new Error("请输入0~100之间的数值"));
          } else {
            callback();
          }
        }
      }
    };
    const validateContactPhone = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("联系电话不能为空"));
      } else {
        var isphone = /^1[3456789]\d{9}$/.test(value);
        if (isphone != true) {
          callback(new Error("电话号码格式错误"));
        } else {
          callback();
        }
      }
    };
    const validateContactAddress = (rule, value, callback) => {
      let address = myvue.temp.address;
      let city = myvue.temp.city;
      if (value.length == 0 || address.length == 0 || city.length == 0) {
        callback(new Error("请将省市地区填写完整"));
      } else {
        callback();
      }
    };
    return {
      showPassword: false,
      listLoading: true,
      resetData: false,
      tableKey: 0,
      list: null,
      total: 0,
      searches: null,
      currentAddress: {
        currentProvince: "",
        currentCity: ""
      },
      listQuery: {
        page: 1,
        limit: 20,
        sortBy: "created_time",
        sortOrder: "DESC", // ASC or DESC
        contactPhone: null,
        enabled: null,
        id: null
      },
      dialogFormVisible: false,
      temp: {
        id: 0,
        name: "",
        password: "123456",
        nickName: "",
        royaltyRatio: "0.00",
        contactName: "",
        contactPhone: "",
        imageBrowse: "t",
        province: "",
        city: "",
        address: ""
      },
      dialogTitle: {
        create: "添加合作商",
        update: "编辑合作商"
      },
      imageBrowseMap: {
        t: {
          name: "开启",
          value: "t"
        },
        f: {
          name: "关闭",
          value: "f"
        }
      },
      dialogType: "create",
      formLabelWidth: "120px",
      rules: {
        name: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, message: "登录密码不能为空", trigger: "blur" }
        ],
        nickName: [
          { required: true, message: "合作商名称不能为空", trigger: "blur" }
        ],
        royaltyRatio: [
          {
            required: true,
            trigger: "blur",
            validator: validateRoyaltyRatio
          }
        ],
        contactName: [
          { required: true, message: "联系人不能为空", trigger: "blur" }
        ],
        contactPhone: [
          { required: true, trigger: "blur", validator: validateContactPhone }
        ],
        province: [
          { required: true, trigger: "blur", validator: validateContactAddress }
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
      this.resetData = true;
      setTimeout(() => {
        this.resetData = false;
      }, 20);
      this.dialogFormVisible = false;
    },
    selected(province, city) {
      this.temp.province = province;
      this.temp.city = city;
    },
    resetFilter() {
      this.listQuery.contactPhone = null;
      this.listQuery.enabled = null;
      this.listQuery.id = null;
    },
    handleFlagChange(newFlag) {
      this.temp.imageBrowse = newFlag;
    },
    getList() {
      this.listLoading = true;

      userList(this.listQuery)
        .then(response => {
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
      this.dialogType = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      if (this.temp.imageBrowse == true) {
        this.temp.imageBrowse = "t";
      } else {
        this.temp.imageBrowse = "f";
      }
      this.currentAddress = {
        currentProvince: this.temp.province,
        currentCity: this.temp.city
      };
      this.dialogType = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    resetTemp() {
      this.temp = {
        id: 0,
        name: "",
        password: "123456",
        nickName: "",
        royaltyRatio: "0.00",
        contactName: "",
        contactPhone: "",
        imageBrowse: "t",
        province: "",
        city: "",
        address: ""
      };
      this.currentAddress = {
        currentProvince: "",
        currentCity: ""
      };
    },
    deleteData(id) {
      MessageBox.confirm("确认要删除该合作商吗？", "删除确认", {
        confirmButtonText: "删除",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          deleteUser(id).then(response => {
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
      newTemp.roles = "merchant";
      if (newTemp.imageBrowse == "t") {
        newTemp.imageBrowse = true;
      } else {
        newTemp.imageBrowse = false;
      }
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          createUser(newTemp)
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
    },
    updateData() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          let newTemp = Object.assign({}, this.temp); // copy obj
          if (newTemp.imageBrowse == "t") {
            newTemp.imageBrowse = true;
          } else {
            newTemp.imageBrowse = false;
          }
          updateUser(newTemp)
            .then(() => {
              for (const v of this.list) {
                if (v.id === this.temp.id) {
                  const index = this.list.indexOf(v);
                  this.list.splice(index, 1, this.temp);
                  break;
                }
              }
              this.dialogFormVisible = false;
              this.$notify({
                title: "更新通知",
                message: "数据更新成功",
                type: "success",
                duration: 2000
              });
              this.getList();
            })
            .catch(() => {});
        }
      });
    },
    enabledData(rowId,enabled) {
      let newTemp = { id: rowId };
      newTemp.enabled = enabled == 1 ? 0 : 1;
      updateUser(newTemp)
        .then(() => {
          this.$notify({
            title: "更新通知",
            message: "数据更新成功",
            type: "success",
            duration: 2000
          });
          this.getList();
        })
        .catch(() => {});
    },
    resetPassword(rowName) {
      let newTemp = { name: rowName };
      newTemp.password = "123456";
      updatePassword(newTemp)
        .then(() => {
          this.$notify({
            title: "更新通知",
            message: "数据更新成功",
            type: "success",
            duration: 2000
          });
        })
        .catch(() => {});
    }
  }
};
</script>
<style scoped>
</style>