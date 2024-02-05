// Rocket.js
import * as PIXI from 'pixi.js';

class Rocket {
  constructor(app) {
    // Створюємо спрайт ракети
    // this.rocketSprite = new PIXI.Sprite.from('../assets/images/space.png'); // Вставте свій шлях до зображення ракети

    // Встановлюємо початкові координати
    // this.rocketSprite.x = app.screen.width / 2 - this.rocketSprite.width / 2;
    // this.rocketSprite.y = app.screen.height - this.rocketSprite.height;

    // Додаємо спрайт ракети до сцени
    // app.stage.addChild(this.rocketSprite);

    // Зберігаємо посилання на об'єкт сцени для подальшого використання
    const r = new PIXI.Graphics();
    r.beginFill(0x00ffff);
    r.drawRect(5, 5, 50, 50);
    r.endFill();

    app.stage.addChild(r);

    this.app = app;
  }

  sayHi()
  {
    console.log("Rocket here");
    this.r.x += 4;
  }

  destroy() {
    // Видаляємо спрайт ракети з сцени
    this.app.stage.removeChild(this.rocketSprite);
  }
}

export default Rocket;