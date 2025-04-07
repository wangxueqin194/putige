<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar">
        <el-input
          v-model="input"
          placeholder="请输入菜品名称"
          style="width: 250px"
          clearable
          @keyup.enter.native="handleQuery"
        >
          <i
            slot="prefix"
            class="el-input__icon el-icon-search"
            style="cursor: pointer"
            @click="init"
          ></i>
        </el-input>
        <div class="tableLab">
          <span class="span-btn delBut non" @click="deleteHandle('批量', null)">批量删除</span>
          <span class="span-btn blueBug non" @click="statusHandle('1')">批量启售</span>
          <span style="border:none;" class="span-btn delBut non" @click="statusHandle('0')">批量停售</span>
          <el-button type="primary" @click="addFoodtype('add')">+ 新建菜品</el-button>
        </div>
      </div>
      <el-table
        :data="tableData"
        stripe
        class="tableBox"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="25"
        ></el-table-column>
        <el-table-column
          prop="name"
          label="菜品名称"
        ></el-table-column>
        <el-table-column prop="image" label="图片" align="center">
          <template slot-scope="{ row }">
            <el-image style="width: auto; height: 40px; border:none;cursor: pointer;" 
            :src="getImage(row.image)" 
            :preview-src-list="[ `/common/download?name=${row.image}` ]" >
            <div slot="error" class="image-slot">
              <img src="@/assets/login-logo.png"  style="width: auto; height: 40px; border:none;" >
            </div>
          </el-image>
          </template>
        </el-table-column>
        <el-table-column
          prop="categoryName"
          label="菜品分类"
        ></el-table-column>
        <el-table-column label="售价">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">￥{{ scope.row.price }}</span>
          </template>
        </el-table-column>
        <el-table-column label="售卖状态">
          <template slot-scope="scope">
            <span style="margin-right: 10px;">{{ scope.row.status == '0' ? '停售' : '启售' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="最后操作时间"
        >
        </el-table-column>
        <el-table-column
          label="操作"
          width="160"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              class="blueBug"
              @click="addFoodtype(scope.row.id)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              class="blueBug"
              @click="statusHandle(scope.row)"
            >
              {{ scope.row.status == '0' ? '启售' : '停售' }}
            </el-button>
            <el-button
              type="text"
              size="small"
              class="delBut non"
              @click="deleteHandle('单删', scope.row.id)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <pagination
        :currentpage="page"
        :total="counts"
        :pagesize="pageSize"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"/>
    </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getDishPage, deleteDish, dishStatusByStatus} from "@/api/dish";
import Pagination from "@/components/Pagination";

export default {
  name: 'Menu',
  components: {
    Pagination,
  },
  computed: {
    ...mapGetters([
      'name'
    ])
  },
  data() {
    return {
      input: '',
      counts: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      dishState: '',
      checkList: []
    }
  },
  created() {
    this.init()
  },
  mounted() {
  },
  methods: {
    async init() {
      const params = {
        page: this.page,
        pageSize: this.pageSize,
        name: this.input ? this.input : undefined
      }
      await getDishPage(params).then(res => {
        this.tableData = res.data.records || []
        this.counts = res.data.total
      })
    },
    getImage(image) {
      // return `/common/download?name=${image}`
      return `http://119.27.181.89:8080/common/download?name=${image}`
    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    // 添加
    addFoodtype(st) {
      if (st === 'add') {
        this.$router.push({ name: "addFood" });
      } else {
        this.$router.push({ name: "editFood" , params: { id: st }});
      }
    },

    // 删除
    deleteHandle(type, id) {
      if (type === '批量' && id === null) {
        if (this.checkList.length === 0) {
          return this.$message.error('请选择删除对象')
        }
      }
      this.$confirm('确认删除该菜品, 是否继续?', '确定删除', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
      }).then(() => {
        deleteDish(type === '批量' ? this.checkList.join(',') : id).then(res => {
          this.$message.success('删除成功！')
          this.handleQuery()
        })
      })
    },

    //状态更改
    statusHandle(row) {
      let params = {}
      if (typeof row === 'string' ) {
        if (this.checkList.length === 0) {
          this.$message.error('批量操作，请先勾选操作菜品！')
          return false
        }
        params.id = this.checkList.join(',')
        params.status = row
      } else {
        params.id = row.id
        params.status = row.status ? '0' : '1'
      }
      this.dishState = params
      this.$confirm('确认更改该菜品状态?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        // 起售停售---批量起售停售接口
        dishStatusByStatus(this.dishState).then(res => {
          this.$message.success('菜品状态已经更改成功！')
          this.handleQuery()
        })
      })
    },

    // 全部操作
    handleSelectionChange(val) {
      let checkArr = []
      val.forEach((n) => {
        checkArr.push(n.id)
      })
      this.checkList = checkArr
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },
    handleCurrentChange(val) {
      this.page = val
      this.init()
    }
  }
}
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
.dashboard-container .container .tableBar {
    display: flex;
    margin-bottom: 20px;
    justify-content: space-between;
}
.dashboard-container .container .tableLab .span-btn {
    cursor: pointer;
    display: inline-block;
    font-size: 14px;
    padding: 0 20px;
    color: #818693;
    border-right: solid 1px #d8dde3;
}
.selectInput {
  position: relative;
  width: 100%;
  min-width: 100px;
}
.selectInput .flavorSelect {
  position: absolute;
  width: 100%;
  padding: 0 10px;
  border-radius: 3px;
  border: solid 1px #FF903D;
  line-height: 30px;
  text-align: center;
  background: #fff;
  top: 50px;
  z-index: 99;
}
.selectInput .flavorSelect .items {
  cursor: pointer;
  display: inline-block;
  width: 100%;
  line-height: 35px;
  border-bottom: solid 1px #f4f4f4;
  color: #666;
}
.selectInput .flavorSelect .none {
  font-size: 14px;
}

#food-add-app .uploadImg .el-form-item__label::before{
  content: '*';
  color: #F56C6C;
  margin-right: 4px;
}
</style>
