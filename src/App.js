import logo from './logo.svg';
import './App.css';

const electron = window.require('electron');
const ipcRenderer = electron.ipcRenderer;

const commenStyle = {
  width: '80%',
  margin: '10px auto',
  padding: '10px 50px',
  textAlign: 'center',
  borderRadius: '10px',
  cursor: 'pointer',
  boxSizing: 'content-box'
}

const Button = ({children, color, onClick}) =>{
  return <div onClick={() => {onClick?.()}} style={{...commenStyle, backgroundColor: color}}>
    {children}
  </div>
}

function App() {
  const functions = [
    {
      name: 'Open',
      color: 'blue',
      fn: () => {
        // Open file explorer
        ipcRenderer.send('openDir')
      }
    },
    {
      name: 'Git',
      color: 'green',
      fn: () => {
        // TODO
        alert('Git')
      }
    },
    {
      name: 'Exit',
      color: 'red',
      fn: () => {
        // Close application
        alert('Close')
      }
    }
  ]

  return (
    <div style={{margin: 'auto'}}>
      {
        functions.map(e => <Button onClick={e.fn} color={e.color}>{e.name}</Button>)
      }
    </div>
  );
}

export default App;
