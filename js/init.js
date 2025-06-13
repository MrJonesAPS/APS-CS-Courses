import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs"; 

// Initial Mermaid graph definition
let mainGraph = `
subgraph Recommended Start
    F[Intro to IT]
    click F call load_md_course("md/it.md")
end

subgraph Standard Path
    F --> B[Programming]
    click B call load_md_course("md/prog.md")
    B --> G[Advanced Programming]
    click G call load_md_course("md/advprog.md")
    G --> H[AP CS A]
    click H call load_md_course("md/apcsa.md")
end`;

let feeders = `
subgraph Optional Feeder Classes
    C[AP CS Principles]
    click C call load_md_course("md/apcsp.md")
    E[Game Design]
    click E call load_md_course("md/game.md")
    O[Robotics]
    click O call load_md_course("md/robo.md")
end 

C --> G[Computer Programming Advanced]
click G call load_md_course("md/advprog.md")
E --> B[Programming]
click B call load_md_course("md/prog.md")
O --> B
`

let accgraph = `
subgraph Courses only at ACC
    subgraph S0["Recommended Core Course"]
        D[Web Page Design<br>ITD110/ITD210]
        click D call load_md_course("md/web.md")
    end    
    
    subgraph S1["NOVA CS Associates"]
        I[DE Computer Programming I<br><span id="csc221">CSC221</span>/<span id="itp225">ITP225</span>]
        click I call load_md_course("md/de_prog_1.md")
        H --> J[DE Computer Programming II<br><span id="csc222">CSC222</span>/<span id="csc208">CSC208</span>]
        click J call load_md_course("md/de_prog_2.md")
        I --> J
        J --> K[DE Computer Programming III<br><span id="csc215">CSC215</span>/<span id="csc223">CSC223</span>]
        click K call load_md_course("md/de_prog_3.md")
    end
    subgraph S2["NOVA Web Certificate"]
        I --> L[DE Database Design & Management<br><span id="ite140">ITE140</span>/<span id="itd256">ITD256</span>]
        click L call load_md_course("md/db.md")
    end
    subgraph S3[Cybersecurity]
        P[DE Cybersecurity I<br><span id="itn106">ITN106</span>/<span id="itn107">ITN107</span>/<span id="ite152">ITE152</span>/<span id="itn101">ITN101</span>]
        click P call load_md_course("md/cyber_1.md")
        P --> Q[DE Cybersecurity II<br><span id="itn260">ITN260</span>/<span id="itn261">ITN261</span>/<span id="itn262">ITN262</span>/<span id="itn263">ITN263</span>]
        click Q call load_md_course("md/cyber_2.md")
        Q --> R[DE Cybersecurity III<br><span id="itn200">ITN200</span>/<span id="itn266">ITN266</span>/<span id="itn170">ITN170</span>]
        click R call load_md_course("md/cyber_3.md")
    end
    subgraph S4["Graphic Design"]
        S[Graphic Communications System]
        click S call load_md_course("md/graphic.md")
        T[Digital Animation]
        click T call load_md_course("md/animation.md")
    end
    S0 --> S1
    S0 --> S3
    S0 --> S4

end
`;

let ibgraph = `
subgraph Courses only at WLHS
    M[IB CS SL/HL I] --> N[IB CS HL II]
    click M call load_md_course("md/ib_1.md")
    click N call load_md_course("md/ib_2.md")
    
end
M --> H
B[Programming] --> M
H --> N
click B call load_md_course("md/prog.md")
`

/* This fixes an annoying issue
Depending on which order you declare the flow chart,
some of the arrows end up crossing. This happens a lot with APCSA
Depending on which items are selected, sometimes we need to 
declare APCSA on its own. This works for now, but
as far as I can tell this behavior is undocumented.
And I noticed slight differences between behavior here
and on mermaid.live*/
let apcsa_standalone = `
subgraph APCSA["At Home School"]
    H[AP CS A]
    click H call load_md_course("md/apcsa.md")
end
`

// initialize the variable where we build the graph
// and an array to store added nodes (so we can track if they exist)
let graphDefinition = mainGraph;

const urlParams = new URLSearchParams(window.location.search);
const school = urlParams.get('school');
let addedNodes;
let deDisclaimer = false;

if (school === 'acc') {
    addedNodes = ['acc'];
    deDisclaimer = true;
    document.getElementById("toggleACC").classList.add("active"); 
} else if (school === 'ib') {
    addedNodes = ['ib'];
    document.getElementById("toggleIB").classList.add("active"); 
} else {
    addedNodes = ['main'];
    document.getElementById("toggleMain").classList.add("active"); 
}

