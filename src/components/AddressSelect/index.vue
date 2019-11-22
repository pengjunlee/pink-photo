<template>
  <div>
    <el-select v-model="currentProvince" filterable placeholder="请选择" @change="selectProvince">
      <el-option
        v-for="(item,index) in provincesData"
        :key="index"
        :value="item.id"
        :label="item.name"
      ></el-option>
    </el-select>
    <el-select v-model="currentCity" filterable placeholder="请选择" @change="selectCity">
      <el-option v-for="(item,index) in citysData" :key="index" :value="item.id" :label="item.name"></el-option>
    </el-select>
  </div>
</template>

<script>
import { provinces, citys, areas } from "@/utils/address";
export default {
  props: {
    /**
     * 重置表单，
     * this.resetData = true;
     *     setTimeout(() => {
     *    this.resetData = false;
     * }, 20);
     *
     *  */
    resetData: {
      type: Boolean,
      default: false
    },
    currentAddress: {
      type: Object,
      default: {
        currentProvince: "",
        currentCity: ""
      }
    }
  },
  data() {
    return {
      provincesData: [], //省
      citysData: [], //城市,
      currentProvince: "",
      currentCity: ""
    };
  },
  created() {
    this.provincesData = provinces;
    this.currentProvince = this.currentAddress.currentProvince;
    this.currentCity = this.currentAddress.currentCity;
    if (this.currentCity != "") {
      this.provincesData.forEach((v, i) => {
        if (v.name === this.currentProvince) {
          this.citysData = citys[v.id];
        }
      });
    }
  },
  watch: {
    resetData(val, old) {
      if (val) {
        //如果点击取消的话，就初始化
        this.currentProvince = "";
      this.currentCity = "";
        this.citysData = [];
      }
    }
  },
  methods: {
    selectProvince(val) {
      this.currentCity = ""; //城市重置
      this.provincesData.forEach((v, i) => {
        if (v.id === val) {
          this.currentProvince = this.provincesData[i].name;
        }
      });
      this.citysData = citys[val];
    },
    selectCity(val) {
      this.citysData.forEach((v, i) => {
        if (v.id === val) {
          this.currentCity = this.citysData[i].name;
        }
      });
      this.$emit("currentSelected", this.currentProvince, this.currentCity);
    }
  }
};
</script>

<style scoped>
</style>
