import React from 'react';
import metadata from 'src/metadata';
import ProjectSummary from 'src/components/project-summary';
import SummaryList from 'src/components/summary-list/summary-list';

export default function ProjectPage(){
    return <div>
        <h2>Projects</h2>
        <SummaryList>
            {metadata.projects.map(project=> <ProjectSummary project={project} />
            )}
        </SummaryList>
    </div>
}