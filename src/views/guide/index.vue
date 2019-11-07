<template>
  <div class="app-container">
    <aside>
      通过一个简单的向导示例，快速熟悉如何使用系统！
    </aside>
    <el-button icon="el-icon-question" type="primary" @click.prevent.stop="guide">
      开启向导
    </el-button>
  </div>
</template>

<script>
import Driver from 'driver.js' // import driver.js
import 'driver.js/dist/driver.min.css' // import driver.js css
import steps from './steps'

export default {
  name: 'Guide',
  data() {
    return {
      driver: null
    }
  },
  mounted() {
    this.driver = new Driver()
  },
  methods: {
    guide() {
      this.driver.defineSteps(steps)
      this.driver.start()
    }
  }
}
</script>
