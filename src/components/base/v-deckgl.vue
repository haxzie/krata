<script>
import Deck from "@deck.gl/core/dist/es5/lib/deck";

/**
 * @emits view-state-change on change in the view state of deck.gl
 * @emits click on click on the deck instance
 * @emits on-drag on drag event on the deck.gl instance
 */
export default {
  name: "VueDeckgl", // vue component name
  props: {
    /**
     * Width of the deck.gl canvas
     */
    width: {
      type: [Number, String],
      default: "100%",
    },
    /**
     * Height of the deck.gl canvas
     */
    height: {
      type: [Number, String],
      default: "100%",
    },
    /**
     * Array of all the Deck.gl layers to be rendered. Checkout @deck.gl/layers for more info
     * @link https://deck.gl/docs/api-reference/layers
     */
    layers: {
      type: Array,
      default: () => [],
    },
    /**
     * ViewState of the deck.gl instance to be shown
     * values should include { latitude, longitude, zoom, pitch }
     */
    viewState: {
      type: Object,
      default: () => ({
        latitude: 40.6971494,
        longitude: -74.2598655,
        zoom: 12,
        pitch: 0,
      }),
      required: true,
    },
    /**
     * Prop to apply cursor styles
     */
    cursor: {
      type: String,
      default: "default",
    },
    /**
     * Options for viewport interactivity, e.g. pan, rotate and zoom with mouse, touch and keyboard.
     * Defaults to ture to use builtin map interactions
     */
    controller: {
      type: Object,
      default: () => ({}),
    },
    /**
     * The array of effects to be rendered.A lighting effect will be added if an empty array is supplied.Refer to effect's documentation to see details
     * @link https://deck.gl/docs/api-reference/core/lighting-effect
     */
    effects: {
      type: Array,
      default: () => [],
    },
    /**
     * Disables the context menu on right click
     *
     */
    disableContextMenu: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    /**
     * Initializes a new deck.gl instance with specified initialViewState and Layers
     * @param {Object} initialViewState of the deckGL
     * @param {Array} layers to be renderd
     */
    initializeDeck(viewState, layers) {
      return new Deck({
        canvas: this.$refs.canvas,
        width: "100%",
        height: "100%",
        viewState,
        controller: this.controller,
        glOptions: {
          preserveDrawingBuffer: true, // https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/getContext
        },
        // change the map's viewstate whenever the view state of deck.gl changes
        onViewStateChange: ({ viewState }) => {
          this.deck.setProps({
            viewState,
          });
          this.$emit("view-state-change", viewState);
        },
        // emit click events back to parent
        onClick: (info, event) => {
          this.$emit("click", info, event);
        },
        onDrag: (info, event) => {
          this.$emit("drag", info, event);
        },
        onDragStart: (info, event) => {
          this.$emit("onDragStart", info, event);
        },
        onDragEnd: (info, event) => {
          this.$emit("onDragEnd", info, event);
        },
        layers: layers,
        effects: this.effects,
        getCursor: ({ isDragging }) => {
          return isDragging ? "grabbing" : this.cursor || "grab";
        },
      });
    },
    handleContextMenu(e) {
      if (this.disableContextMenu) {
        e.preventDefault();
      }
    },
  },
  watch: {
    /**
     * Whenever the layer prop changes,update the layers of deck.gl
     */
    layers(newLayers) {
      this.deck.setProps({
        layers: newLayers,
      });
    },
    /**
     * Update the viewstate of deckgl whenever the prop changes
     */
    viewState(newViewState) {
      this.deck.setProps({
        viewState: {
          ...newViewState,
          // add flyto transitions whenever the viewstates change
          // additionally this to work, the user needs to specify the transitionDuration
          // within the newViewState
          // transitionInterpolator: new FlyToInterpolator(),
        },
      });
    },
    /**
     * Updates the effexts of deck.gl whenever the prop changes
     */
    effects(newEffects) {
      this.deck.setProps({
        effects: newEffects,
      });
    },
  },
  created() {
    // needs to be a non-reactive element
    this.deck = null;
  },
  mounted() {
    this.deck = this.initializeDeck(this.viewState, this.layers);
  },
  unmounted() {
    this.deck.finalize();
  },
};
</script>

<template>
  <div id="deckgl" class="deckgl-container" :width="width" :height="height">
    <!-- To be displayed on the background of the visualization/deck instance -->
    <slot name="background"></slot>
    <!-- Normal slots, which will always be displayed on the background of the visualization/deck instance -->
    <slot></slot>
    <canvas
      id="deck-canvas"
      ref="canvas"
      @contextmenu="handleContextMenu"
    ></canvas>
    <!-- To be displayed on the foreground of the visualization/deck instance -->
    <slot name="foreground"></slot>
  </div>
</template>

<style scoped>
.deck-container {
  position: relative;
}
.deck-container #map {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e5e9ec;
  overflow: hidden;
}
.deck-container #deck-canvas {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
