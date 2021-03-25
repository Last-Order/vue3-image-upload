import { ref, onMounted, onBeforeUnmount } from "vue";

export default function usePasteFile() {
    const pastedFile = ref<File>();
    const onPaste = (e: ClipboardEvent) => {
        // @ts-ignore
        const items = (e.clipboardData || e.originalEvent.clipboardData).items as DataTransferItemList;
        for (let i = 0; i <= items.length - 1; i++) {
            if (items[i].type.startsWith("image/")) {
                pastedFile.value = items[i].getAsFile()!;
                break;
            }
        }
    };
    onMounted(() => {
        document.addEventListener('paste', onPaste);
    });
    onBeforeUnmount(() => {
        document.removeEventListener('paste', onPaste);
    })
    return {
        pastedFile,
    };
}
