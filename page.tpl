
<template>
    <div>
        <img class="auto_image" v-for="img in images" :src="img"/>
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
    .auto_image{
        display: block;
        width: 400px;
        height: auto;
        margin: 20px auto;
    }
</style>
