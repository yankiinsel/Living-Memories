<template>
  <div id="app">
     <!-- As a heading -->
    <b-navbar class="navbar border-primary border-bottom">
        <router-link to="/" tag="div">
        <img src="./assets/logo-transparent.png" class="logo" alt="beaver">
        </router-link>
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.0.13/css/all.css" integrity="sha384-DNOHZ68U8hZfKXOrtjWvjxusGo9WQnrNx2sqG0tfsghAvtVlRW3tvkXWZh58N9jp" crossorigin="anonymous">
        <div class="links">
          <router-link to="/">Home</router-link> |
          <router-link to="/post">Post</router-link> |
          <router-link v-if="!this.$session.exists()" to="/login">Log In</router-link>
          <router-link v-else to="/login">Sign out</router-link>
        </div>
    </b-navbar>
    <router-view/>
  </div>
</template>

<style scoped>

#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}


.links a {
  font-weight: bold;
  color: #e7edf3;
}

.links a.router-link-exact-active {
  color: #e6da70;
}


h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.navbar {
  background: #000000;
  height: 64px;
}

.links {
  text-align: right !important;
  display: block;
  align-self: right;
}

img.logo {
  height: 48px !important;
  display: block;
  margin-left: auto;
  margin-right: auto;
}
</style>
