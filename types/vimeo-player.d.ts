declare module '@vimeo/player' {
  export default class Player {
    constructor(element: HTMLIFrameElement);
    destroy(): Promise<void>;
    off(event: string, callback: () => void): void;
    on(event: string, callback: () => void): void;
    pause(): Promise<void>;
    play(): Promise<void>;
    ready(): Promise<void>;
  }
}
