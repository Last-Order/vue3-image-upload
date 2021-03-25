import { ref, onMounted, onBeforeUnmount } from "vue";
export default function useDropFile() {
    const isDropping = ref(false);
    const droppedFile = ref<File>();
    const dragoverElements = ref<EventTarget[]>([]);
    const onDragover = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    };
    const onDragenter = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.target) {
            dragoverElements.value.push(e.target);
        }
        isDropping.value = true;
    };
    const onDragleave = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        dragoverElements.value = dragoverElements.value.filter((el) => el !== e.target);
        if (dragoverElements.value.length === 0) {
            isDropping.value = false;
        }
    };
    const onDrop = (e: DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer?.files[0]) {
            droppedFile.value = e.dataTransfer.files[0];
        }
        isDropping.value = false;
    };
    // Listen drop event
    onMounted(() => {
        document.addEventListener("dragover", onDragover);
        document.addEventListener("dragenter", onDragenter);
        document.addEventListener("dragleave", onDragleave);
        document.addEventListener("drop", onDrop);
    });
    onBeforeUnmount(() => {
        document.removeEventListener("dragover", onDragover);
        document.removeEventListener("dragenter", onDragenter);
        document.removeEventListener("dragleave", onDragleave);
        document.removeEventListener("drop", onDrop);
    });

    return {
        isDropping,
        droppedFile,
    };
}
