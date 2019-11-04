<template>
  <div>
    <el-radio-group v-model="switchItems">
      <el-radio-button v-for="(item,index) in itemList" :key="index" :label="item.name" />
    </el-radio-group>
  </div>
</template>

<script>
var underscore = require("underscore");

export default {
  props: {
    items: Object,
    currentItem: String
  },
  computed: {
    itemList: {
      get() {
        return underscore.values(this.items);
      }
    },
    switchItems: {
      get() {
        return this.items[this.currentItem]["name"];
      },
      set(val) {
        for (var key in this.items) {
          var itemName = this.items[key]["name"];
          if (itemName === val) {
            val = this.items[key]["value"];
            break;
          }
        }
        this.$emit("itemChange", val);
      }
    }
  }
};
</script>
<!--
<switch-items @itemChange="handleRoleChange" :items="rolesMap" :currentItem="temp.roles" />
import SwitchItems from "@/components/SwitchItems";
components: { SwitchItems },

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

handleRoleChange(newRole) {
      this.temp.roles = newRole;
    },
-->