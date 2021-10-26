import "./mocks/browser.js";

import { render, useElement, useMounted, useSubject } from "./core.js";

function Auth() {
    return "Auth Component";
}

function Signatures() {
    return `Signatures Compoonent`;
}

function App() {
    const isAuthorized = useSubject(false);
    const el = useElement();

    isAuthorized.subscribe(() => {
        if (isAuthorized.value === true) {
            render(Signatures, {}, el.querySelector("#content"));
        } else {
            render(Auth, {}, el.querySelector("#content"));
        }
    });

    useMounted(() => {
        fetch("/login", {
            method: "GET",
        })
            .then((r) => r.json())
            .then((result) => {
                isAuthorized.next(result);
            });
    });

    return `
        <div id="content">Loading...</div>
    `;
}

render(App, {}, document.getElementById("root"));
