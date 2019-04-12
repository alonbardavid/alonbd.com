<template>
    <section class="home-page">
        <div id="index-blog">
            <router-link to="/blog"><h2>BLOG</h2></router-link>
            <summary-list type="blog-summary" :items="posts"/>
        </div>
        <div id="index-projects">
            <router-link to="/projects"><h2>PROJECTS</h2></router-link>
            <summary-list type="project-summary" :items="projects"/>
        </div>
    </section>
</template>

<script>
  export default {
    name:"HomePage",
    components: {
    },
    computed: {
      posts(){
        return this.$site.pages.filter(p=>/\/blog\/.+/.test(p.regularPath)).sort((a,b)=>{
          a = a.frontmatter.createdAt;
          b = b.frontmatter.createdAt;
          return a <b?1:a ===b?0:-1;
        })
      },
      projects(){
        return this.$site.pages.find(p=>p.frontmatter.title === "Projects").frontmatter.items
      }
    },
  }
</script>
<style lang="stylus">
@import "../styles/responsive.styl"
.home-page {
    position: relative;
    width: 45vw;
    padding-top: 20vw;
    margin:auto;

    > div {
        width: 49%;
        display: inline-block;
        vertical-align: top;

        +respond-to(phones) {
            width:100%;
            margin-bottom:20px;
            text-align:center;
        }
    }

    +respond-to(phones) {
        width: 100%;
        padding-top:40vw;
    }
    &.page-transition-out-start ,&.page-transition-out-end {
        visibility: hidden;
    }
}
</style>