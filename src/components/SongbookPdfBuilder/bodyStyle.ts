export const bodyStyle = `section {
    margin-top: 24px;
    display: flex;
    flex-direction: column;
    break-inside: avoid;
    min-width: 335px;
}

article {
    break-after: page;
    break-inside: avoid-page;
    padding: 32px 64px 32px 60px;
    width: 670px;
    max-width: 670px;
    min-width: 670px;
    height: 1050px;
    min-height: 1050px;
    max-height: 1050px;
    margin-bottom: 2px;
    background: white;
}

div.song-body {
    display: flex;
    flex-flow: column wrap;
    height: calc(100% - 94px);
}

body {
    margin: 0;
    width: 794px;
    background: gray;
    overflow: overlay;
    font-family: Calibri, sans-serif
}

button {
    color: #575757;
    border-radius: 6px;
    border: none;
    font-size: 11px;
    height: 20px;
    transition: background-color 0.2s ease-in-out;
}

button:hover {
    background-color: #D7D7D7;
}`;

