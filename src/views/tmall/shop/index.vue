<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.name"
        placeholder="店铺名称"
        style="width: 200px;"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-button
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >Search</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      class="shop-header"
      @sort-change="sortChange"
    >
      <el-table-column align="center" label="编号" width="50px">
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="200px" label="店铺名称">
        <template slot-scope="{row}">
          <span class="shop-name">
            <a :href="row.url" target="_blank">
              <svg-icon icon-class="shop" class-name="shop-icon" />
              <span style="margin-left:5px;">{{ row.name }}</span>
            </a>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        width="120px"
        align="center"
        label="宝贝总数"
        prop="goods_count"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.goodsCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="120px"
        align="center"
        label="预售商品"
        prop="presale_goods_count"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.presaleGoodsCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="200px"
        align="center"
        label="预售订单金额(万元)"
        prop="presale_bill_total"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.presaleBillTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="180px"
        align="center"
        label="更新日期"
        prop="updated_time"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.updatedTime | parseTime('{y}-{m}-{d} {h}:{i}:{s}') }}</span>
        </template>
      </el-table-column>
      <el-table-column align="center" label="操作" width="220">
        <template slot-scope="scope">
          <router-link :to="{ name: 'TmallGoods', params: { shopId: scope.row.id }}">
            <button type="button" class="el-button el-button--primary el-button--small is-plain">
              <!---->
              <i class="el-icon-view"></i>
              <span>宝贝</span>
            </button>
          </router-link>
          <button
            type="button"
            class="el-button el-button--primary el-button--small is-plain"
            @click="refreshShop(scope.row.id)"
          >
            <!---->
            <i class="el-icon-refresh"></i>
            <span>刷新</span>
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
</template>

<script>
import { shopList, updateShop } from "@/api/shop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "ShopList",
  components: { Pagination },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        sortBy: "id",
        sortOrder: "ASC", // ASC or DESC
        name: null
      }
    };
  },
  created() {
    this.getList();
  },
  methods: {
    getList() {
      this.listLoading = true;
      shopList(this.listQuery).then(response => {
        console.log(response.data.rows);
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
      });
    },
    refreshShop(shopId) {
      console.log(shopId);
      this.listLoading = true;
      updateShop({ shopId: shopId }).then(response => {
        this.listLoading = false;
        this.getList();
      });
    },
    sortChange(data) {
      const { prop, order } = data;
      this.listQuery.sortBy = prop;
      this.listQuery.sortOrder = order === "ascending" ? "ASC" : "DESC";
      this.handleFilter();
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    }
  }
};
</script>

<style scoped>
.edit-input {
  padding-right: 100px;
}
.cancel-btn {
  position: absolute;
  right: 15px;
  top: 10px;
}
.shop-icon {
  float: left;
  font-size: 20px;
  color: red;
}
.shop-name {
  word-break: keep-all;
  width: 200px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.shop-name a:hover {
  color: blue !important;
}
</style>
