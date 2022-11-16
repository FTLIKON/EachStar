<template>
  <el-button @click="this.edit()" style="font-size: large; margin-right: 8px">
    <svg class="fronticon" aria-hidden="true">
      <use xlink:href="#icon-edit-1-copy"></use>
    </svg>
    {{ editButton }}
  </el-button>

  <EditDialog ref="editDialog"></EditDialog>
</template>

<script>
import { editButton } from '@/assets/text.js'
import EditDialog from '../dialog/edit_dialog.vue'
export default {
  components: { EditDialog },
  props: {
    card: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      editButton,
    }
  },
  methods: {
    edit() {
      this.$refs.editDialog.openPage(this.card)
    },
  },
}
</script>
<style lang="scss" scoped>
.fronticon {
  width: 18px;
  height: 18px;
  vertical-align: -0.5em;
  fill: currentColor;
  overflow: hidden;
  margin-bottom: auto;
}
</style>
