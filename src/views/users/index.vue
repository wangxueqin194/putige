<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-input
          v-model="input"
          placeholder="请输入员工姓名"
          style="width: 250px"
          clearable
          @keyup.enter.native="debouncedQuery"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-search"
            style="cursor: pointer"
            @click="debouncedQuery"
          ></i>
        </el-input>
        <el-button
          type="text"
          size="small"
          class="blueBug"
          style="color: black; background-color: #ffc200; border-color: #ffc200"
          @click="addMemberHandle('add')"
        >
          + 添加员工
        </el-button>
        <!--:class="{ notAdmin: user !== 'admin' }"-->
      </div>

      <el-table :data="tableData" stripe class="tableBox">
        <el-table-column prop="name" label="员工姓名"></el-table-column>
        <el-table-column prop="username" label="账号"></el-table-column>
        <el-table-column prop="phone" label="手机号"></el-table-column>
        <el-table-column label="账号状态">
          <template slot-scope="scope">
            {{ String(scope.row.status) === "0" ? "已禁用" : "正常" }}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="160" align="center">
          <template slot-scope="scope">
            <el-button
              @click="addMemberHandle(scope.row.id)"
              type="text"
              size="small"
              class="blueBug"
              :class="{ notAdmin: user !== 'admin' }"
            >
              编辑
            </el-button>
            <el-button
              type="text"
              size="small"
              class="delBut non"
              @click="statusHandle(scope.row)"
              v-if="user === 'admin'"
            >
              {{ scope.row.status == "1" ? "禁用" : "启用" }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <pagination v-show="counts>0" :total="counts" :currentpage="page" :limit="pageSize" @pagination="handleChange"/>

    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import { getMemberList, enableOrDisableEmployee } from "@/api/member";
import Pagination from "@/components/Pagination";
import { convertTimestamp } from "@/utils/convert-timestamp"
import { debounce } from 'lodash';

export default {
  name: "Users",
  components: {
    Pagination,
  },
  data() {
    return {
      input: "",
      counts: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      id: "",
      status: "",
    };
  },
  computed: {
    ...mapGetters(["name"]),
  },
  created() {
    this.init();
    if (localStorage.getItem("userInfo") != null) {
      this.user = JSON.parse(localStorage.getItem("userInfo")).username;
    }
    //添加防抖
    this.debouncedQuery = debounce(this.handleQuery, 300); // 300ms 防抖
    //测试时间戳转化
    // this.testTimestamp();
  },
  methods: {
    testTimestamp() {
      console.log('test')
      let timestamp = 1633072800000; // 示例时间戳
      let date = convertTimestamp(timestamp)
      console.log(date); // 输出本地化格式的日期和时间
    },
    async init() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined,
      };
      await getMemberList(params)
        .then((res) => {
          this.tableData = res.data.records || [];
          this.counts = res.data.total;
        })
    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    // 添加或编辑用户信息
    addMemberHandle(st) {
      if (st === "add") {
        this.$router.push({ name: "createUser" });
      } else {
        this.$router.push({ name: "editUser", params: { id: st }});
      }
    },
    //状态修改
    statusHandle(row) {
      this.id = row.id;
      this.status = row.status;
      this.$confirm("确认调整该账号的状态?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        enableOrDisableEmployee({ id: this.id, status: !this.status ? 1 : 0 })
          .then((res) => {
            console.log("enableOrDisableEmployee", res);
            this.$message.success("账号状态更改成功！");
            this.handleQuery();
          })
      });
    },
    handleChange(p) {
      this.page = p.page;
      this.pageSize = p.pageSize;
      this.init();
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;

  .container {
    background: #fff;
    position: relative;
    z-index: 1;
    padding: 30px 28px;
    border-radius: 4px;

    .tableBar {
      display: flex;
      margin-bottom: 20px;
      justify-content: space-between;

      el-form {
        width: 100%;
        display: flex;
        margin-bottom: 20px;
        justify-content: space-between;
      }
    }

    .tableBox {
      width: 100%;
      border: solid 2px #f3f4f7;
      border-radius: 2px;
    }
  }
}

.dashboard-container .container .pageList {
  text-align: center;
  margin-top: 30px;
}
</style>
