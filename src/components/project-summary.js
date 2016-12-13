import React from 'react';


export default function ProjectSummary({project}) {
    return <a href={project.url} target="blank">
        <div className="project-summary">
            <h3>{project.title}</h3>
            <span className="project-summary-description">
                {project.description}
            </span>
        </div>
    </a>;
}