function TextArea({ children, left, top}) {

    return (<div style={{
        left: (left)+"px",
        top:  (top)+"px"}}
        className="project-text">
        {children}
    </div>);
}

export default TextArea;
