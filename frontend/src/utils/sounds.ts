class SoundManager {
  private static play(filename: string) {
    const audio = new Audio(`/sounds/${filename}.mp3`);
    audio.volume = 0.3;
    audio.play().catch(() => {
      // ignore auto-play errors
    });
  }

  static click() {
    this.play('click-001');
  }

  static hover() {
    this.play('click-002');
  }

  static success() {
    this.play('confirmation-001');
  }

  static error() {
    this.play('error-001');
  }
}

export default SoundManager;
