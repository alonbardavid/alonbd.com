import React from 'react';
import metadata from 'src/metadata';
import BlogSummary from 'src/components/blog-summary/blog-summary';
import SummaryList from 'src/components/summary-list/summary-list';

export default function BlogPage(){
    return <div>
        <h2>Blog</h2>
        <SummaryList>
            {metadata.getPosts().map(post=> <BlogSummary post={post} />
            )}
        </SummaryList>
    </div>
}