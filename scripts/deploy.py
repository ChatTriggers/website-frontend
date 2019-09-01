import os
import paramiko

class MySFTPClient(paramiko.SFTPClient):
    def put_dir(self, source, target):
        ''' Uploads the contents of the source directory to the target path. The
            target directory needs to exists. All subdirectories in source are 
            created under target.
        '''
        for item in os.listdir(source):
            if os.path.isfile(os.path.join(source, item)):
                self.put(os.path.join(source, item), '%s/%s' % (target, item))
            else:
                self.mkdir('%s/%s' % (target, item), ignore_existing=True)
                self.put_dir(os.path.join(source, item), '%s/%s' % (target, item))

    def mkdir(self, path, mode=511, ignore_existing=False):
        ''' Augments mkdir by adding an option to not fail if the folder exists  '''
        try:
            super(MySFTPClient, self).mkdir(path, mode)
        except IOError:
            if ignore_existing:
                pass
            else:
                raise

transport = paramiko.Transport((os.environ["SERVER_HOST"], 22))
transport.connect(username=os.environ["SERVER_USER"], password=os.environ["SERVER_PASS"])
sftp = MySFTPClient.from_transport(transport)
sftp.mkdir("/root/web", ignore_existing=True)
sftp.mkdir("/root/web/static", ignore_existing=True)
sftp.put_dir("build/", "/root/web/static")
sftp.close()