import React from 'react';
import './summary-list.scss';

export default function SummaryList({children}) {

    return <ul class="summary-list">
        {children.map((Child,i)=>
            <li key={i}>
                {Child}
            </li>
        )}
    </ul>
};