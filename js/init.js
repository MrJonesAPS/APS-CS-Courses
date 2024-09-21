import mermaid from "https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.esm.min.mjs"; 

// Initial Mermaid graph definition
let mainGraph = `
subgraph Recommended Start
    F[Intro to IT]
    click F it_desc
end

subgraph Standard Path
    F --> B[Programming]
    click B call load_md_course("md/prog.md")
    B --> G[Computer Programming Advanced]
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
    subgraph Core DE CS Classes
        D[Web Page Design] --> I[DE Computer Programming] 
        click D call load_md_course("md/web.md")
        click I call load_md_course("md/de_prog_1.md")
    end
    subgraph NOVA CS Associates
        H --> J[DE Computer Programming Intensified]
        click J call load_md_course("md/de_prog_2.md")
        I --> J
        J --> K[DE Computer Programming Advanced]
        click K call load_md_course("md/de_prog_3.md")
    end
    subgraph NOVA Web Certificate
        I --> L[Database Design & Management]
        click L call load_md_course("md/db.md")
    end

end
`;

let ibgraph = `
subgraph Courses only at WLHS
    M[IB CS SL/HL I] --> N[IB CS HL II]
    click M call load_md_course("md/ib_1.md")
    click N call load_md_course("md/ib_2.md")
    
end
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
subgraph APCSA
    H[AP CS A]
    click H call load_md_course("md/apcsa.md")
end
`

// initialize the variable where we build the graph
// and an array to store added nodes (so we can track if they exist)
let graphDefinition = mainGraph;
let addedNodes = ['main'];

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
        } else {
            addedNodes = addedNodes.filter(node => node !== 'acc');
            event.target.classList.remove('active');
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