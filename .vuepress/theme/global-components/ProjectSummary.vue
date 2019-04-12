<template>
    <a :href="item.url" target="blank">
        <div class="project-summary summary">
            <h3>{{item.title}}</h3>
            <span class="project-summary-description">
                {{item.description}}
            </span>
        </div>
    </a>
</template>

<script>
  export default {
    name: "ProjectSummary",
    props:{
      item:Object
    }
  }
</script>

<style scoped lang="stylus">

</style>