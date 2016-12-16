import React from 'react';
import metadata from 'src/metadata';
import ProjectSummary from 'src/components/project-summary';

export default function ProjectComponent(){
    return <div>
        <h2>Projects</h2>
        <ul>
            {metadata.projects.map((project,i)=>
                <li key={i}>
                    <ProjectSummary project={project} />
                </li>
            )}
        </ul>
    </div>
}