<template>
  <div class="navbar">
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb class="breadcrumb-container" />

    <div class="right-menu">
      <div class="avatar-wrapper">{{ userInfo.name }}</div>
      <img
        src="@/assets/btn_close@2x.png"
        class="outLogin"
        alt="退出"
        @click="logout"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Breadcrumb from "@/components/Breadcrumb";
import Hamburger from "@/components/Hamburger";

export default {
  data() {
    return {
      userInfo: {
        name: "管理员",
      },
      headTitle: "员工管理",
      goBackFlag: false,
    };
  },
  components: {
    Breadcrumb,
    Hamburger,
  },
  computed: {
    ...mapGetters(["sidebar", "avatar"]),
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
    toggleSideBar() {
      this.$store.dispatch("app/toggleSideBar");
    },
    async logout() {
      await this.$store.dispatch("user/logout");
      this.$router.push(`/login?redirect=${this.$route.fullPath}`);
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

<style lang="scss" scoped>
.navbar {
  height: 64px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
}
.navbar .hamburger-container {
  line-height: 64px;
  height: 100%;
  float: left;
  padding: 0 15px;
  cursor: pointer;
  transition: background 0.3s;
  -webkit-tap-highlight-color: transparent;
}
.navbar .hamburger-container:hover {
  background: rgba(0, 0, 0, 0.025);
}
.navbar .breadcrumb-container {
  color: #333333;
  height: 64px;
  font-size: 16px;
  width: 300px;
  padding-left: 22px;
  line-height: 64px;
  font-weight: 700;
  // opacity: 0;
  float: left;
}
.navbar .right-menu {
  float: right;
  display: flex;
  margin-right: 34px;
  height: 100%;
  line-height: 64px;
  color: #333333;
  font-size: 14px;
}

.navbar .right-menu .logout {
  margin-left: 20px;
  width: 28px;
  font-size: 14px;
  color: #ffc200;
  cursor: pointer;
}

.navbar .right-menu img {
  margin-top: 20px;
  margin-left: 10px;
  width: 25px;
  height: 25px;
}
.navbar .right-menu .outLogin {
  cursor: pointer;
}
.navbar .right-menu:focus {
  outline: none;
}
.navbar .right-menu .right-menu-item {
  display: inline-block;
  padding: 0 8px;
  height: 100%;
  font-size: 18px;
  color: #5a5e66;
  vertical-align: text-bottom;
}
.navbar .right-menu .right-menu-item.hover-effect {
  cursor: pointer;
  transition: background 0.3s;
}
.navbar .right-menu .right-menu-item.hover-effect:hover {
  background: rgba(0, 0, 0, 0.025);
}
.navbar .right-menu .avatar-container {
  margin-right: 30px;
}
.navbar .right-menu .avatar-container .avatar-wrapper {
  margin-top: 5px;
  position: relative;
}
.navbar .right-menu .avatar-container .avatar-wrapper .user-avatar {
  cursor: pointer;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}
.navbar .right-menu .avatar-container .avatar-wrapper .el-icon-caret-bottom {
  cursor: pointer;
  position: absolute;
  right: -20px;
  top: 25px;
  font-size: 12px;
}

.navbar .head-lable {
  /* position: absolute; */
  /* background: #fff; */
  color: #333333;
  height: 64px;
  font-size: 16px;
  width: 300px;
  padding-left: 22px;
  line-height: 64px;
  font-weight: 700;
  /* top: 0px;
  left: 0px; */
  opacity: 0;
  float: left;
  animation: opacity 500ms ease-out 800ms forwards;
}
.navbar .head-lable .goBack {
  border-right: solid 1px #d8dde3;
  padding-right: 14px;
  margin-right: 14px;
  font-size: 16px;
  color: #333333;
  cursor: pointer;
  font-weight: 400;
}
.navbar .head-lable .goBack img {
  position: relative;
  top: 24px;
  margin-right: 5px;
  width: 18px;
  height: 18px;
  float: left;
}
@keyframes opacity {
  0% {
    opacity: 0;
    left: 80px;
  }
  100% {
    opacity: 1;
    left: 0;
  }
}

.logo {
  text-align: center;
  background-color: rgb(52, 55, 68);
  /* height: 100px;
  line-height: 100px;
  padding: 12px 5px; */
  padding: 46px 37px 67px 36px;
}

.img {
  display: inline-block;
}
</style>
