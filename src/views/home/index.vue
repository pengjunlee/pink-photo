<template>
  <div class="app-container">
   <div class="home_img"></div>
  </div>
</template>

<script>
import errGif from '@/assets/401_images/401.gif'

export default {
  name: 'Home',
  data() {
    return {
      
    }
  },
  methods: {
    
  }
}
</script>

<style scoped>
  .home_img {
    position: absolute;
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
    margin-left: -50%;
    margin-top: -263px;
    background: url(./11.png) center 0 no-repeat;
  }

</style>
