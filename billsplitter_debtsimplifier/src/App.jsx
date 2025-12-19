import logo from './logo.svg';
import './App.css';
import BillSplitter from './Components/BillSplitter/BillSplitter';
import MuiAlert from './MiniComponents/MuiAlert/MuiAlert';

function App() {
  const parties = ["Stacey", "Blastoise"]
  return (
    <div>
      <h1 className="big-head">Bean Counter</h1>
      <BillSplitter/>
    </div>
  );
}

export default App;
