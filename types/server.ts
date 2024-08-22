type Servers = Server[];

type Server = {
    serverId: string;
    status: number;
    name: string;
    description: string;
    pathToFolder: string;
    folderName: string;
    type: string;
    creationDate: string; 
    isSetToAutoStart: boolean;
    forceSaveOnStop: boolean;
    keepOnline: number;
    javaAllocatedMemory: number;
    javaStartupLine: string;
  };