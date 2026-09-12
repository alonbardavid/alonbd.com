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
    import {morph} from '../utils/morph';

    export default {
    name: "navbar",
    props:{
      fullScreen:Boolean
    },
    data:()=>({
      hide:false,
      animating:false,
      Logo
    }),
    mounted(){
      whenScrollDown((scrolledDown)=>{
        this.hide =scrolledDown;
      },52)
    },
    computed:{
      className(){
        return ['menu',
          this.fullScreen?'full-screen':'',
          this.hide?'hidden':'',
          this.animating?'animating':''].filter(Boolean).join(' ')
      }
    },
    watch:{
      "fullScreen":function(fullScreen){
        const node = this.$el;
        const logo = node.querySelector(".logo svg");
        // the menu re-renders on the next tick, so the classes the measurement
        // needs are applied by hand here and left for vue to render identically.
        this.hide = false;
        this.animating = true;
        morph(logo,()=>{
          window.scrollTo(0,0);
          node.classList.remove('hidden');
          node.classList.add('animating');
          node.classList.toggle('full-screen',fullScreen);
        }).then(()=>{
          this.animating = false;
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

        +respond-to(phones) {
            background-color: rgba(255,255,255,0);
            border-bottom: 1px solid transparent;
            transition: top 0.2s ease-in-out, background-color 0.35s ease-in-out, border-bottom-color 0.35s ease-in-out;
        }

        .logo {
            width:100%;
            margin:5px;

            a {
                display: block;
            }
            svg {
                width:100%;
                // the logo travels by transform alone, anchored top left so the
                // translate + scale morph lines up with its layout position.
                transform-origin: 0 0;

                .text {
                    pointer-events: none;
                    transition: opacity 0.3s ease-in-out;
                }
                .dots {
                    transform-box: fill-box;
                    transform-origin: center;
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
            }
            nav {
                opacity:0;
                transition: opacity 0s;
            }
        }
        &:not(.full-screen) .logo {
            +respond-to(phones) {
                svg {
                    height:42px;
                    width: auto;

                    .text {
                        opacity: 0;
                    }
                }
            }
        }
        // only the dots are kept once the logo has settled into the phone bar -
        // clipping any earlier would cut off the logo on its way there.
        &:not(.full-screen):not(.animating) .logo a {
            +respond-to(phones) {
                width: 48px;
                overflow: hidden;
            }
        }
        &.animating {
            // `top` snaps to its resting value so the morph can measure where
            // the logo is actually headed, the rest of the bar still fades in.
            +respond-to(phones) {
                transition: background-color 0.35s ease-in-out, border-bottom-color 0.35s ease-in-out;
            }

            .logo svg {
                overflow: visible;
            }
            .dots {
                animation: logo-spin 0.5s ease-in-out;
            }
            // returning home unwinds the spin the other way
            &.full-screen .dots {
                animation: logo-spin 0.5s ease-in-out reverse;
            }
        }
        &:not(.full-screen) {
            +respond-to(phones) {
                height:52px;
                width:100%;
                position:fixed;
                top:0px;
                background-color: white;
                border-bottom-color: color-light-grey;

                &.hidden {
                    top:-55px;
                }
            }
        }
    }

    @keyframes logo-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    @media (prefers-reduced-motion: reduce) {
        .menu.animating .dots {
            animation: none;
        }
    }
</style>
