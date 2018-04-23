
<template>
    <div>
        <img v-for="img in images" :src="img"/>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                images: new Array(#{count}).fill(0)
                    .map((_, index) => `static/project/#{name}/${index + 1}.png`)
            }
        }
    }
</script>

<style>
</style>
