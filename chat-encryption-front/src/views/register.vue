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
        <div class="col-md-3 register-left">
          <img src="../assets/téléchargement.png" alt="" />
          <h2 style="color: black"><b>Chat INSAT</b></h2>
          <h5 style="color: #0062cc">
            <b>Echangez vos mesages en toute securité !</b>
          </h5>
        </div>
        <div class="col-md-9 register-right">
          <div class="tab-content">
            <div
              class="tab-pane fade show active"
              id="home"
              role="tabpanel"
              aria-labelledby="home-tab"
            >
              <div class="col-md-8">
                <h2 class="register-heading">Saisissez vos informations</h2>
              </div>
              <div class="row register-form">
                <div class="col-md-6 offset-md-4">
                  <form @submit="register" method="post">
                    <div class="form-group">
                      <input
                        type="text"
                        placeholder="N° Carte Etudiant *"
                        class="form-control"
                        name="carteEtudiant"
                        v-model="input.carteEtudiant"
                      />
                    </div>
                    <div class="form-group">
                      <input
                        type="text"
                        placeholder="Full name *"
                        class="form-control"
                        name="fullname"
                        v-model="input.fullname"
                      />
                    </div>
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
                        type="email"
                        placeholder="Email *"
                        class="form-control"
                        name="email"
                        v-model="input.email"
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
                    <button type="submit" class="btnRegister" value="Register">
                      Register
                    </button>
                  </form>
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
import { CreateCertif } from "../certif/certificateManager.js";
// eslint-disable-next-line no-unused-vars
import axios from "axios";
export default {
  name: "Register",
  data() {
    return {
      input: {
        carteEtudiant: "",
        fullname: "",
        pseudo: "",
        email: "",
        password: "",
      },
      LDAP_URL: "http://192.168.57.4:3000/auth/",
    };
  },
  methods: {
    register(e) {
      const certif = CreateCertif();
      var request = {
        certificate: certif,
        fullname: this.input.fullname,
        pseudo: this.input.pseudo,
        email: this.input.email,
        password: this.input.password,
        carteEtudiant: this.input.carteEtudiant,
      };

      // eslint-disable-next-line no-unused-vars
      axios
        .post("http://192.168.57.4:3001/sign", { toSign: request.certificate })
        .then((response) => {
          request.certificate = response.data;
          localStorage.setItem("certificate", request.certificate);

          axios
            .post(this.LDAP_URL+"signup", request)
            .then((response) => {
              console.log(response);
            });
        });

      e.preventDefault();
      this.$router.replace({ name: "login" });
    },
  },
};
</script>



<style>
.register {
  background: -webkit-linear-gradient(left, #ffffff, #ffffff);
  margin-top: 1%;
  padding: 1%;
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
