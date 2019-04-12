<template>
    <section class="post">
        <div class="subline-date">{{data.createdAt | date}} by Alon Bar David</div>
        <Content />
    </section>
</template>

<script>
  export default {
    name:"PostPage",
    filters:{
      date(value){
        return value && new Date(value).toISOString().split("T")[0]
      }
    },
    computed:{
      data(){
        return this.$page.frontmatter;
      }
    }
  }
</script>
<style lang="stylus">
    @import "../styles/variables.styl"
    .post {
        a {
            color: link-color;
        }
    }
    .subline-date {
        margin-bottom: -1.5em;
        opacity: 0.4;
        font-size: 12px;
    }
</style>