import { useState } from 'react';
import TextArea from './TextArea';
import './Project.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const clamp = (value, min, max) => {
    if(value < min) return min;
    if(value > max) return max;
    return value;
}

function Project() {
    const [project, setProject] = useState({ name: 'project', dependencies: {} });
    const [elements, setElements] = useState([]);

    const [mousePosition, setMousePosition] = useState({x: -1, y: -1});
    const [currentMouse, setCurrentMouse] = useState({left: 0, top: 0});
    const [drag, setDrag] = useState(false);

    ipcRenderer.on('projectName', (e, a) => {
        console.log(a);
        setProject(a);
    })

    ipcRenderer.on('addElements', (e, a) => {
        setElements(a);
        setMousePosition({x: -1,y: -1})
    })

    const canvasSize = 5000;

    const onMouseMove = (e) => {
        if(drag && !(mousePosition.x < 0 || mousePosition.y < 0)){
            // Calculate lastFrame
            let t = {x: e.clientX - mousePosition.x, y: e.clientY - mousePosition.y};
            setCurrentMouse({left: clamp(currentMouse.left + t.x, -5000 * .75, 0), top: clamp(currentMouse.top + t.y, -5000 * .85, 0)});
            console.log(t);
        }
        setMousePosition({x: e.clientX, y: e.clientY})
    }

    return (
        <div id="project-container">
            {/* Nav */}
            <div className="project-nav">
                <h2>Dependencies</h2>
                <ul>
                    {Object.keys(project.dependencies).map(dependency => <li>{dependency}</li>)}
                </ul>
            </div>
            {/* Project */}
            <div className="project">
                <div className="project-drag"
                    onMouseDown={() => setDrag(true)}
                    onMouseUp={() => setDrag(false)}
                    onMouseMove={onMouseMove}
                    style={{width: canvasSize + "px", height:canvasSize + "px"}}>
                    <div
                style={currentMouse}>
                        {
                            elements.sort((a, b) => {
                                if (a.dependsOn.length > b.dependsOn.length) return -1;
                                if (a.dependsOn.length < b.dependsOn.length) return 1;
                                return 0;
                            }).map((element, index) => <TextArea left={0} top={index * 50}>{element.path} [{element.dependsOn.length}][{element.dependencies.length}]</TextArea>)
                        }
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Project;
