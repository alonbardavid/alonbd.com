<template>
    <section :class="className">
        <h1 class="logo">
            <router-link to="/" v-html="Logo" aria-label="Alon BD - Code/Design/Ops"></router-link>
        </h1>
        <nav role="navigation">
            <ul>
                <li>
                    <router-link class="nav-item nav-color-primary"  id="nav-projects" to="/projects">PROJECTS</router-link>
                </li>
                <li>
                    <router-link class="nav-item nav-color-two" id="nav-blog" to="/blog">BLOG</router-link>
                </li>
                <li>
                    <router-link class="nav-item nav-color-three" id="nav-contact" to="/contact">CONTACT</router-link>
                </li>
            </ul>
        </nav>
    </section>
</template>

<script>
    import Logo from '!!raw-loader!./logo.svg';
    import {whenScrollDown} from "../utils/scroll";
    import {flipGroup} from '../utils/flip';

    export default {
    name: "navbar",
    props:{
      fullScreen:Boolean
    },
    data:()=>({
      hide:false,
      Logo
    }),
    mounted(){
      whenScrollDown((scrolledDown)=>{
        this.hide =scrolledDown;
      },52)
    },
    computed:{
      className(){
        return `menu ${this.fullScreen?'full-screen':''} ${this.hide?'hidden':''}`
      }
    },
    watch:{
      "fullScreen":function(fullScreen){
        const node = this.$el;
        flipGroup([
          {element: node.querySelector(".logo"), duration: 300}
        ],()=>{
          window.scrollTo(0,0)
          if (fullScreen) {
            node.classList.add('full-screen');
          } else {
            node.classList.remove('full-screen');
          }
        }).then(()=>{
          if (fullScreen) {
            //node.classList.add('fullscreen-tran-finished');
          }
        })
      }
    }
  }
</script>

<style lang="stylus">
    @import '../styles/variables.styl';
    @import '../styles/responsive.styl';

    .menu {
        z-index:10;
        .logo {
            width:100%;
            margin:5px;

            a {
                display: block;
            }
            h1 {
                margin: 4px 0px 0px 0px;
                overflow:hidden;
            }
            svg {
                width:100%;

                .text {
                    pointer-events: none;
                    transition: transform 0.4s ease-in-out;

                }
            }

        }
        nav {
            display:block;
            margin-left:50px;
            opacity:1;
            transition: opacity 0.3s ease-in-out;

            ul {
                list-style: none;
                margin:0;
                padding: 0;
            }

            .nav-item {
                display:block;
                margin-bottom:5px;
                font-weight: bold;
            }
            +respond-to(phones) {display:none}
        }
        .nav-item {
            transition: color 0.3s ease-in-out;
        }
        .nav-color-primary:hover,.nav-color-primary.selected{
            color:color-primary;
        }
        .nav-color-two:hover,.nav-color-two.selected {
            color:color-two;
        }
        .nav-color-three:hover,.nav-color-three.selected{
            color:color-three;
        }

        &.full-screen {
            width:100%;
            position: absolute;
            left:0;

            .logo {
                width:50vw;
                +respond-to(phones) {width:100%}

                margin:50px auto auto auto;

                svg .text {
                    +respond-to(phones) {
                        transform: translateY(0);
                    }
                }
            }
            nav {
                opacity:0;
                transition: opacity 0s;
            }
        }
        &:not(.full-screen) .logo{
            +respond-to(phones) {
                svg {
                    height:42px;
                    width: auto;
                    .text {
                        transform: scale(0.3) translate(1000px,1800px);
                    }
                }
            }
        }
        &.fullscreen-tran-finished {
            +respond-to(phones) {
                a {
                width: 48px;
                height: 42px;
                overflow: hidden;
                }
            }
        }
        &:not(.full-screen) {
            +respond-to(phones) {
                height:52px;
                width:100%;
                position:fixed;
                top:0px;
                background: white;
                border-bottom: 1px solid color-light-grey;
                transition: top 0.2s ease-in-out;

                &.hidden {
                    top:-55px;
                }
            }
        }
    }
</style>