<template>
  <div class="loading-studio-layout studio-layout">
    <div class="nav-bar">
      <div class="branding">
        <div class="brand-logo"></div>
        <div class="title"></div>
      </div>
      <div class="tool-bar">
        <div class="draw-tools">
          <div class="tool" v-for="i in 7" :key="`tool_${i}`"></div>
        </div>
      </div>
    </div>
    <div class="content-layout">
      <div class="explorer-panel">
        <div class="tab">
          <div class="tab-icon"></div>
          <div class="tab-text"></div>
        </div>
        <div class="features">
          <div v-for="i in 10" :key="`feature_${i}`" class="feature">
            <div class="icon skeleton"></div>
            <div class="text skeleton"></div>
          </div>
        </div>
      </div>
      <div class="editor-view">
        <EditorLoader/>
      </div>
      <div class="details-panel">
        <div class="features">
          <div v-for="i in 10" :key="`feature_${i}`" class="feature">
            <div class="icon skeleton"></div>
            <div class="text skeleton"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import EditorLoader from "@/components/studio/Editor/EditorLoader.vue";

export default {
  components: {
    EditorLoader
  },
};
</script>

<style lang="scss" scoped>
.skeleton {
  display: inline-block;
  height: 1em;
  position: relative;
  overflow: hidden;
  background-color: #e1e5eb;

  &::after {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: translateX(-100%);
    background-image: linear-gradient(
      90deg,
      rgba(#fff, 0) 0,
      rgba(#fff, 0.2) 20%,
      rgba(#fff, 0.5) 60%,
      rgba(#fff, 0)
    );
    animation: shimmer 1s infinite;
    content: "";
  }

  @keyframes shimmer {
    100% {
      transform: translateX(100%);
    }
  }
}
.studio-layout {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;

  .nav-bar {
    display: grid;
    height: 50px;
    background: var(--color-dark-background);
    grid-template-columns: 270px 1fr 270px;

    .branding {
      display: flex;
      flex-direction: row;
      align-items: center;
      padding: 5px 15px;

      .brand-logo {
        width: 30px;
        height: 30px;
        background: var(--color-dark-background-light);
        border-radius: 6px;
      }

      .title {
        height: 15px;
        width: 150px;
        background: var(--color-dark-background-light);
        margin-left: 10px;
        border-radius: 50px;
      }
    }

    .tool-bar {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      padding: 5px;
      border-left: 1px solid var(--color-dark-background-light);
      border-right: 1px solid var(--color-dark-background-light);

      .draw-tools {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
        position: relative;

        .tool {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 30px;
          height: 30px;
          background: var(--color-dark-background-light);
          border-radius: 50%;
          margin-right: 10px;
        }
      }
    }
  }

  .content-layout {
    display: grid;
    column-gap: 1px;
    grid-template-columns: 270px 1fr 270px;
    overflow: hidden;

    .explorer-panel,
    .details-panel {
      background: var(--color-secondary);
      display: flex;
      flex-direction: column;

      .features {
        display: flex;
        flex-direction: column;

        .feature {
          display: flex;
          align-items: center;
          padding: 10px 15px;

          .icon {
            width: 24px;
            height: 24px;
            border-radius: 50%;
          }

          .text {
            height: 15px;
            width: 100px;
            border-radius: 50px;
            margin-left: 15px;
          }
        }
      }
    }

    .editor-view {
      background: var(--color-secondary-light);
    }
  }
}
</style>
