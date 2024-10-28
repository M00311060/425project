import React, { useEffect, useState } from 'react';
import axios from 'axios';

const JobsList = () => {
    const [jobs, setJobs] = useState([]);

    useEffect(() => {
        console.log("Fetching jobs...");
        axios.get('/api/jobs') // Proxy should route this to localhost:5000/api/jobs
            .then(response => {
                console.log("Response received:", response.data); // Check response structure
                setJobs(response.data.data);
            })
            .catch(error => console.error('Error fetching jobs:', error));
    }, []);

    return (
        <div>
            <h1>Jobs List</h1>
            {jobs.length === 0 ? (
                <p>No jobs available.</p> // Display if no jobs are found
            ) : (
                <ul>
                    {jobs.map(job => (
                        <li key={job.id}>
                            {job.title} - {job.description} (${job.salary})
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default JobsList;
