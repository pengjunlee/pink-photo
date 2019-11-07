<template>
  <div class="login-container">
    <vue-particles
      color="#dedede"
      :particleOpacity="0.7"
      :particlesNumber="80"
      shapeType="circle"
      :particleSize="4"
      linesColor="#dedede"
      :linesWidth="1"
      :lineLinked="true"
      :lineOpacity="0.4"
      :linesDistance="150"
      :moveSpeed="3"
      :hoverEffect="true"
      hoverMode="grab"
      :clickEffect="true"
      clickMode="push"
    ></vue-particles>
    <div class="login-wrap">
      <el-form
        ref="loginForm"
        :model="loginForm"
        :rules="loginRules"
        class="login-form"
        autocomplete="on"
        label-position="left"
      >
        <div class="form">
          <div class="title-container">
            <h3 class="title">情报中心数据管理平台</h3>
          </div>

          <el-form-item prop="username">
            <span class="svg-container">
              <svg-icon icon-class="user" />
            </span>
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="登录账号"
              name="username"
              type="text"
              tabindex="1"
              autocomplete="on"
            />
          </el-form-item>

          <el-tooltip v-model="capsTooltip" content="Caps lock is On" placement="right" manual>
            <el-form-item prop="password">
              <span class="svg-container">
                <svg-icon icon-class="password" />
              </span>
              <el-input
                :key="passwordType"
                ref="password"
                v-model="loginForm.password"
                :type="passwordType"
                placeholder="密码"
                name="password"
                tabindex="2"
                autocomplete="on"
                @keyup.native="checkCapslock"
                @blur="capsTooltip = false"
                @keyup.enter.native="handleLogin"
              />
              <span class="show-pwd" @click="showPwd">
                <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
              </span>
            </el-form-item>
          </el-tooltip>
          <div>
            <el-form-item prop="verifycode" style="width:370px;display: inline-block;">
              <span class="svg-container">
                <svg-icon icon-class="verifycode" />
              </span>
              <el-input
                ref="verifycode"
                v-model="loginForm.verifycode"
                placeholder="验证码"
                name="verifycode"
                type="text"
                tabindex="1"
                autocomplete="on"
              />
            </el-form-item>
            <img
              id="verifyimg"
              style="float:right;width:100px;height:50px;padding:5px 10px;"
              @click="getVerifycode"
            />
          </div>

          <el-button
            :loading="loading"
            type="primary"
            style="width:100%;margin-bottom:30px;"
            @click.native.prevent="handleLogin"
          >立即登录</el-button>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import { verifycode } from "@/api/login";

export default {
  name: "Login",
  data() {
    const validateUsername = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请输入登录账号"));
      } else if (value.length > 20) {
        callback(new Error("登录账号格式不正确"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请输入密码"));
      } else if (value.length > 30) {
        callback(new Error("密码格式不正确"));
      } else {
        callback();
      }
    };
    const validateVerifycode = (rule, value, callback) => {
      if (value.length == 0) {
        callback(new Error("请输入验证码"));
      } else if (value.length !=4) {
        callback(new Error("验证码格式不正确"));
      } else {
        if (value.toLowerCase() != this.verifycode.toLowerCase()) {
          callback(new Error("验证码不正确"));
        } else {
          callback();
        }
      }
    };
    return {
      loginForm: {
        username: "admin",
        password: "111111",
        verifycode: ""
      },
      loginRules: {
        username: [
          { required: true, trigger: "blur", validator: validateUsername }
        ],
        password: [
          { required: true, trigger: "blur", validator: validatePassword }
        ],
        verifycode: [
          { required: true, trigger: "blur", validator: validateVerifycode }
        ]
      },
      verifycode: "",
      passwordType: "password",
      capsTooltip: false,
      loading: false,
      redirect: undefined,
      otherQuery: {}
    };
  },
  watch: {
    $route: {
      handler: function(route) {
        const query = route.query;
        if (query) {
          this.redirect = query.redirect;
          this.otherQuery = this.getOtherQuery(query);
        }
      },
      immediate: true
    }
  },
  created() {
    this.getVerifycode();
  },
  mounted() {
    if (this.loginForm.username === "") {
      this.$refs.username.focus();
    } else if (this.loginForm.password === "") {
      this.$refs.password.focus();
    }
  },
  destroyed() {},
  computed: {},
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= "a" && key <= "z")) ||
          (!shiftKey && (key >= "A" && key <= "Z"))
        ) {
          this.capsTooltip = true;
        } else {
          this.capsTooltip = false;
        }
      }
      if (key === "CapsLock" && this.capsTooltip === true) {
        this.capsTooltip = false;
      }
    },
    showPwd() {
      if (this.passwordType === "password") {
        this.passwordType = "";
      } else {
        this.passwordType = "password";
      }
      this.$nextTick(() => {
        this.$refs.password.focus();
      });
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          this.$store
            .dispatch("user/login", this.loginForm)
            .then(() => {
              this.$router.push({
                path: this.redirect || "/",
                query: this.otherQuery
              });
              this.loading = false;
            })
            .catch(() => {
              this.loading = false;
            });
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== "redirect") {
          acc[cur] = query[cur];
        }
        return acc;
      }, {});
    },
    getVerifycode() {
      verifycode().then(response => {
        console.log(response.data);
        if (response.data) {
          document.getElementById("verifyimg").src = response.data.baseImg;
          this.verifycode = response.data.code;
        }
      });
    }
  }
};
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

@supports (-webkit-mask: none) and (not (cater-color: #fff)) {
  .login-container .el-input input {
    color: #fff;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: #fff;
      height: 47px;
      caret-color: #fff;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #141a48 inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
  }
}
</style>

<style lang="scss" scoped>
$dark_gray: #889aa4;
$light_gray: #eee;

.login-container {
  height: 100%;
  width: 100%;
  background-color: #141a48;
  overflow: hidden;
}

.login-wrap {
  position: absolute;
  left: 50%;
  top: 50%;
  width: 800px;
  height: 626px;
  margin-left: -400px;
  margin-top: -363px;
  padding-top: 100px;
  font-family: "微软雅黑", Regular, "Helvetica Neue", Helvetica, Microsoft Yahei,
    Hiragino Sans GB, WenQuanYi Micro Hei, sans-serif;
  font-size: 16px;
}

.login-wrap .login-form {
  width: 500px;
  height: 346px;
  margin: 0 auto;
}

.tips {
  font-size: 14px;
  color: #fff;
  margin-bottom: 10px;

  span {
    &:first-of-type {
      margin-right: 16px;
    }
  }
}

.svg-container {
  padding: 6px 5px 6px 15px;
  color: $dark_gray;
  vertical-align: middle;
  width: 30px;
  display: inline-block;
}

.title-container {
  position: relative;

  .title {
    font-size: 26px;
    color: $light_gray;
    margin: 0px auto 40px auto;
    text-align: center;
    font-weight: bold;
  }
}

.show-pwd {
  position: absolute;
  right: 10px;
  top: 7px;
  font-size: 16px;
  color: $dark_gray;
  cursor: pointer;
  user-select: none;
}

.thirdparty-button {
  position: absolute;
  right: 0;
  bottom: 6px;
}

@media only screen and (max-width: 470px) {
  .thirdparty-button {
    display: none;
  }
}
</style>
