<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <h1 v-else class="sidebar-title">{{ title }} </h1>
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/">
        <img v-if="logo" :src="logo" class="sidebar-logo">
        <!-- <h1 class="sidebar-title">{{ title }} </h1> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      title: '菩提阁',
      logo : require('../../../assets/login-logo.png')
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  text-align: center;
  background-color: rgb(52, 55, 68);
  padding: 46px 37px 67px 36px;
  // position: relative;
  // width: 100%;
  // height: 150px;
  // // line-height: 100px;
  // background: #2b2f3a;
  // text-align: center;
  // overflow: hidden;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  // // padding: 40px 20px 60px 30px;

  // & .sidebar-logo-link {
  //   height: 100%;
  //   width: 100%;

    & .sidebar-logo {
      width: 117px;
      height: 32px;
      vertical-align: middle;
      // margin-right: 12px;
    }

  //   & .sidebar-title {
  //     display: inline-block;
  //     margin: 0;
  //     color: #fff;
  //     font-weight: 600;
  //     line-height: 32px;
  //     font-size: 14px;
  //     font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
  //     vertical-align: middle;
  //   }
  // }

  // &.collapse {
  //   .sidebar-logo {
  //     margin-right: 0px;
  //   }
  // }
}
</style>
