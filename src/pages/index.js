import React from 'react';
import './index.scss';
import metadata from '../metadata';
import BlogSummary from '../components/blog-summary/blog-summary';
import ProjectSummary from '../components/project-summary';

export default function MainComponent(props){
    return <section className="content-container">
        <div id="index-blog">
            <a href="/blog"><h2>BLOG</h2></a>
            <ul>
                {metadata.getPosts().map((post,i)=>
                    <li key={i}>
                        <BlogSummary post={post} />
                    </li>
                )}
            </ul>
        </div>
        <div id="index-projects">
            <a href="/projects"><h2>PROJECTS</h2></a>
            <ul>
                {metadata.projects.map((project,i)=>
                    <li key={i}>
                        <ProjectSummary project={project} />
                    </li>
                )}
            </ul>
        </div>
    </section>
}