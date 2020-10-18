<template>
  <div class="table-item">
    <div class="custom-table" :style="{lineHeight: labelHeight + 'px'}">
      <span class="table-type" :style="{textAlign: textAlign}">{{label}}<i v-if="required" style="color: red;"> *</i></span>
      <span class="table-content">
        <slot>{{tableItem && tableItem.content}}</slot>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    label: {
      type: String,
      default: ''
    },
    required: {
      type: Boolean,
      default: false
    },
    tableItem: {
      type: Object,
      default: () => {}
    },
    labelHeight: {
      type: Number,
      default: 24
    },
    textAlign: {
      type: String,
      default: 'right'
    }
  }
}
</script>

<style lang="scss" scoped>
  .table-item {
    .custom-table {
      display: -webkit-box;
      display: -ms-flexbox;
      display: -webkit-flex;
      display: flex;
      border: 1px solid #dbdcdc;
      border-top: none;
      font-size: 14px;
      .table-type {
        padding: 8px 15px;
        width: 20%;
        border-right: 1px solid #dbdcdc;
				background-color: #f8f8f8;
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
