<template>
  <div class="dashboard-container">
    <div class="container">
      <div class="tableBar" style="display: inline-block">
        <el-button
          type="primary"
          class="continue"
          @click="addClass('class')"
        >
          + 新增菜品分类
        </el-button>
        <el-button
          type="primary"
          @click="addClass('meal')"
        >
          + 新增套餐分类
        </el-button>
      </div>
      <el-table
        :data="tableData"
        stripe
        class="tableBox"
      >
        <el-table-column
          prop="name"
          label="分类名称"
        /></el-table-column>
        <el-table-column
          prop="type"
          label="分类类型"
        >
          <template slot-scope="scope">
            <span>{{ scope.row.type == '1' ? '菜品分类': '套餐分类' }}</span>
          </template>
        </el-table-column>
        <el-table-column
          prop="updateTime"
          label="操作时间"
        >
        <template slot-scope="scope">
         {{scope.row.updateTime}}
        </template>
        </el-table-column>
        <el-table-column
          prop="sort"
          label="排序"
        /></el-table-column>
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
              @click="editHandle(scope.row)"
            >
              修改
            </el-button>
            <el-button
              type="text"
              size="small"
              class="delBut non"
              @click="deleteHandle(scope.row.id)"
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
    <el-dialog
      :title="classData.title"
      :visible.sync="classData.dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form
        class="demo-form-inline"
        label-width="100px"
      >
        <el-form-item label="分类名称：">
          <el-input
            v-model="classData.name"
            placeholder="请输入分类名称"
            maxlength="14"
          />
        </el-form-item>
        <el-form-item label="排序：">
          <el-input v-model="classData.sort"  type="number" placeholder="请输入排序" />
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-button
          size="medium"
          @click="classData.dialogVisible = false"
        >取 消</el-button>
        <el-button
          type="primary"
          size="medium"
          @click="submitForm()"
        >确 定</el-button>
        <el-button
          v-if="action != 'edit'"
          type="primary"
          size="medium"
          class="continue"
          @click="submitForm('go')"
        > 保存并继续添加 </el-button>
      </span>
    </el-dialog>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { getCategoryPage, deleCategory, addCategory, editCategory } from "@/api/category";
import Pagination from "@/components/Pagination";

export default {
  name: 'Category',
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
      action: '',
      counts: 0,
      page: 1,
      pageSize: 10,
      tableData: [],
      type: '',
      classData: {
        'title': '添加菜品分类',
        'dialogVisible': false,
        'categoryId': '',
        'name': '',
        'sort': ''
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    async init() {
      await getCategoryPage({'page': this.page, 'pageSize': this.pageSize}).then(res => {
        this.tableData = res.data.records
        this.counts = Number(res.data.total)
      })
    },
    handleQuery() {
      this.page = 1;
      this.init();
    },
    // 添加
    addClass(st) {
      if (st == 'class') {
        this.classData.title = '新增菜品分类'
        this.type = '1'
      } else {
        this.classData.title = '新增套餐分类'
        this.type = '2'
      }
      this.action = 'add'
      this.classData.name = ''
      this.classData.sort = ''
      this.classData.dialogVisible = true
    },
    editHandle(dat) {
      this.classData.title = '修改分类'
      this.action = 'edit'
      this.classData.name = dat.name
      this.classData.sort = dat.sort
      this.classData.id = dat.id
      this.classData.dialogVisible = true
    },
    // 关闭弹窗
    handleClose(st) {
      this.classData.dialogVisible = false
    },
    //删除
    deleteHandle(id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        'confirmButtonText': '确定',
        'cancelButtonText': '取消',
        'type': 'warning'
      }).then(() => {
        deleCategory(id).then(res => {
          this.$message.success('删除成功！')
          this.handleQuery()
        })
      })
    },
    //数据提交
    submitForm(st) {
      const classData = this.classData
      const valid = (classData.name === 0 ||classData.name)  && (classData.sort === 0 || classData.sort)
      if (this.action === 'add') {
        if (valid) {
          const reg = /^\d+$/
          if (reg.test(classData.sort)) {
            addCategory({'name': classData.name,'type':this.type, sort: classData.sort}).then(res => {
              console.log(res)
              this.$message.success('分类添加成功！')
              if (!st) {
                this.classData.dialogVisible = false
              } else {
                this.classData.name = ''
                this.classData.sort = ''
              }
              this.handleQuery()
            })
          } else {
            this.$message.error('排序只能输入数字类型')
          }
        } else {
          this.$message.error('请输入分类名称或排序')
        }
      } else if (valid) {
        const reg = /^\d+$/
        if (reg.test(this.classData.sort)) {
          editCategory({'id':this.classData.id,'name': this.classData.name, sort: this.classData.sort}).then(res => {
            this.$message.success('分类修改成功！')
            this.classData.dialogVisible = false
            this.handleQuery()
          })
        } else {
          this.$message.error('排序只能输入数字类型')
        }
      } else {
        this.$message.error('请输入分类名称或排序')
      }
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
</style>
