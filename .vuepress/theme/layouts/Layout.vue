<template>
    <div>
        <Navbar :full-screen="isHome"/>
        <section id="main-content" :class="['container',isHome && 'in-home']">
            <transition name="fade">
                <component  :is="component">
                </component>
            </transition>
        </section>
        <Footer>
        </Footer>
    </div>

</template>

<script>
  import Footer from '../components/Footer';
  import Navbar from '../components/Navbar'
  export default {
    name:"Layout",
    components: {
      Footer,
      Navbar
    },
    computed: {
      component(){
        return this.$page.regularPath ==="/"?"home-page":this.$page.frontmatter.component || "post-page";
      },
      isHome(){
        return this.component === "home-page";
      }
    }
  };
</script>

<style lang="stylus">
    .in-home {
        .fade-leave-active {
            transition: 0s;
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: opacity .3s;
    }
    .fade-enter-active {
        transition-delay: .3s;
    }
    .fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */
    {
        opacity: 0;
    }
</style>