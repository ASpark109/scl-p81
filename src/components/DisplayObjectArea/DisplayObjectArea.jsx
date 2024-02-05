import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js';
import Rocket from '../../mpce/testRect';
import { keyboard } from '@testing-library/user-event/dist/keyboard';

const DisplayObjectArea = () => {
  const pixiContainer = useRef();

   useEffect(() => {
    // Створюємо сцену Pixi.js
    const app = new PIXI.Application({
      width: 1500,
      height: 1300,
      backgroundColor: 0x020D19,
     });

    // Додаємо сцену до контейнера
    pixiContainer.current.appendChild(app.view);

    // Додайте ваш код Pixi.js тут, наприклад, створення спрайту

    const rocket = new Rocket(app)

    const square = new PIXI.Graphics();
    square.beginFill(0x0000ff);
    square.drawRect(0, 0, 50, 50);
    square.endFill();
    
    // Встановлюємо початкові координати
    square.x = app.screen.width / 2 - 25;
    square.y = app.screen.height / 2 - 25;

    // Додаємо спрайт до сцени
    app.stage.addChild(square);

    // Оновлюємо координати квадрата при кожному кадрі
    app.ticker.add(() => {
      square.x += 1; // Змініть це для зміни швидкості руху
      //console.log(square.x);
    });
    
    window.addEventListener("keydown", keydownHendler)

    function keydownHendler(e)
    {
      console.log(e)
      rocket.sayHi();
    }

    
    // Змінюйте розмір сцени при зміні розмірів вікна
    // const handleResize = () => {
    //   app.renderer.resize(window.innerWidth, window.innerHeight);
    // };

    // Додаємо слухач розміру вікна
    // window.addEventListener('resize', handleResize);

    // Завершуємо роботу при видаленні компонента
    return () => {
    //   window.removeEventListener('resize', handleResize);
      app.destroy(true);
    };
  }, []);

  return <div ref={pixiContainer}></div>;
};

export default DisplayObjectArea;