import { AddgroupComponent } from './addgroup/addgroup.component';
import { GrouproomComponent } from './grouproom/grouproom.component';
import { OneChatroomComponent } from './one-chatroom/one-chatroom.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RoomlistComponent } from './roomlist/roomlist.component';
import { AddroomComponent } from './addroom/addroom.component';
import { ChatroomComponent } from './chatroom/chatroom.component';
import { AddoneComponent } from './addone/addone.component';

const routes: Routes = [
  { path: 'login', loadChildren: () => import('./login/login-routing.module').then(m => m.LoginRoutingModule) },
  { path: 'roomlist', component: RoomlistComponent },
  { path: 'addroom', component: AddroomComponent },
  { path: 'addgroup' , component:AddgroupComponent},
  { path: 'addone', component: AddoneComponent},
  { path: 'chatroomone/:roomname' , component: OneChatroomComponent},
  { path: 'chatroom/:roomname', component: ChatroomComponent },
  { path: 'grouproom/:roomname', component: GrouproomComponent },
  { path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }