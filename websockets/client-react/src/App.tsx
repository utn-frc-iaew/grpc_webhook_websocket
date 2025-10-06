import { Chat } from './components/Chat';
import { Notifications } from './components/Notifications';

const App = () => {
  return (
    <main>
      <h1>Realtime Labs Websocket Client</h1>
      <div>
        <Chat />
        <Notifications />
      </div>
    </main>
  );
};

export default App;
