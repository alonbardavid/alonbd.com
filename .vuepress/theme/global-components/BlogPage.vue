<template>
    <section>
        <h2>Blog</h2>
        <summary-list type="blog-summary" :items="posts"/>
    </section>
</template>

<script>
  export default {
    name: "ProjectPage",
    computed:{
      posts(){
        return this.$site.pages.filter(p=>/\/blog\/.+/.test(p.regularPath)).sort((a,b)=>{
          a = a.frontmatter.createdAt;
          b = b.frontmatter.createdAt;
          return a <b?1:a ===b?0:-1;
        })
      },
    }
  }
</script>

<style scoped>

</style>