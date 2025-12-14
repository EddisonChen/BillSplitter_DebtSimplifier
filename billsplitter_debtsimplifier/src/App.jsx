import logo from './logo.svg';
import './App.css';
import BillSplitter from './Components/BillSplitter/BillSplitter';

function App() {

  const parties = ["bill", "james"]
  return (
    <div>
      <BillSplitter parties={parties}/>
    </div>
  );
}

export default App;
