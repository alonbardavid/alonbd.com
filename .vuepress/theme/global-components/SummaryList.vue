<template>
    <ul class="summary-list">
        <li v-for="item in items" :key="item.key">
            <component :is="type" :item="item"></component >
        </li>
    </ul>
</template>

<script>
  export default {
    name: "SummaryList",
    props:{
      type:String,
      items:Array
    }
  }
</script>

<style lang="stylus">
@import '../styles/responsive.styl';
.summary-list {
    &,li {
        list-style: none;
        margin:0;
        padding: 0;
    }
    > li {
        .summary {
            margin-right:30px;
            padding-bottom:10px;
            border-bottom: solid 1px #5664af;
            min-height:100px;
            max-width:350px;

            +respond-to(phones) {
                max-width:100%;
                width:100%;
                margin-bottom:20px;
                text-align:center;
            }
        }
        &:last-child .summary {
            border-bottom:none;
        }
    }
}

</style>