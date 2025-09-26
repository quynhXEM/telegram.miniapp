import Phaser from "phaser";

class ClickScene extends Phaser.Scene {
  constructor() {
    super("ClickScene");
    this.score = 0;
  }

  preload() {
    this.load.image("btn", "https://i.ibb.co/qdMGX7Q/button.png"); // nút demo
  }

  create() {
    this.add.text(100, 50, "🎁 Click để nhận thưởng", { fontSize: "24px", fill: "#000" });
    this.scoreText = this.add.text(100, 100, "Điểm: 0", { fontSize: "20px", fill: "#000" });

    const button = this.add.image(200, 200, "btn").setInteractive();
    button.setScale(0.5);

    button.on("pointerdown", async () => {
      this.score += 10;
      this.scoreText.setText("Điểm: " + this.score);

      // Gọi API claim (không có token client-side, cookie HttpOnly dùng)
      const res = await fetch("/api/claim", { method: "POST" });
      const data = await res.json();
      console.log("Server response:", data);
    });
  }
}

const config = {
  type: Phaser.AUTO,
  width: 400,
  height: 300,
  backgroundColor: "#f0f0f0",
  scene: [ClickScene]
};

new Phaser.Game(config);
