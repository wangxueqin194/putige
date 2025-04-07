<template>
  <div class="dashboard-container">
    <div class="container">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :inline="false"
        label-width="180px"
        class="demo-ruleForm"
      >
        <el-form-item label="账号:" prop="username">
          <el-input
            v-model="ruleForm.username"
            placeholder="请输入账号"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="员工姓名:" prop="name">
          <el-input
            v-model="ruleForm.name"
            placeholder="请输入员工姓名"
            maxlength="20"
          />
        </el-form-item>

        <el-form-item label="手机号:" prop="phone">
          <el-input
            v-model="ruleForm.phone"
            placeholder="请输入手机号"
            maxlength="20"
          />
        </el-form-item>
        <el-form-item label="性别:" prop="sex">
          <el-radio-group v-model="ruleForm.sex">
            <el-radio label="0">男</el-radio>
            <el-radio label="1">女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="身份证号:" prop="idNumber">
          <el-input
            v-model="ruleForm.idNumber"
            placeholder="请输入身份证号"
            maxlength="20"
          />
        </el-form-item>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack()"> 取消 </el-button>
            <el-button type="primary" @click="submitForm('ruleForm', false)">
              保存
            </el-button>
            <el-button
              v-if="!isEdit"
              type="primary"
              class="continue"
              @click="submitForm('ruleForm', true)"
            >
              保存并继续添加
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { addEmployee, editEmployee, queryEmployeeById } from "@/api/member";
import { isCellPhone } from "@/utils/validate";
const temRuleForm = {
  username: "",
  name: "",
  phone: "",
  sex: "0",
  idNumber: "",
};

export default {
  name: "Users",
  data() {
    const checkUserName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入账号"));
      } else if (value.length > 20 || value.length < 3) {
        callback(new Error("账号长度应该是3-20"));
      } else {
        callback();
      }
    };
    const checkName = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入姓名"));
      } else if (value.length > 12) {
        callback(new Error("账号长度应该是1-12"));
      } else {
        callback();
      }
    };
    const checkPhone = (rule, value, callback) => {
      if (value == "") {
        callback(new Error("请输入手机号"));
      } else if (!isCellPhone(value)) {
        callback(new Error("请输入正确的手机号!"));
      } else {
        callback();
      }
    };

    const validID = (rule, value, callback) => {
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
      if (value == "") {
        callback(new Error("请输入身份证号码"));
      } else if (reg.test(value)) {
        callback();
      } else {
        callback(new Error("身份证号码不正确"));
      }
    };

    return {
      ruleForm: JSON.parse(JSON.stringify(temRuleForm)),
      rules: {
        username: [
          {
            required: true,
            validator: checkUserName,
            trigger: "blur",
          },
        ],
        name: [{ required: true, validator: checkName, trigger: "blur" }],
        phone: [{ required: true, validator: checkPhone, trigger: "blur" }],
        idNumber: [{ required: true, validator: validID, trigger: "blur" }],
      },
    };
  },
  created() {
    this.init();
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id;
    },
    id() {
      return this.$route.params.id;
    },
  },
  methods: {
    init() {
      if (this.isEdit) {
        queryEmployeeById(this.id).then((res) => {
          this.ruleForm = res.data;
        });
      }
    },
    isValidUsername(str) {
      return ["admin", "editor"].indexOf(str.trim()) >= 0;
    },

    submitForm(formName, st) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          if (!this.isEdit) {
            addEmployee(this.ruleForm).then((res) => {
              this.$message.success("员工添加成功！");
              if (!st) {
                this.goBack();
              } else {
                this.ruleForm = JSON.parse(JSON.stringify(temRuleForm));
              }
            });
          } else {
            editEmployee(this.ruleForm).then((res) => {
              this.$message.success("员工信息修改成功！");
              this.goBack();
            });
          }
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    goBack() {
      this.$router.push({ name: "Users" });
    },
  },
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 20px;
}
.dashboard-container .container {
  background: #fff;
  position: relative;
  z-index: 1;
  padding: 30px 28px;
  border-radius: 4px;
}
.dashboard-container .container .tableBar {
  display: flex;
  margin-bottom: 20px;
  justify-content: space-between;
}
.dashboard-container .container .tableBox {
  width: 100%;
  border: solid 2px #f3f4f7;
  border-radius: 2px;
}

.dashboard-container .container .tableBox .el-image img {
  width: 40px;
  border-radius: 5px;
}

.pageList {
  text-align: center;
  margin-top: 30px;
}

.dashboard-container .container .tableLab .span-btn {
  cursor: pointer;
  display: inline-block;
  font-size: 14px;
  padding: 0 20px;
  color: #818693;
  border-right: solid 1px #d8dde3;
}

.dashboard-container .container .tableLab .el-button {
  margin-left: 10px;
}

.el-table-column--selection .cell {
  padding-left: 10px;
}
</style>
