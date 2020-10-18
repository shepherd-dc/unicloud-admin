<template>
  <div class="custom-table-container">
    <!-- 表头 -->
    <div class="custom-table" v-if="tableHead" :style="{lineHeight: labelHeight + 'px'}">
      <span class="table-title">{{tableHead.type}}</span>
      <span class="table-content">
        <slot name="content">{{tableHead.content}}</slot>
      </span>
    </div>
    <slot />
  </div>
</template>

<script>
export default {
  props: {
    tableHead: {
      type: Object,
      default: () => {}
    },
    labelHeight: {
      type: Number,
      default: 24
    }
  }
}
</script>

<style lang="scss" scoped>
  .custom-table-container {
    border-top: 1px solid #dbdcdc;
    .custom-table {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      border: 1px solid #dbdcdc;
      border-top: none;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
      .table-title {
        padding: 8px 15px;
        width: 200px;
        // text-align: right;
        border-right: 1px solid #dbdcdc;
        text-align: center;
      }
      .table-content {
        width: 0;
        -webkit-box-flex: 1;
        -ms-flex: 1;
        -webkit-flex: 1;
        flex: 1;
        padding: 8px 15px;
      }
    }
  }
</style>
