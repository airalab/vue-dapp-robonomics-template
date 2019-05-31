<template>
  <div id="app">
    <web3-check>
      <div>
        <Page v-if="ready"/>
        <div v-else>Initialization Robonomics</div>
      </div>
    </web3-check>
  </div>
</template>

<script>
import Vue from "vue";
import Web3Check from "vue-web3-check";
import Page from "./components/Page";
import { initRobonomics } from "./utils/robonomics";
import getIpfs from "./utils/ipfs";

export default {
  name: "app",
  components: {
    Page
  },
  data() {
    return {
      ready: false
    };
  },
  mounted() {
    Web3Check.store.on("load", () => {
      getIpfs().then(ipfs => {
        Vue.prototype.$robonomics = initRobonomics(ipfs);
        this.$robonomics.ready().then(() => {
          this.ready = true;
        });
      });
    });
  }
};
</script>
