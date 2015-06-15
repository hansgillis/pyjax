import os
import zerorpc
import schedule
from threading import Timer

try:
    import cPickle as pickle # Python 2
except:
    import pickle # Python 3

# derived from http://stackoverflow.com/a/13151299
class Cron(object):
    def __init__(self, interval):
        self._timer     = None
        self.interval   = interval
        self.is_running = False
        self.start()

    def _run(self):
        self.is_running = False
        self.start()
        schedule.run_pending()

    def start(self):
        if not self.is_running:
            self._timer = Timer(self.interval, self._run)
            self._timer.start()
            self.is_running = True

    def stop(self):
        self._timer.cancel()
        self.is_running = False

class RPCServer(object):
    def __init__(self, backup=False, backup_interval=15):
        if backup:
            schedule.every(backup_interval).seconds.do(self.save)
            Cron(1)

    def reschedule(self, backup=False, backup_interval=15):
        if backup:
            schedule.every(backup_interval).seconds.do(self.save)
            Cron(1)

    def hello(self, who):
        return "Hello %s!" % (who)

    def save(self, filename="server.pk"):
        with open(filename, 'wb') as output:
            pickle.dump(self, output, pickle.HIGHEST_PROTOCOL)

def load_server(filename="server.pk"):
    with open(filename, 'rb') as input:
        return pickle.load(input)

def main():
    os.chdir("../")

    try:
        core = load_server()
        core.reschedule()
    except:
        core = RPCServer()

    server = zerorpc.Server(core)
    server.bind("tcp://0.0.0.0:2424")
    server.run()

if __name__ == '__main__':
    main()