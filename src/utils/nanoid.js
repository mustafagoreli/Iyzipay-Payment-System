import { customAlphabet } from "nanoid"

const nanoid = customAlphabet("0123456789abcdefghijklmnoprstuvyzABCDEFGHIJKLMNOPRSTUVYZ", 20);
//nanoid'nin oluşucagı karakterleri belirledik

export default nanoid;

