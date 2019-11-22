<template>
  <div>
    <el-radio-group v-model="selectItem">
      <el-radio-button v-for="(item,index) in items" :key="index" :label="item.value">{{item.name}}</el-radio-button>
    </el-radio-group>
  </div>
</template>

<script>
export default {
  props: {
    items: Array, // 选项们
    currentItem: String // 当前选中项
  },
  data() {
    return {};
  },
  computed: {
    selectItem: {
      get() {
        return this.currentItem;
      },
      set(val) {
        this.$emit("selectItem", val);
      }
    }
  }
};
</script>
