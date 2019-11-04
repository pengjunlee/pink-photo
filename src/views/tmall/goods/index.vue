<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.preSale" placeholder="预售商品" clearable style="width: 130px">
        <el-option label="预售" value="1" />
        <el-option label="非预售" value="0" />
      </el-select>
      <el-input
        v-model="listQuery.name"
        placeholder="商品名称"
        style="width: 200px;"
        @keyup.enter.native="handleFilter"
      />

      <el-button type="primary" icon="el-icon-search" @click="handleFilter">Search</el-button>
    </div>
    <el-table
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column align="center" label="商品ID" width="120" hidden>
        <template slot-scope="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column min-width="330px" label="商品名称">
        <template slot-scope="{row}">
          <div style="word-break: keep-all;white-space: nowrap;">
            <el-image style="width: 35px; height: 35px" :src="row.imgUrl" :fit="'scale-down'"></el-image>
            <span class="goods-name">
              <a
                :href="'https://detail.tmall.com/item.htm?id='+row.id"
                target="_blank"
              >{{ row.title }}</a>
            </span>
          </div>
        </template>
      </el-table-column>
      <el-table-column width="110px" align="center" label="参考价格" prop="price" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.price }}</span>
        </template>
      </el-table-column>
      <el-table-column width="80px" align="center" label="预售" prop="preSale" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.preSale | statusFilter }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" label="订金" prop="preSaleCash" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.preSaleCash }}</span>
        </template>
      </el-table-column>
      <el-table-column width="90px" align="center" label="优惠" prop="preSaleDdiscount" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.preSaleDiscount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="110px"
        align="center"
        label="预售数量"
        prop="preSaleCount"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.preSaleCount | preSaleCountFilter }}</span>
        </template>
      </el-table-column>

      <el-table-column
        width="150px"
        align="center"
        label="预售订单总额"
        prop="preSaleTotal"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.preSaleTotal }}</span>
        </template>
      </el-table-column>
      <el-table-column width="100px" align="center" label="评论数" prop="rateCount" sortable="custom">
        <template slot-scope="scope">
          <span>{{ scope.row.rateCount }}</span>
        </template>
      </el-table-column>
      <el-table-column
        width="90px"
        align="center"
        label="库存"
        prop="totalQuantity"
        sortable="custom"
      >
        <template slot-scope="scope">
          <span>{{ scope.row.totalQuantity }}</span>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      style="text-align:right;"
      v-show="total>0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getData"
    />
  </div>
</template>

<script>
import { goodsList } from "@/api/shop";
import Pagination from "@/components/Pagination"; // Secondary package based on el-pagination

export default {
  name: "GoodsList",
  components: { Pagination },
  filters: {
    statusFilter(preSale) {
      return preSale ? "是" : "否";
    },
    preSaleCountFilter(preSaleCount) {
      return preSaleCount != null ? preSaleCount : "/";
    }
  },
  data() {
    return {
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        shopId: 1,
        page: 1,
        limit: 20,
        sortBy: "id",
        sortOrder: "ASC", // ASC or DESC
        name: null,
        preSale: null
      }
    };
  },
  created() {
    this.listQuery.shopId = this.$route.params && this.$route.params.shopId;
    console.log("params:" + this.$route.params.shopId);
    this.getData();
  },
  methods: {
    getData() {
      this.listLoading = true;
      goodsList(this.listQuery).then(response => {
        console.log(response.data.rows);
        this.list = response.data.rows;
        this.total = response.data.total;
        this.listLoading = false;
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
      this.getData();
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
.goods-name {
  word-break: keep-all;
  line-height: 35px;
  display: inline-block;
  vertical-align: top;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}
.goods-name a:hover {
  color: blue !important;
}
</style>
