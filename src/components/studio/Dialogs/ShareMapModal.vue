<template>
  <div class="share-modal-background">
    <div class="share-modal">
      <div class="header">
        <div class="tabs">
          <div
            v-for="tab in tabs"
            :key="tab.id"
            :class="['tab', { active: activeTab === tab.id }]"
            @click="activeTab = tab.id"
          >
            {{ tab.name }}
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">
          <ClearIcon size="20" />
        </button>
      </div>
      <div class="contents">
        <div v-show="activeTab === 'share'" class="share-map-contents">
          <div class="info">
            <div class="icon"><LinkIcon size="22" /></div>
            <p>Anyone with the link can view or download your map</p>
          </div>
          <div class="copy-link">
            <input
              type="text"
              ref="linkInputRef"
              v-model="projectLink"
              :readonly="true"
            />
            <button class="copy-btn" @click="copyLink">{{ copyText }}</button>
          </div>
        </div>
        <div v-show="activeTab === 'publish'" class="publish-map-contents">
          <div class="info">
            <div class="icon"><PublicIcon size="22" /></div>
            <p>
              Your map will be visible for the community to view, download or
              use it in their maps.
            </p>
          </div>
          <form @submit.prevent="publishMap">
            <div class="input-wrapper">
              <label for="title">Map Title</label>
              <v-input
                v-model="title"
                type="text"
                id="title"
                placeholder="Enter the title for your map"
              />
            </div>
            <div class="input-wrapper">
              <label for="description">Description</label>
              <v-textarea
                v-model="description"
                type="text"
                id="description"
                placeholder="Describe your map. You may add #hastags as well."
              />
            </div>
            <div class="info-bar">
              You hhave to republish your map for any further changes to be reflected back on your community page
            </div>
            <div class="button-wrapper">
              <v-button :text="'Publish'" :isLoading="isPublishing"/>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ClearIcon from "@/components/icons/ClearIcon.vue";
import LinkIcon from "@/components/icons/LinkIcon.vue";
import PublicIcon from "@/components/icons/PublicIcon.vue";
import { computed, ref } from "vue";
import { useStoreModule } from "@/composables/useStoreModule";
import VInput from "@/components/base/v-input.vue";
import VButton from "@/components/base/v-button.vue";
import VTextarea from "@/components/base/v-textarea.vue";
import { createRoute } from "@/router";

export default {
  components: {
    ClearIcon,
    LinkIcon,
    PublicIcon,
    VInput,
    VTextarea,
    VButton
  },
  setup() {
    const tabs = [
      {
        id: "share",
        name: "Share Map",
      },
      // {
      //   id: "publish",
      //   name: "Publish to Community",
      // },
    ];
    const activeTab = ref("share");
    const { getters, actions } = useStoreModule("projects");
    const projectLink = computed(
      () => `https://open.krata.app${createRoute(`/map/${getters.getActiveProject.id}`)}`
    );
    const copyText = ref("Copy Link");
    const linkInputRef = ref(null);
    const isPublishing = ref(false);
    const title = ref(getters.getActiveProject.title);
    const description = ref("");

    const copyLink = () => {
      navigator.clipboard.writeText(projectLink.value);
      copyText.value = "Copied!";
      if (linkInputRef.value) {
        linkInputRef.value.select();
      }
      setTimeout(() => {
        copyText.value = "Copy Link";
      }, 1000);
    };

    const publishMap = async () => {
      if (!(title.value && description.value)) return;
      isPublishing.value = true;
      const payload = {
        title: title.value,
        description: description.value
      }
      try {
        const isPublished = await actions.publishMap(payload);
        if (isPublished) {
          console.log("Map published successfully");
        } else {
          console.log("Unable to publish");
        }
      } catch (error) {
        console.error(error);
      }     
      isPublishing.value = false;
    }
    return {
      tabs,
      activeTab,
      projectLink,
      copyLink,
      copyText,
      title,
      description,
      linkInputRef,
      isPublishing,
      publishMap
    };
  },
};
</script>

<style lang="scss" scoped>
.share-modal-background {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 999;
  background: var(--popup-background);
  display: flex;
  align-items: center;
  justify-content: center;

  .share-modal {
    display: flex;
    flex-direction: column;
    width: 500px;
    background: var(--color-secondary);
    border-radius: 6px;

    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px 0 10px;
      border-bottom: 1px solid var(--border-color);

      .tabs {
        display: flex;
        flex-direction: row;
        align-items: center;

        .tab {
          padding: 10px 15px 13px 15px;
          font-weight: 500;
          border-bottom: 2px solid transparent;
          opacity: 0.7;
          border-radius: 6px 6px 0 0;

          &:hover {
            cursor: pointer;
            background: var(--color-secondary-light);
            opacity: 1;
          }

          &.active {
            border-bottom: 2px solid var(--font-color);
            opacity: 1;
          }
        }
      }

      .close-btn {
        display: flex;
        align-items: center;
        border: 0;
        background: 0;
        padding: 5px;
        border-radius: 6px;

        &:hover {
          cursor: pointer;
          background: var(--color-secondary-light);
        }
      }
    }

    .contents {
      padding: 10px;

      .share-map-contents {
        display: flex;
        flex-direction: column;

        .info {
          display: flex;
          align-items: center;

          .icon {
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--color-primary-light);
            color: var(--color-primary);
            margin-right: 10px;
          }
        }

        .copy-link {
          display: flex;
          margin-top: 10px;
          background: var(--color-secondary-light);
          border-radius: 6px;

          input {
            flex: 1;
            border: 0;
            background: transparent;
            padding: 10px;
            outline: none;
          }

          .copy-btn {
            border: 0;
            background: transparent;
            padding: 10px 15px;
            color: var(--color-primary);
            &:hover {
              cursor: pointer;
            }
          }
        }
      }

      .publish-map-contents {
        display: flex;
        flex-direction: column;

        .info {
          display: flex;
          align-items: center;

          .icon {
            width: 35px;
            height: 35px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            background: var(--color-primary-light);
            color: var(--color-primary);
            margin-right: 10px;
          }

          p {
            flex: 1;
          }
        }

        .info-bar {
          background: var(--color-secondary-light);
          padding: 10px;
          border-radius: 6px;
          font-size: 0.8rem;
        }
        form {
          display: flex;
          flex-direction: column;

          .input-wrapper {
            display: flex;
            flex-direction: column;
            margin-top: 6px;

            a {
              color: var(--color-primary);
            }
          }

          .button-wrapper {
            display: flex;
            justify-content: flex-end;
            margin-top: 6px;
          }

          .error-hint {
            color: var(--color-error);
          }
        }
      }
    }
  }
}
</style>
