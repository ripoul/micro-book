<template>
  <div>
    <md-snackbar :md-position="sb.position" :md-duration="sb.duration" :md-active.sync="sb.showSnackbar" md-persistent>
      <span>{{sb.error}}</span>
      <md-button class="md-primary" @click="sb.showSnackbar = false">Retry</md-button>
    </md-snackbar>
    <md-table v-model="livres" md-sort="id" md-sort-order="asc" md-card @md-selected="select">
      <md-table-toolbar>
        <h1 class="md-title">Livres</h1>
      </md-table-toolbar>

      <md-table-empty-state
        md-label="Aucun livre trouvé"
        :md-description="`Vous pouvez en ajouter un en cliquant sur le bouton ci-dessous.`"
      >
      </md-table-empty-state>

      <md-table-row slot="md-table-row" slot-scope="{ item }" md-selectable="single">
        <md-table-cell md-label="ID" md-numeric md-sort-by="id">{{item.id}}</md-table-cell>
        <md-table-cell md-label="TITRE" md-sort-by="titre">{{item.titre}}</md-table-cell>
        <md-table-cell md-label="AUTEUR" md-sort-by="auteur">{{item.auteur}}</md-table-cell>
        <md-table-cell md-label="RESUME" md-sort-by="resume">{{item.resume}}</md-table-cell>
        <md-table-cell md-label="QUANTITE" md-sort-by="quantite">{{item.quantite}}</md-table-cell>
        <md-table-cell md-label="GESTION DES EMPRUNTS">
          <img v-if="item.quantite != 0" class="borrow_icon" src="@/assets/borrow_book.png" @click.stop="borrow(item)" title="Emprunter un livre">
          <img v-else class="borrow_icon" src="@/assets/borrow_book.png" style="opacity: .4;">
          <span title="Gerer les emprunts"><font-awesome-icon icon="exchange-alt" size="2x" @click.stop="gererEmprunt(item)"/></span>
        </md-table-cell>
        <md-table-cell md-label="DELETE"><font-awesome-icon icon="trash" size="2x" @click.stop="deleteLivre(item)"/></md-table-cell>
      </md-table-row>
    </md-table>
    {{selected}}
    <md-button class="md-primary md-raised" @click="newBook">Ajouter un livre</md-button>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";
import { Livre } from "../model/livre.model";

export default Vue.extend({
  data() {
    return {
      selected: null,
      sb: {
        showSnackbar: false,
        position: 'left',
        duration: 4000,
        isInfinity: false,
        error:""
      }
    };
  },
  methods: {
    select(livre: Livre) {
      this.$router.push({
        name: "livreWithID",
        params: { livre, id: livre.id }
      });
    },
    newBook() {
      this.$router.push({name: "livre" });
    },
    borrow(livre: Livre){
      this.$router.push({
        name: "borrowBook",
        params: { livre, id: livre.id }
      });
    },
    deleteLivre(livre: Livre){
      const APILivre = "http://localhost:3002/api/v1/micro-book/livre";
      var headers = new Headers();
      headers.append("Content-Type", "application/json");
      var param = {	
        method: 'DELETE',	
        headers: headers,	
        mode: 'cors',	
        cache: 'default',
      };
      var body={
        id: livre.id
      };
      param.body=JSON.stringify(body);
      fetch(APILivre, param).then((response)=>{	
        return response.json();	
      }).then((res)=>{
        if(!res.success){
          throw res.data;
        }
        this.livres=res.data
      }).catch((error)=>{
        this.sb.error=error;
        this.sb.showSnackbar=true;
        console.log(error);
      });
    },
    gererEmprunt(livre: Livre){
      this.$router.push({
        name: "gererEmprunt",
        params: { livre, id: livre.id }
      });
    }
  },
  props: ["livres"]
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
/* li {
  display: inline-block;
  margin: 0 10px;
} */
a {
  color: #42b983;
}

[md-card] {
  margin: 2% 5%;
}

.greyedOut {
  -webkit-filter: grayscale(100%); /* Safari 6.0 - 9.0 */
  filter: grayscale(100%);
}
</style>
