<template>
    <div class="main-container">
        <Uploader />
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Uploader from './Uploader/index.vue';
export default defineComponent({
    name: "Main",
    props: {},
    setup: () => {
        return {};
    },
    components: {
        Uploader
    }
});
</script>

<style scoped>
.main-container {
    position: relative;
    max-width: 425px;
    width: 100%;
    min-height: 200px;
    flex-shrink: 0;
}
</style>
