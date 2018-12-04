<template>
  <div class="home">
    <md-snackbar :md-position="sb.position" :md-duration="sb.duration" :md-active.sync="sb.showSnackbar" md-persistent>
      <span>{{sb.error}}</span>
      <md-button class="md-primary" @click="sb.showSnackbar = false">Retry</md-button>
    </md-snackbar>
    <h1>Micro Book</h1>
    <LivreList v-bind:livres="livres"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import LivreList from "@/components/LivreList.vue"; // @ is an alias to /src
import { Livre } from "../model/livre.model";
import axios, { AxiosResponse } from "axios";

@Component({
  components: {
    LivreList
  },
  data() {
    return { 
      livres: [],
      sb: {
        showSnackbar: false,
        position: 'left',
        duration: 4000,
        isInfinity: false,
        error:""
      }
    };
  },
  created() {
    const APILivre = "http://localhost:3002/api/v1/micro-book/livre";
    var headers = new Headers();
    var param = {	
      method: 'GET',	
      headers: headers,	
      mode: 'cors',	
      cache: 'default'
    };
    fetch(APILivre, param).then((response)=>{	
      return response.json();	
    }).then((res)=>{
      if(!res.success){
        throw res.data;
      }
      this.livres = res.data;
    }).catch((error)=>{
      this.sb.error=error;
      this.sb.showSnackbar=true;
      console.log(error);
    });
  }
})
export default class Home extends Vue {}
</script>
