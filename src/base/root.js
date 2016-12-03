import React from 'react';
import DocumentMeta from 'react-document-meta';

export default function Root(props) {
    const meta = {
        ...props.meta,
        title: `Alon Bar David | ${props.meta.title}`
    }
    return (<div>
        <DocumentMeta {...meta} />
        {props.children}
    </div>)
}