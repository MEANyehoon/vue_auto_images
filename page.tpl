
<template>
    <div>
        <img v-for="img in images" :src="img"/>
    </div>
</template>

<script>
    #{imagesImport}
    export default {
        data () {
            return {
                images: #{images}
            }
        }
    }
</script>

<style>
</style>
