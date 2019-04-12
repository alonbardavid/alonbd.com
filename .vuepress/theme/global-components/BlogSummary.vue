<template>
    <router-link :to="item.regularPath">
        <div class="blog-summary summary">
            <h3>{{item.frontmatter.title}}</h3>
            <span class="blog-summary-date">
                {{item.frontmatter.createdAt | date}}
            </span>
            <span class="blog-summary-description">
                {{item.frontmatter.description}}
            </span>
        </div>
    </router-link>
</template>

<script>
  export default {
    name: "BlogSummary",
    filters:{
      date(value){
        return value && new Date(value).toISOString().split("T")[0]
      }
    },
    props:{
      item:Object
    }
  }
</script>

<style scoped lang="stylus">
    .blog-summary {
        h3 {
            position: relative;
            margin-bottom:0.1em;
        }
        .blog-summary-date {
            display: block;
            font-size:smaller;
            opacity:0.6;
            margin-bottom:0.3em;
        }
    }
</style>