// Function to render the graph
function renderGraph() {
    graphDefinition = `graph TD`;

    if (addedNodes.includes('main') || addedNodes.includes('feeders')){
        graphDefinition += `
        subgraph Courses at Home Schools
        `;
        if (addedNodes.includes('main')) {
            graphDefinition += mainGraph;
        }
        if (addedNodes.includes('feeders')){
            graphDefinition += feeders;
        }
        graphDefinition += `
        end
        `
    } else if(addedNodes.includes('acc') || addedNodes.includes('ib')){
        //see comment on apcsa_standalone above
        graphDefinition += apcsa_standalone;
    }
    if (addedNodes.includes('acc')){
        graphDefinition += accgraph;
    }
    if (addedNodes.includes('ib')){
        graphDefinition += ibgraph;
    }


    
    
    document.getElementById("graph-container").innerHTML = `<div class="mermaid">${graphDefinition}</div>`;
    mermaid.init({
        securityLevel: 'loose',
    });


    if (deDisclaimer) {
        const graphContainer = document.getElementById("graph-container");
        let infoDiv = document.getElementById("graph-info");
        if (!infoDiv) {
            infoDiv = document.createElement("div");
            infoDiv.id = "graph-info";
            const infoP = document.createElement("p");
            infoP.textContent = `Note: NOVA Associates degree requirements are complex,
            and include other requirements not described here. The classes highlighted
            here are suggestions, and there might be other combinations of classes
            that fulfill them. Consult with your counselor if you plan
        to pursue one of these pathways.`;
            infoDiv.appendChild(infoP);
            graphContainer.parentNode.insertBefore(infoDiv, graphContainer.nextSibling);
        }
    } else {
        const infoDiv = document.getElementById("graph-info");
        if (infoDiv) {
            infoDiv.parentNode.removeChild(infoDiv);
        }
    }

    // Add dropdown for highlighting required courses for NOVA Degree if ACC is selected
    let highlightContainer = document.getElementById("highlight-container");
    if (addedNodes.includes('acc')) {
        if (!highlightContainer) {
            highlightContainer = document.createElement("div");
            highlightContainer.id = "highlight-container";
            highlightContainer.style.marginTop = "1em";
            highlightContainer.innerHTML = `
                <label for="nova-degree-select"><strong>Highlight required courses for NOVA Degree:</strong></label>
                <select id="nova-degree-select" style="margin-left: 0.5em;">
                    <option value="">-- Select --</option>
                    <option value="cs">Associates in Computer Science</option>
                    <option value="cyber">Associates in IT (cybersecurity focus)</option>
                    <option value="db">Associates in IT (database focus)</option>
                </select>
            `;
            let infoDiv = document.getElementById("graph-info");
            if (infoDiv) {
                infoDiv.insertBefore(
                    highlightContainer,
                    infoDiv.firstChild
                );
            } else {
                document.getElementById("graph-container").parentNode.insertBefore(
                    highlightContainer,
                    document.getElementById("graph-container")
                );
            }
        }
        // Add event listener for dropdown
        document.getElementById("nova-degree-select").onchange = function(e) {
            // Remove previous highlights
            document.querySelectorAll(".nova-highlight").forEach(el => {
                el.classList.remove("nova-highlight");
            });
            // Highlight based on selection
            const val = e.target.value;
            // Map degree to node IDs (these should match the mermaid node IDs)
            const degreeMap = {
                //cs is already established. should we include web?
                cs: ["csc221", "csc222", "csc208","csc223","csc215"],

                //for cyber, they need ite152, 5 electives, and 
                // a 4 credit programming class. does 
                // csc221 count (only 3 credits)?
                cyber: ["ite152", "itn106", "itn107","itn101","itn260","itn261","csc221"], 

                //for database, they need ite152, 5 electives,
                //and a programming class.
                //same question about csc221
                //this is 2 electives. 
                db: ["ite152", "csc221","ite140","itd256","itn106","itn107","itn101"]
            };
            if (degreeMap[val]) {
                degreeMap[val].forEach(id => {
                    // Find the span for the node in the rendered SVG
                    const node = document.getElementById(id);
                    if (node) node.classList.add("nova-highlight");
                });
            }
        };
    } else if (highlightContainer) {
        highlightContainer.parentNode.removeChild(highlightContainer);
    }



}

window.load_md_course = function(file){
    fetch(file)
    //.then(res => response.)
    .then(response => {
        if (!response.ok) {
        // If the file is not found (status 404), throw an error
        throw new Error('File not found');
        }
        return response.text();
    })
    .then(mdContent => {
    showdown.setOption('tables','true');
    var conv = new showdown.Converter();
    var md_html = conv.makeHtml(mdContent);
    document.getElementById('courseDescription').innerHTML = md_html;
    })
    .catch(error => {
        console.log(error);
        document.getElementById('courseDescription').innerHTML = 'Sorry, this course does not have a description yet!';
    });
}

export function init(){
    // Render the initial graph
    renderGraph();

    //setup toggle button behavior
    document.getElementById("toggleACC").addEventListener("click", (event) => {
        if (!addedNodes.includes('acc')) {
            addedNodes.push('acc');
            event.target.classList.add('active');
            deDisclaimer = true;
        } else {
            addedNodes = addedNodes.filter(node => node !== 'acc');
            event.target.classList.remove('active');
            deDisclaimer = false;
        }
        renderGraph();
    });

    document.getElementById("toggleIB").addEventListener("click", (event) => {
        if (!addedNodes.includes('ib')) {
            addedNodes.push('ib');
            event.target.classList.add('active');
        } else {
            addedNodes = addedNodes.filter(node => node !== 'ib');
            event.target.classList.remove('active');
        }
        renderGraph();
    });

    document.getElementById("toggleFeeders").addEventListener("click", (event) => {
        if (!addedNodes.includes('feeders')) {
            addedNodes.push('feeders');
            event.target.classList.add('active');
        } else {
            addedNodes = addedNodes.filter(node => node !== 'feeders');
            event.target.classList.remove('active');
        }
        renderGraph();
    });

    document.getElementById("toggleMain").addEventListener("click", (event) => {
        console.log("clicked toggle main");
        if (!addedNodes.includes('main')) {
            addedNodes.push('main');
            event.target.classList.add('active');
        } else {
            addedNodes = addedNodes.filter(node => node !== 'main');
            event.target.classList.remove('active');
        }
        renderGraph();
    });
}