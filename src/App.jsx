import './App.css'
import APIForm from './Components/APIForm';

const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;

function App() {

  return (
    <div>
      <APIForm apiKey={ACCESS_KEY}/>
    </div>
  )
}

export default App
