<template>
  <div>
    <link
      href="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/css/bootstrap.min.css"
      rel="stylesheet"
      id="bootstrap-css"
    />
    <script
      type="application/javascript"
      src="//maxcdn.bootstrapcdn.com/bootstrap/4.1.1/js/bootstrap.min.js"
    ></script>
    <script
      type="application/javascript"
      src="//cdnjs.cloudflare.com/ajax/libs/jquery/3.2.1/jquery.min.js"
    ></script>
    <div class="container register">
      <div class="row">
        <div class="col-sm-3 register-left">
          <img src="../assets/téléchargement.png" alt="" />
          <h2 style="color:black"><b>Chat INSAT</b></h2>
          <h5 style="color:#0062CC ;">
            <b>Echangez vos mesages en toute securité !</b>
          </h5>
        </div>
        <div class="col-sm-9 register-right">
          <div class="tab-content">
            <div
              class="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div class="col-sm-8">
                <h2 class="register-heading">Connectez-vous</h2>
              </div>
              <div class="row register-form">
                <div class="col-sm-6 offset-sm-4">
                  <form @submit="login" method="post">
                    <div class="form-group">
                      <input
                        type="text"
                        placeholder="Pseudo *"
                        class="form-control"
                        name="pseudo"
                        v-model="input.pseudo"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="password"
                        placeholder="Password *"
                        class="form-control"
                        name="password"
                        v-model="input.password"
                      />
                    </div>

                    <button type="submit" class="btnRegister" value="login">
                      Login
                    </button>
                  </form>
                </div>
              </div>
              <div class="row " style="margin-top:-40px ;margin-bottom:50px">
                <div class="col-sm-6 offset-sm-4">
                  <p>
                    Vous n'avez pas de compte?<b>
                      <router-link style="color:black" to="/register">
                        Inscrivez-vous</router-link
                      ></b
                    >
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import { sign } from "../certif/certificateManager.js";
export default {
  name: "Login",
  data() {
    return {
      input: {
        pseudo: "",
        password: "",
      },
      LDAP_URL: "http://192.168.57.4:3000/auth/",
    };
  },
  methods: {
    login(e) {
      e.preventDefault();
      const { digestedMessage, signature } = sign();
      var request = {
        pseudo: this.input.pseudo,
        password: this.input.password,
        message: digestedMessage,
        signature: signature,
      };
      axios
        .post(this.LDAP_URL + "login", request)
        .then((response) => {
          let result = response.data;
          if (result.authenticated == true) {
            this.$emit("authenticated", result.authenticated);
            localStorage.setItem("username", this.input.pseudo);
            this.$router.replace({ name: "Users" });
          } else alert(result.message);
        })
        .catch(function(error) {
          console.log(error.response.data.message);
        });
    },
  },
};
</script>

<style>
.register {
  background: -webkit-linear-gradient(left, #ffffff, #ffffff);
  margin-top: 3%;
  padding: 3%;
}
.register-left {
  text-align: center;
  color: #fff;
  margin-top: 4%;
}
.register-left input {
  border: none;
  border-radius: 1.5rem;
  padding: 2%;
  width: 60%;
  background: #f8f9fa;
  font-weight: bold;
  color: #383d41;
  margin-top: 30%;
  margin-bottom: 3%;
  cursor: pointer;
}
.register-right {
  background: -webkit-linear-gradient(left, #b2ceed, #0062cc);
  border-top-left-radius: 10% 50%;
  border-bottom-left-radius: 10% 50%;
}
.register-left img {
  margin-top: 15%;
  margin-bottom: 5%;
  width: 25%;
  -webkit-animation: mover 2s infinite alternate;
  animation: mover 1s infinite alternate;
}
@-webkit-keyframes mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}
@keyframes mover {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-20px);
  }
}
.register-left p {
  font-weight: lighter;
  padding: 12%;
  margin-top: -9%;
}
.register .register-form {
  padding: 10%;
  margin-top: 10%;
}
.btnRegister {
  float: right;
  margin-top: 10%;
  border: none;
  border-radius: 1.5rem;
  padding: 2%;
  background: #0062cc;
  color: #fff;
  font-weight: 600;
  width: 50%;
  cursor: pointer;
}
.register .nav-tabs {
  margin-top: 3%;
  border: none;
  background: #0062cc;
  border-radius: 1.5rem;
  width: 28%;
  float: right;
}
.register .nav-tabs .nav-link {
  padding: 2%;
  height: 34px;
  font-weight: 600;
  color: #fff;
  border-top-right-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
}
.register .nav-tabs .nav-link:hover {
  border: none;
}
.register .nav-tabs .nav-link.active {
  width: 100px;
  color: #0062cc;
  border: 2px solid #0062cc;
  border-top-left-radius: 1.5rem;
  border-bottom-left-radius: 1.5rem;
}
.register-heading {
  text-align: center;
  margin-top: 8%;
  margin-bottom: -15%;
  color: #495057;
}
</style>
