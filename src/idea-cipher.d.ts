declare module 'idea-cipher' {
  class IDEA {
    constructor(key: string | Uint8Array, mode?: any);
    encrypt(data: string | Uint8Array): Uint8Array;
    decrypt(data: Uint8Array): Uint8Array;
  }

  export default IDEA;
}
