<template>
  <div class="addBrand-container">
    <div class="container">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        :inline="true"
        label-width="180px"
        class="demo-ruleForm"
      >
        <div>
          <el-form-item label="菜品名称:" prop="name">
            <el-input v-model="ruleForm.name" placeholder="请填写菜品名称" maxlength="20" />
          </el-form-item>
          <el-form-item label="菜品分类:" prop="categoryId">
            <el-select v-model="ruleForm.categoryId" placeholder="请选择菜品分类">
              <el-option v-for="(item,index) in dishList" :key="index" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="菜品价格:" prop="price">
            <el-input v-model="ruleForm.price" placeholder="请设置菜品价格"/>
          </el-form-item>
        </div>
        <el-form-item label="口味做法配置:">
          <el-form-item style="width: 293px;">
            <div class="flavorBox">
              <span v-if="dishFlavors.length == 0" class="addBut" @click="addFlavore"> + 添加口味</span>
              <div v-if="dishFlavors.length != 0" class="flavor">
                <div class="title">
                  <span>口味名（3个字内）</span><span>口味标签（输入标签回车添加）</span>
                </div>
                <div class="cont">
                  <div v-for="(item, index) in dishFlavors"  :key="index" class="items" >
                    <div class="itTit">
                      <div class="selectInput">
                        <div>
                          <el-input
                            v-model="item.name"
                            type="text"
                            style="width: 100%"
                            placeholder="请输入口味"
                            @focus="selectFlavor(true,index)"
                            @blur="outSelect(false,index)"
                            @input="inputHandle(index)"
                          />
                        </div>
                        <div v-show="item.showOption" class="flavorSelect">
                          <span
                            v-for="(it, ind) in dishFlavorsData"
                            :key="ind"
                            class="items"
                            @click="checkOption(it,ind,index)"
                          >{{ it.name }}</span>
                          <span v-if="dishFlavorsData == []" class="none">无数据</span>
                        </div>
                      </div>
                    </div>
                    <div class="labItems" style="display: flex">
                      <span v-for="(it, ind) in item.value" :key="ind">
                        {{ it }} 
                        <i @click="delFlavorLabel(index, ind)">X</i></span>
                      <div
                        class="inputBox"
                        :style="inputStyle"
                        contenteditable="true"
                        @focus="flavorPosition(index)"
                        @keydown.enter="(val)=>keyDownHandle(val,index)"
                      ></div>
                    </div>
                    <span class="delFlavor delBut non" @click="delFlavor(index)">删除</span>
                  </div>
                </div>
                <div class="addBut" @click="addFlavore">添加口味</div>
              </div>
            </div>
          </el-form-item>
        </el-form-item>
        <div>
        </div>
        <div>
          <el-form-item  label="菜品图片:" prop="region"  class="uploadImg">
            <el-upload
              class="avatar-uploader"
              action="/common/upload"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :on-change="onChange"
              ref="upload"
            >
              <img v-if="imageUrl" :src="imageUrl" class="avatar"></img>
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </div>
        <div class="address">
          <el-form-item label="菜品描述:" prop="region" >
            <el-input
              v-model="ruleForm.description"
              type="textarea"
              :rows="3"
              placeholder="菜品描述，最长200字"
              maxlength="200"
            />
          </el-form-item>
        </div>
        <div class="subBox address">
          <el-form-item>
            <el-button @click="goBack()">取消</el-button>
            <el-button  type="primary"  @click="submitForm('ruleForm')">保存</el-button>
            <el-button
              v-if="!isEdit"
              type="primary"
              class="continue"
              @click="submitForm('ruleForm','goAnd')"
            >
              保存并继续添加菜品
            </el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { queryDishById, getCategoryList, addDish, editDish } from "@/api/dish";
const temRuleForm = {
  'name': '',
  'id': '',
  'price': '',
  'code': '',
  'image': '',
  'description': '',
  'dishFlavors': [],
  'status': true,
  categoryId: ''
};
 
