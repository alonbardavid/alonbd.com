<template>
    <footer>
        <div class="container">
            <div class="footer-section footer-hello">
                <div class="avatar-container">
                    <img class="avatar" src="/images/avatar.jpeg" alt="Alon Bar David"></img>
                </div>
                <div >
                    <h2>Hi!</h2>
                    <p>
                        My name is Alon Bar David.<br/>
                        I'm a team lead at <a href="https://www.meliopayments.com">Melio</a>, a fullstack enthusiast,
                        great believer in the power of ownership and proud father of two.

                    </p>
                </div>
            </div>
            <div class="footer-section footer-links">
                <h2>AROUND THE WEB</h2>
                You can find me at the following places:
                <ul>
                    <li v-for="link in links" :key="link.title">
                        <a class="link-primary" :href="link.url" target="blank">{{link.title}}</a></li>
                </ul>
            </div>
        </div>
    </footer>
</template>

<script>
  export default {
    name: "Footer",
    computed:{
      links(){
        return this.$site.themeConfig.contactLinks;
      }
    }
  }
</script>

<style scoped lang="stylus">
    @import '../styles/variables';
    @import '../styles/responsive';

    footer {
        display:block;
        width:100%;
        background-color: #dddddd;
        min-height: footer-height;

        > .container {
            display:flex;

            +respond-to(phones) {
                display:block;
            }
        }
        .footer-section {
            display:inline-block;
            vertical-align: text-top;
            width:50%;
            margin:10px;
            border-right: 1px solid #BBBBBB;
            +respond-to(phones) {
                width:100%;

                h2 {
                    text-align:center;
                }

            }

            &:last-child {
                border-right:none;
            }
        }

        .footer-hello {
            display:inline-flex;

            +respond-to(phones) {
              justify-content: center;
                align-items: center;
            }
        }
        .avatar-container {
            height:100%;
            display: flex;
            justify-content: center;
            align-items: center;
            margin-right:20px;
        }
        .avatar {
            width:77px;
            height:77px;
            border-radius: 100px;
        }
        .footer-links ul{
            margin-top:5px;
            list-style:none;
        }
    }
</style>