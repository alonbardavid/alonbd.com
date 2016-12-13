import React from 'react';
import './blog-summary.scss';

export default function BlogSummary({post}) {
    var publishDate = new Date(post.publishDate);
    return <a href={post.route}>
        <div className="blog-summary">
            <h3>{post.title}</h3>
            <span className="blog-summary-date">
                {publishDate.getDate()}/{publishDate.getMonth()+1}/{publishDate.getFullYear()}
            </span>
            <span className="blog-summary-description">
                {post.description}
            </span>
        </div>
    </a>;
}