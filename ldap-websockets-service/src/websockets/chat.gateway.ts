import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayInit,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';

@WebSocketGateway()
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server;

  private listeConnected = new Map<string, string>();

  @SubscribeMessage('JOIN_CHAT')
  joiningChat(client: Socket, { username }: { username: string }): void {
    this.listeConnected.set(client.id, username);
    console.log(this.listeConnected.values());
    this.server.emit('USER_CONNECTED', Array.from(this.listeConnected.values()));
  }

  @SubscribeMessage('JOIN_ROOM')
  joiningRoom(client: Socket, { roomName }: { roomName: string }) {
    client.join(roomName);
    this.server.to(client.id).emit('ROOM_JOINED', roomName);
  }

  @SubscribeMessage('MESSAGE')
  broadcastMessage(
    client: Socket,
    msg: { text: string; sender: string; recipient: string; roomName: string },
  ) {
    this.server.to(msg.roomName).emit('MESSAGE', msg);
  }

  afterInit(server: Server) {
    //console.log('Init');
  }

  handleDisconnect(client: Socket) {
    const username = this.listeConnected.get(client.id);
    this.listeConnected.delete(client.id);
    this.server.emit("USER_DISCONNECTED", username);
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log(`Client connected: ${client.id}`);
  }
}
