import React from 'react';
import metadata from 'src/metadata';
import BlogSummary from 'src/components/blog-summary/blog-summary';

export default function BlogComponent(){
    return <div>
        <h2>Blog</h2>
        <ul>
            {metadata.getPosts().map((post,i)=>
                <li key={i}>
                    <BlogSummary post={post} />
                </li>
            )}
        </ul>
    </div>
}