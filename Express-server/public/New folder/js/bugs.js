console.log('Hello, World!');

async function onGetBugs() {
    const elBugList = document.querySelector('pre')
    const res = await fetch('/api/bug')
    const bugs = await res.json()

    elBugList.innerText = JSON.stringify(bugs, null, 4)
}