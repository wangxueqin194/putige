<template>
  <section class="app-main">
    <transition name="fade-transform" mode="out-in">
      <router-view :key="key" />
    </transition>
  </section>
  <!-- <div class="app-main" v-loading="loading">
    <div class="divTmp" v-show="loading"></div>
    <iframe
      id="cIframe"
      class="c_iframe"
      name="cIframe"
      :src="iframeUrl"
      width="100%"
      height="auto"
      frameborder="0"
      v-show="!loading"
    ></iframe>
  </div> -->
</template>

<script>
export default {
  name: "AppMain",
  data() {
    return {
      iframeUrl: "/users",
      headTitle: "员工管理",
      goBackFlag: false,
      loading: false,
      timer: null,
    };
  },
  computed: {
    key() {
      return this.$route.path;
    },
  },
  created() {
    const userInfo = window.localStorage.getItem("userInfo");
    if (userInfo) {
      this.userInfo = JSON.parse(userInfo);
    }
    this.closeLoading();
  },
  beforeDestroy() {
    this.timer = null;
    clearTimeout(this.timer);
  },
  mounted() {
    window.menuHandle = this.menuHandle;
  },
  methods: {
    logout() {
      logoutApi().then((res) => {
        if (res.code === 1) {
          localStorage.removeItem("userInfo");
          window.location.href = "/backend/page/login/login.html";
        }
      });
    },
    goBack() {
      // window.location.href = 'javascript:history.go(-1)'
      const menu = this.menuList.find((item) => item.id === this.menuActived);
      // this.goBackFlag = false
      // this.headTitle = menu.name
      this.menuHandle(menu, false);
    },
    menuHandle(item, goBackFlag) {
      this.loading = true;
      this.menuActived = item.id;
      this.iframeUrl = item.url;
      this.headTitle = item.name;
      this.goBackFlag = goBackFlag;
      this.closeLoading();
    },
    closeLoading() {
      this.timer = null;
      this.timer = setTimeout(() => {
        this.loading = false;
      }, 1000);
    },
  },
};
</script>

<style scoped>
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}
</style>

<style lang="scss">
// fix css style bug in open el-dialog
.el-popup-parent--hidden {
  .fixed-header {
    padding-right: 15px;
  }
}
</style>