export default {
  name: "FoodForm",
  data() {
    const checkPrice = (rules, value, callback) => {
      if (!value) {
        callback(new Error('请填写菜品价格'))
      } else {
        // const reg = /^\d+(\.\d{0,2})?$/
        const reg = /^\d+$/
        if (reg.test(value)) {
          if (value < 10000) {
            callback()
          } else {
            callback(new Error('菜品价格小于10000'))
          }
        } else {
          callback(new Error('菜品价格格式只能为整数'))
        }
      }
    }
    return {
      // id: '',
      restKey: 0,
      textarea: '',
      value: '',
      imageUrl: '',
      actionType: '',
      dishList: [],
      dishFlavorsData: [],
      dishFlavors: [],
      vueRest: '1',
      index: 0,
      inputStyle: { 'flex': 1 },
      ruleForm: JSON.parse(JSON.stringify(temRuleForm)),
      rules: {
        'name': [{ 'required': true, 'message': '请填写菜品名称', 'trigger': 'blur' }],
        'categoryId': [{ 'required': true, 'message': '请选择菜品分类', 'trigger': 'change' }],
        'price': [{ 'required': true, validator: checkPrice, 'trigger': 'blur' }],
      },
      mak: false
    }
  },
  computed: {
    isEdit() {
      return !!this.$route.params.id;
    },
    id() {
      return this.$route.params.id;
    },
  },
  created() {
    // 获取菜品分类
    this.getDishList()
    // 获取口味数据
    this.getFlavorListHand()
    this.init()
  },
  methods: {
    async init() {
      if (this.isEdit) {
        queryDishById(this.id).then(res => {
          this.ruleForm = { ...res.data }
          // console.log(this.ruleForm)
          this.dishFlavors = res.data.flavors.map(obj => ({ ...obj, value: JSON.parse(obj.value),showOption: false }))
          console.log('this.dishFlavors',this.dishFlavors)
          this.imageUrl = `/common/download?name=${res.data.image}`
        })
      }
    },
    // 按钮 - 添加口味
    addFlavore() {
      this.dishFlavors.push({'name': '', 'value': [], showOption: false}) // JSON.parse(JSON.stringify(this.dishFlavorsData))
    },

    // 按钮 - 删除口味
    delFlavor(ind) {
      this.dishFlavors.splice(ind, 1)
    },

    // 按钮 - 删除口味标签
    delFlavorLabel(index, ind) {
      this.dishFlavors[index].value.splice(ind, 1)
    },

    // 口味顺序
    flavorPosition(index) {
      this.index = index
    },

    // 添加口味标签
    keyDownHandle(val,index) {
      if (val.target.innerText.trim() != '') {
        this.dishFlavors[index].value.push(val.target.innerText)
        val.target.innerText = ''
      }
    },

    // 获取菜品分类
    getDishList() {
      getCategoryList({ 'type': 1 }).then(res => {
        this.dishList = res.data
      })
    },

    // 获取口味列表
    getFlavorListHand() {
      this.dishFlavorsData = [
        {'name':'甜味','value':['无糖','少糖','半糖','多糖','全糖']},
        {'name':'温度','value':['热饮','常温','去冰','少冰','多冰']},
        {'name':'忌口','value':['不要葱','不要蒜','不要香菜','不要辣']},
        {'name':'辣度','value':['不辣','微辣','中辣','重辣']}
      ]
    },

    selectFlavor(st,index) {
      const obj = JSON.parse(JSON.stringify(this.dishFlavors[index]))
      obj.showOption = st
      this.dishFlavors.splice(index,1,obj)
    },

    outSelect(st,index) {
      const _this = this
      setTimeout(()=> {
        const obj = JSON.parse(JSON.stringify(_this.dishFlavors[index]))
        obj.showOption = st
        this.dishFlavors.splice(index,1,obj)
      }, 200)
    },

    checkOption(val, ind, index) {
      this.selectHandle(val.name, index, ind)
      this.dishFlavors[index].name = val.name
    },

    selectHandle(val, key, ind) {
      const arrDate = [...this.dishFlavors]
      arrDate[key] = JSON.parse(JSON.stringify(this.dishFlavorsData[ind]))
      this.dishFlavors = arrDate
    },

    submitForm(formName, st) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          let params = {...this.ruleForm}
          params.status = this.ruleForm ? 1 : 0
          params.categoryId = this.ruleForm.categoryId
          params.flavors = this.dishFlavors.map(obj => ({ ...obj, value: JSON.stringify(obj.value) }))
          delete params.dishFlavors
          if (!this.imageUrl) {
            this.$message.error('请上传菜品图片')
            return
          }
          if (!this.isEdit) {
            delete params.id
            addDish(params).then(res => {
              this.$message.success('菜品添加成功！')
              if (!st) {
                this.goBack()
              } else {
                this.dishFlavors = []
                this.imageUrl = ''
                this.ruleForm = JSON.parse(JSON.stringify(temRuleForm));
              }
            })
          } else {
            // delete params.updateTime
            editDish(params).then(res => {
              this.$message.success('菜品修改成功！')
              this.goBack()
            })
          }
        } else {
          return false
        }
      })
    },

    handleAvatarSuccess(response, file, fileList) {
    // 拼接down接口预览
      this.imageUrl = `/common/download?name=${response.data}`
      this.ruleForm.image = response.data
    },

    onChange(file) {
      if (file) {
        const suffix = file.name.split('.')[1]
        const size = file.size / 1024 / 1024 < 2
        if (['png','jpeg','jpg'].indexOf(suffix) < 0) {
          this.$message.error('上传图片只支持 png、jpeg、jpg 格式！')
          this.$refs.upload.clearFiles()
          return false
        }
        if (!size) {
          this.$message.error('上传文件大小不能超过 2MB!')
          return false
        }
        return file
      }
    },
    goBack() {
      this.$router.push({ name: "Meun" });
    }
  }
};
</script>

