import io from 'socket.io-client';
import { genFirstView } from './first';

export const socket = io('http://localhost:3000');
export const container = document.getElementById('container');

genFirstView();
