<template>
    <div class="container">
        <div class="uploader" @click="onSelectFile">
            <img class="icon" src="/images/upload-icon.svg" alt="Upload Icon" />
            <div class="help-text">{{ isDropping ? "释放文件以上传" : "点击选择文件/拖入文件/Ctrl+V" }}</div>
            <div class="progress" :class="{ show: !!uploadProgress, hide: !uploadProgress }">
                <div class="progress-bar" :style="{ width: `${uploadProgress}%` }"></div>
            </div>
        </div>
        <div class="result" v-if="result">
            <div class="link">{{ result }}</div>
            <div class="button" @click="onCopyButtonClick">
                <img class="button-icon copy-button-icon" src="/images/copy.svg" alt="Copy Icon" />
                <span>复制</span>
            </div>
            <div class="button" @click="onShareButtonClick">
                <img class="button-icon share-button-icon" src="/images/share.svg" alt="Share Icon" />
                <span>分享</span>
            </div>
        </div>
        <div class="tip" :class="{ show: isShowTip, hide: !isShowTip }">{{ tipText }}</div>
    </div>
</template>
<script lang="ts">
import { defineComponent, ref, watch } from "vue";
import UploadService from "../../services/upload";
import useDropFile from "./composables/useDropFile";
import usePasteFile from "./composables/usePasteFile";
import { FILE_SIZE_LIMIT } from "../../constants";
export default defineComponent({
    name: "Upload",
    setup: () => {
        const selectedFile = ref<File>();
        const uploadProgress = ref(0);
        const uploadLock = ref(false);
        const isShowTip = ref(false);
        const tipText = ref("");
        const result = ref("");
        const { isDropping, droppedFile } = useDropFile();
        const { pastedFile } = usePasteFile();
        const onSelectFile = () => {
            const fileInput = document.createElement("input");
            fileInput.type = "file";
            fileInput.addEventListener("change", () => {
                if (fileInput?.files?.[0]) {
                    selectedFile.value = fileInput.files[0];
                }
            });
            fileInput.click();
        };

        const upload = async (file: File) => {
            if (uploadLock.value) {
                return;
            }
            uploadLock.value = true;
            try {
                const uploadResult = await UploadService.uploadFile({
                    file,
                    onProgress: (progress) => {
                        uploadProgress.value = progress;
                    },
                });
                if (uploadResult.filename) {
                    const link = `${import.meta.env.VITE_IMAGE_HOST}/${uploadResult.filename}`;
                    result.value = link;
                    try {
                        await window.navigator.clipboard.writeText(link);
                        showTip("链接已复制");
                    } catch {
                        //
                    }
                }
            } catch (e) {
                showTip("上传失败..");
            } finally {
                uploadLock.value = false;
            }
        };

        const showTip = (text: string) => {
            isShowTip.value = true;
            tipText.value = text;
            setTimeout(() => {
                isShowTip.value = false;
                tipText.value = "";
            }, 5000);
        };

        const onCopyButtonClick = async () => {
            await window.navigator.clipboard.writeText(result.value);
            showTip("链接已复制");
        };

        const onShareButtonClick = async () => {
            await window.navigator.share({
                text: result.value,
                title: "iKP Images Services",
            });
        };

        watch(droppedFile, (file) => {
            if (file) {
                selectedFile.value = file;
            }
        });

        watch(pastedFile, (file) => {
            if (file) {
                selectedFile.value = file;
            }
        });

        watch(uploadProgress, (progress) => {
            if (progress === 100) {
                setTimeout(() => {
                    uploadProgress.value = 0;
                }, 5000);
            }
        });

        watch(selectedFile, (file) => {
            if (file) {
                if (file.size > FILE_SIZE_LIMIT) {
                    showTip("文件大小超过限制");
                    return;
                }
                if (!file.type.startsWith("image/")) {
                    showTip("只允许图片上传");
                    return;
                }
                upload(file);
            }
        });

        return {
            onSelectFile,
            uploadProgress,
            isDropping,
            tipText,
            isShowTip,
            result,
            onCopyButtonClick,
            onShareButtonClick,
        };
    },
});
</script>

<style scoped>
* {
    box-sizing: border-box;
}
.uploader {
    width: 100%;
    height: 200px;
    border: 2px dashed #aaa;
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
}
.icon {
    width: 10%;
}
.help-text {
    user-select: none;
    margin-top: 4px;
    font-size: smaller;
    color: #bbbbbb;
}
.progress {
    width: 75%;
    height: 12px;
    margin-top: 8px;
    border: 1px solid #aaa;
    transition: opacity 400ms;
}
.progress-bar {
    width: 0;
    height: 100%;
    background-color: #e2e2e2;
    transition: width 400ms;
}
.tip {
    width: 100%;
    margin-top: 8px;
    text-align: center;
    transition: opacity 400ms;
}
.hide {
    opacity: 0;
}
.show {
    opacity: 1;
}
.result {
    width: 100%;
    margin-top: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.link {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    font-family: "Consolas", monospace;
}
.button-icon {
    width: 12px;
    margin: 0 2px;
}
.button {
    margin-left: 4px;
    padding: 2px 8px;
    border: 1px solid #bbb;
    border-radius: 2px;
    flex-shrink: 0;
    text-align: center;
    cursor: pointer;
    color: #373737;
}
.button:hover {
    background-color: rgba(192, 192, 192, 0.7);
}
.copy-button-icon,
.share-button-icon {
    position: relative;
    top: 1px;
}
</style>
