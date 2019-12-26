<template>
  <div>
    <div>
      Lighthouse:
      <a
        :href="`https://etherscan.io/address/${lighthouse.address}`"
        target="blank"
        >{{ lighthouse.name }}</a
      >
    </div>

    <div>
      Cost: {{ price | fromWei(9, "XRT") }} | Balance:
      <a
        :href="`https://etherscan.io/token/${token}?a=${account}`"
        target="blank"
        >{{ balance | fromWei(9, "XRT") }}</a
      >
      <span v-if="price > 0"
        >| Approved: {{ approveTrade | fromWei(9, "XRT") }}</span
      >
    </div>

    <button
      v-if="price > 0 && approveTrade < price"
      :disabled="loadingApprove || balance < price"
      @click="approve"
    >
      Approve
    </button>

    <button v-if="approveTrade >= price" @click="order">Order</button>

    <div v-if="liability">
      <h3>Liability</h3>
      <div class="block">
        <b>liability:</b>
        <a
          :href="`https://etherscan.io/address/${liability.address}`"
          target="_blank"
          >{{ liability.address }}</a
        >
        <br />
        <b>lighthouse:</b>
        <a
          :href="`https://etherscan.io/address/${liability.lighthouse}`"
          target="_blank"
          >{{ liability.lighthouse }}</a
        >
        <br />
        <b>worker:</b>
        <a
          :href="`https://etherscan.io/address/${liability.worker}`"
          target="_blank"
          >{{ liability.worker }}</a
        >
        <br />
        <b>model:</b>
        {{ liability.model }}
        <br />
        <b>objective:</b>
        {{ liability.objective }}
        <br />
        <b>token:</b>
        {{ liability.token }}
        <br />
        <b>cost:</b>
        {{ liability.cost }}
        <br />
        <b>promisee:</b>
        {{ liability.promisee }}
        <br />
        <b>promisor:</b>
        {{ liability.promisor }}
        <br />
        <div v-if="liability.result != ''">
          <b>Results:</b>
          <a
            :href="`https://ipfs.io/ipfs/${liability.result}`"
            target="_blank"
            >{{ liability.result }}</a
          >
          <span v-if="liability.check === true">+</span>
          <span v-else>-</span>
        </div>
        <div v-if="liability.result == ''">
          <b>Results:</b>
          <span>...</span>
        </div>
      </div>
    </div>

    <div v-if="demands.length > 0">
      <h3>Demands</h3>
      <div class="block" v-for="(item, i) in demands" :key="i">
        <b>sender:</b>
        {{ item.sender }}
        <br />
        <b>model:</b>
        {{ item.model }}
        <br />
        <b>objective:</b>
        {{ item.objective }}
        <br />
        <b>token:</b>
        {{ item.token }}
        <br />
        <b>cost:</b>
        {{ item.cost }}
        <br />
        <b>deadline:</b>
        {{ item.deadline }}
      </div>
    </div>

    <div v-if="offers.length > 0">
      <h3>Offers</h3>
      <div class="block" v-for="(item, i) in offers" :key="i">
        <b>sender:</b>
        {{ item.sender }}
        <br />
        <b>model:</b>
        {{ item.model }}
        <br />
        <b>objective:</b>
        {{ item.objective }}
        <br />
        <b>token:</b>
        {{ item.token }}
        <br />
        <b>cost:</b>
        {{ item.cost }}
        <br />
        <b>deadline:</b>
        {{ item.deadline }}
      </div>
    </div>
  </div>
</template>

<script>
import * as config from "../config";

export default {
  data() {
    return {
      lighthouse: {
        name: "",
        address: ""
      },
      account: "",
      price: config.PRICE,
      token: "",
      balance: 0,
      approveTrade: 0,
      loadingApprove: false,
      liability: null,
      demands: [],
      offers: []
    };
  },
  mounted() {
    this.lighthouse.name = this.$robonomics.lighthouse.name;
    this.lighthouse.address = this.$robonomics.lighthouse.address;
    this.account = this.$robonomics.account.address;
    this.token = this.$robonomics.xrt.address;
    this.$robonomics.onDemand(config.MODEL, msg => {
      const item = this.demands.find(item => item.signature === msg.signature);
      if (!item) {
        this.demands = [{ ...msg }, ...this.demands.slice(0, 10)];
      }
    });
    this.$robonomics.onOffer(config.MODEL, msg => {
      const item = this.offers.find(item => item.signature === msg.signature);
      if (!item) {
        this.offers = [{ ...msg }, ...this.offers.slice(0, 10)];
      }
    });
    this.$robonomics.onResult(msg => {
      if (this.liability !== null && msg.liability === this.liability.address) {
        this.setResult(msg.result, false);
      }
    });
    this.fetchBalance();
  },
  methods: {
    fetchBalance() {
      return this.$robonomics.xrt.methods
        .balanceOf(this.$robonomics.account.address)
        .call()
        .then(balanceOf => {
          this.balance = balanceOf;
          if (balanceOf > 0) {
            return this.$robonomics.xrt.methods
              .allowance(
                this.$robonomics.account.address,
                this.$robonomics.factory.address
              )
              .call();
          }
          return false;
        })
        .then(allowance => {
          if (allowance) {
            this.approveTrade = allowance;
          }
        });
    },
    approve() {
      this.loadingApprove = true;
      return this.$robonomics.xrt.methods
        .approve(this.$robonomics.factory.address, this.price)
        .send({
          from: this.$robonomics.account.address
        })
        .then(() => {
          this.loadingApprove = false;
          return this.fetchBalance();
        })
        .catch(() => {
          this.loadingApprove = false;
        });
    },
    setResult(result, check = true) {
      this.liability = {
        ...this.liability,
        result,
        check
      };
    },
    newLiability(liability) {
      console.log("liability demand", liability.address);
      return liability
        .getInfo()
        .then(info => {
          this.liability = {
            address: liability.address,
            worker: liability.worker,
            ...info
          };
          liability.onResult().then(result => {
            console.log("result", result);
            this.setResult(result, true);
          });
          return true;
        })
        .catch(e => {
          console.log(e);
          setTimeout(() => {
            this.newLiability(liability);
          }, 2000);
        });
    },
    order() {
      this.liability = null;
      this.$robonomics.web3.eth.getBlock("latest", (e, r) => {
        const demand = {
          model: config.MODEL,
          objective: config.OBJECTIVE,
          token: this.$robonomics.xrt.address,
          cost: this.price,
          lighthouse: this.$robonomics.lighthouse.address,
          validator: "0x0000000000000000000000000000000000000000",
          validatorFee: 0,
          deadline: r.number + 1000
        };
        this.$robonomics
          .sendDemand(demand)
          .then(liability => this.newLiability(liability));
      });
    }
  }
};
</script>

<style>
.block {
  border: 1px solid #eee;
  padding: 10px;
  margin: 10px 0;
}
</style>
