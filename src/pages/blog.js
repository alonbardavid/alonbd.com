import React from 'react';
import metadata from '../metadata';

export default function BlogComponent(){
    return <div>
        <h2>Blog</h2>
        <ul>
            {metadata.getPosts().map(post=>
                <li><a href={post.route}>{post.title}</a></li>
            )}
        </ul>
    </div>
}