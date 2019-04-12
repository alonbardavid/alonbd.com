<template>
    <div>
        <h2>Projects</h2>
        <summary-list type="project-summary" :items="projects">
        </summary-list>
    </div>
</template>

<script>
  export default {
    name: "ProjectPage",
    computed:{
      projects(){
        return this.$page.frontmatter.items;
      }
    }
  }
</script>

<style scoped>

</style>