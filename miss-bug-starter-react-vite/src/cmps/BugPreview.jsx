// BugPreview.jsx
export function BugPreview({ bug }) {
    console.log('BugPreview render — bug severity:', bug.severity)
    return (
        <article>
            <h4>{bug.title}</h4>
            <h1>🐛</h1>
            <p>
                Severity: <span>{bug.severity}</span>
                <br />
                Created At: <span>{new Date(bug.createdAt).toLocaleDateString()}</span>
            </p>
        </article>
    )
}
