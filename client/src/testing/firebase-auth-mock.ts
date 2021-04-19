import { Observable } from 'rxjs';

export class FirebaseAuthMock {

  auth = Observable.create(obs => {
    const john = { name: 'john', email: 'asg@aqega.ags', password: 'sagasgasg', uid: '123' };
    obs.next(john);
  });
  authState=new Observable((obs) => {
    const john = { name: 'john', email: 'asg@aqega.ags', password: 'sagasgasg', uid: '123' };
    obs.next(john);
  });
}
