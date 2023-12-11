<template>
  <div id="log">
  <div
      v-if="loading"
      @mousedown="startDrag"
      @mouseup="stopDrag"
      @contextmenu.prevent="showContextMenu"
  >
    Loading...
    <p>{{ pageUrl }}</p>
  </div>
  <div v-else>
      <pre
          ref="dataContainer"
          @mousedown="startDrag"
          @mouseup="stopDrag"
          @contextmenu.prevent="showContextMenu"
      >
        {{ responseData }}
      </pre>
  </div>

  <!-- Context Menu -->
  <div
      v-show="contextMenuVisible"
      :style="{ top: contextMenuPosition.y + 'px', left: contextMenuPosition.x + 'px' }"
      class="context-menu"
  >
    <ul>
      <li @click="openPopup('http://localhost:9200/test_docs/_search?pretty=true&q=qId:')">search test_docs</li>
    </ul>
  </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: ['pageUrl'],
  data() {
    return {
      loading: true,
      responseData: null,
      isDragging: false,
      contextMenuVisible: false,
      contextMenuPosition: { x: 0, y: 0 },
      selectedText: '',
    };
  },
  mounted() {
    setTimeout(() => {
      this.loadData(this.pageUrl);
    }, 1000);
  },
  methods: {
    loadData(url) {
      axios.get(url)
          .then(response => {
            this.responseData = response.data;
          })
          .catch(error => {
            console.error('Error fetching data:', error);
          })
          .finally(() => {
            this.loading = false;
            this.isDragging = false;
          });
    },
    startDrag() {
      this.isDragging = false;
      this.contextMenuVisible = false;
    },
    stopDrag() {
      this.isDragging = false;
    },
    showContextMenu(event) {
      event.preventDefault();
      if (this.isDragging) return;

      this.contextMenuPosition = { x: event.clientX, y: event.clientY };
      this.contextMenuVisible = true;

      this.selectedText = this.getSelectedText();
    },
    closeContextMenu() {
      this.contextMenuVisible = false;
    },
    getSelectedText() {
      if (window.getSelection) {
        const selection = window.getSelection();
        if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          return range.toString();
        }
      } else if (document.selection) {
        return document.selection.createRange().text;
      }
      return '';
    },
    openPopup(url) {
      console.log(`Opening popup with URL: ${url}, Selected Text: ${this.selectedText}`);
      const encodedSelectedText = encodeURIComponent(this.selectedText);
      const popupUrl = `${url}${encodedSelectedText}`;

      window.open(popupUrl, '_blank', 'fullscreen=yes');
      this.contextMenuVisible = false;
    }
  },
};
</script>

<style scoped>
pre {
  word-wrap: break-word;
  white-space: pre-wrap;
}

.context-menu {
  position: fixed;
  background-color: #fff;
  border: 1px solid #ccc;
  box-shadow: 2px 2px 5px rgba(0, 0, 0, 0.2);
  z-index: 1000;
}

.context-menu ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.context-menu li {
  padding: 10px;
  cursor: pointer;
}

.context-menu li:hover {
  background-color: #f0f0f0;
}
</style>
