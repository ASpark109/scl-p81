import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {
  BrowserRouter,
  Routes,
  Route
} from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));

const doRender = () => {
  root.render(
    <BrowserRouter>
      <Routes>
        <Route path = "/" element = {<App />}></Route>
      </Routes>
    </BrowserRouter>
  );
};

if (document.fonts && document.fonts.ready) {
  document.fonts.ready.then(() => {
    doRender();
  }).catch(() => {
    doRender();
  });
} else {
  doRender();
}