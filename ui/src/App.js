import logo from "./logo.svg";
import "./App.css";
import StripeContainer from "./components/StripeContainer";
import watch from "./assets/smart_watch.webp";
import { useState } from "react";

function App() {
  const [showItem, setShowItem] = useState(false);
  return (
    <div className="App">
      <h1>Payment Demo!</h1>
      {/* {showItem ? (
        <StripeContainer />
      ) : (
        <>
          <center><img src={watch} alt="watch" /></center>
          <h3>Rs. 8000</h3>
          <button onClick={() => setShowItem(true)}>Buy Now</button>
        </>
      )} */}
      <StripeContainer />
    </div>
  );
}

export default App;
