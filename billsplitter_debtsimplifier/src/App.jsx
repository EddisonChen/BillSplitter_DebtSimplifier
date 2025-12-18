import logo from './logo.svg';
import './App.css';
import BillSplitter from './Components/BillSplitter/BillSplitter';
import MuiAlert from './MiniComponents/MuiAlert/MuiAlert';

function App() {

  return (
    <div>
      <h1 className="head">Bean Counter</h1>
      <BillSplitter/>
    </div>
  );
}

export default App;
