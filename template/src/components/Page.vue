<template>
  <div>
    <h1 class="text-md-center">{{ name }}</h1>
    <Order />
  </div>
</template>

<script>
import Order from './Order'

export default {
  name: 'Page',
  components: {
    Order
  }
}
</script>
