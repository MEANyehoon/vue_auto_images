<template>
  <div>
      <button v-for="(btn, index) in buttons" :key=index @click="onBtnClick(btn)">{{btn}}</button>
  </div>
</template>

<script>
export default {
  name: 'App',
  data() {
      return {
          buttons: #{projectNames}
      }
  },
  methods: {
      onBtnClick(btn) {
          this.$router.push(`/${btn}`);
      }
  }
}
</script>

<style>

</style>
