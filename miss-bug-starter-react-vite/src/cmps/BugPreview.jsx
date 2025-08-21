// BugPreview.jsx
export function BugPreview({ bug }) {
    return (
        <article>
            <h4>{bug.title}</h4>
            <h1>🐛</h1>
            <p>
                Severity: <span>{bug.severity}</span>
                <br />
                Created At: <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
                <br />
                Creator: <span>{bug.creator?.fullname || 'Unknown'}</span>
            </p>
        </article>
    )
}