<style lang="scss" scoped>
.addBrand-container .avatar-uploader .el-upload {
border: 1px dashed #d9d9d9;
border-radius: 6px;
cursor: pointer;
position: relative;
overflow: hidden;
}
.addBrand-container .avatar-uploader .el-upload:hover {
border-color: #409eff;
}
.addBrand-container .avatar-uploader-icon {
font-size: 28px;
color: #8c939d;
width: 200px;
height: 160px;
line-height: 160px;
text-align: center;
}
.addBrand-container .avatar {
width: 160px;
height: 160px;
display: block;
}
.el-form-item__content {
width: 293px;
}
.addBrand-container .el-input {
    width: 293px;
}
.el-input--suffix .el-input__inner {
    padding-right: 30px;
}
.addBrand-container {
margin: 30px;
}
.addBrand-container .container {
position: relative;
z-index: 1;
background: #fff;
padding: 30px;
border-radius: 4px;
min-height: 500px;
}
.addBrand-container .container .subBox {
padding-top: 30px;
text-align: center;
border-top: solid 1px #f3f4f7;
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
.flavorBox {
    max-width: 777px;
    width: 600px;
//   width: 777px;
}
.flavorBox .addBut {
background: #ffc200;
display: inline-block;
padding: 0px 20px;
border-radius: 3px;
line-height: 40px;
cursor: pointer;
border-radius: 4px;
color: #333333;
font-weight: 500;
}
.flavorBox .flavor {
border: solid 1px #dfe2e8;
border-radius: 3px;
padding: 15px;
background: #fafafb;
}
.flavorBox .flavor .title {
color: #606168;
}
.flavorBox .flavor .cont .items {
display: flex;
margin: 10px 0;
}
.flavorBox .flavor .cont .items .itTit {
width: 150px;
margin-right: 15px;
}
.flavorBox .flavor .cont .items .itTit input {
width: 100%;
line-height: 40px;
border-radius: 3px;
padding: 0 10px;
}
.flavorBox .flavor .cont .items .labItems {
flex: 1;
display: flex;
flex-wrap: wrap;
border-radius: 3px;
min-height: 39px;
border: solid 1px #d8dde3;
background: #fff;
padding: 0 5px;
}
.flavorBox .flavor .cont .items .labItems span {
display: inline-block;
color: #f19c59;
margin: 5px;
line-height: 26px;
height: 26px;
padding: 0 10px;
background: #fdf4eb;
border-radius: 3px;
border: solid 1px #fae2cd;
}
.flavorBox .flavor .cont .items .labItems span i {
cursor: pointer;
font-style: normal;
}
.flavorBox .flavor .cont .items .labItems .inputBox {
display: inline-block;
width: 100%;
height: 36px;
line-height: 36px;
overflow: hidden;
}
.flavorBox .flavor .cont .items .delFlavor {
display: inline-block;
padding: 0 10px;
color: #f19c59;
cursor: pointer;
}

.addBrand-container .address .el-form-item__content {
width: 777px !important;
}

.el-button--text {
font-weight: 400 !important;
font-size: 13px !important;
}

.el-table td {
font-size: 13px !important;
}

.el-table .cell,
.el-table th div,
.el-table--border td:first-child .cell,
.el-table--border th:first-child .cell {
padding-left: 12px;
}
.avatar-uploader .el-upload {
    border: dashed 2px #d8dde3 !important;
    border-radius: 4px !important;
    background: #fcfcfc;
}
.el-upload {
    display: inline-block;
    text-align: center;
    cursor: pointer;
    outline: 0;
}

</style>
