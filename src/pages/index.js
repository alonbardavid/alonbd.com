import React from 'react';
import './index.scss';
import metadata from '../metadata';
import SummaryList from '../components/summary-list/summary-list';
import BlogSummary from '../components/blog-summary/blog-summary';
import ProjectSummary from '../components/project-summary';

export default function IndexPageComponent(){
    return <section className="index-content-container">
        <div id="index-blog">
            <a href="/blog"><h2>BLOG</h2></a>
            <SummaryList>
                {metadata.getPosts().map(post=> <BlogSummary post={post} />
                )}
            </SummaryList>
        </div>
        <div id="index-projects">
            <a href="/projects"><h2>PROJECTS</h2></a>
            <SummaryList>
                {metadata.projects.map(project=> <ProjectSummary project={project} />
                )}
            </SummaryList>

        </div>
    </section>
}
IndexPageComponent.transition = 300;