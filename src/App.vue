<template>
    <div id="app">
        <Main />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Main from "./components/Main.vue";

export default defineComponent({
    name: "App",
    components: {
        Main,
    },
});
</script>

<style>
#app {
    font-family: "Hiragino Sans GB", "华文细黑", "STHeiti", "微软雅黑", "Microsoft YaHei", SimHei, "Helvetica Neue",
        Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    justify-content: center;
    width: 100%;
}
</style>
