import React, {useEffect, useState, FC} from 'react';
import {MessageType, useMessage} from '../../../../components/Providers/MessageProvider';
import {LocationOption, Workspace, WorkspaceStatus, WorkspaceType} from '../../../../types';
import {WorkspaceService} from '../../../../services';
import {useToasterCatcher} from '../../../../hooks';
import WorkspacesScheme from './WorkspacesScheme/WorkspacesScheme';
import WorkspacesTable from './WorkspacesTable/WorkspacesTable';
import Spinner from '../../../../components/Spinner/Spinner';
import WorkspaceDialog from './WorkspaceEdit/WorkspaceDialog';

type WorkspacesListProps = {
  location: LocationOption;
  displayMode: 'scheme' | 'table';
};
const WorkspacesList: FC<WorkspacesListProps> = ({location, displayMode}) => {
  const {pushMessage} = useMessage();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const {isLoading, setLoading, catchAndTossError} = useToasterCatcher();
  const [dialog, setDialog] = useState<string | null>(null);

  const defaultWorkspace: Workspace = {
    description: 'WS',
    location: location.id,
    status: WorkspaceStatus.AVAILABLE,
    type: WorkspaceType.DESK,
    size: 1,
    equipment: []
  };
  const [workspace, setWorkspace] = useState<Workspace>(defaultWorkspace);

  useEffect(() => {
    async function fetchWorkspaces() {
      const workspaces = await catchAndTossError(WorkspaceService.list(location));
      if (workspaces) {
        setWorkspaces(() => workspaces as Workspace[]);
      }
    }

    if (location.id) {
      fetchWorkspaces();
    } else {
      setLoading(() => false);
      setWorkspaces(() => []);
    }
  }, [location]);

  const showEditDialog = (workspaceId: string) => {
    setWorkspace(() => workspaces.find((ws) => ws.id === workspaceId) as Workspace);
    setDialog(() => 'edit');
  };
  const showAddDialog = () => {
    setWorkspace((workspace) => ({...workspace, description: 'WS_' + workspaces.length}));
    setDialog(() => 'add');
  };
  const closeEditDialog = () => setDialog(() => null);

  const handleCreation = async (formData: Workspace) => {
    const requestData: Workspace = {...formData, location: location.id};
    const addedWorkspace = (await catchAndTossError(WorkspaceService.add(requestData))) as Workspace | undefined;
    if (!addedWorkspace) {
      return;
    }

    closeEditDialog();
    setWorkspaces((workspaces) => [...workspaces, addedWorkspace]);
    pushMessage({title: `Workspace "${addedWorkspace.description}" is added`, type: MessageType.SUCCESS});
  };

  const handleUpdate = async (formData: Workspace) => {
    const requestData = {...workspace, ...formData};
    const remaining = (await catchAndTossError(WorkspaceService.update(requestData))) as Workspace[] | undefined;
    if (!remaining) {
      return;
    }

    closeEditDialog();
    setWorkspace(() => requestData);
    setWorkspaces(() => remaining);
    pushMessage({title: `Workspace "${requestData.description}" is updated`, type: MessageType.SUCCESS});
  };

  const handleDeletion = async (workspaceIds: string[]) => {
    const remaining = (await catchAndTossError(WorkspaceService.remove(location, workspaceIds))) as Workspace[] | undefined;
    if (remaining) {
      setWorkspaces(() => remaining);
      pushMessage({title: 'Workspaces are deleted', type: MessageType.SUCCESS});
    }
  };

  if (isLoading) {
    return <Spinner />;
  }

  return (
    <>
      {displayMode === 'scheme' && <WorkspacesScheme workspaces={workspaces} location={location} onAdd={showAddDialog} />}
      {displayMode === 'table' && <WorkspacesTable workspaces={workspaces} onAdd={showAddDialog} onEdit={showEditDialog} onDelete={handleDeletion} />}
      {dialog === 'add' && <WorkspaceDialog mode="Add" workspace={workspace} submit={handleCreation} close={closeEditDialog} />}
      {dialog === 'edit' && <WorkspaceDialog mode="Edit" workspace={workspace} submit={handleUpdate} close={closeEditDialog} />}
    </>
  );
};

export default WorkspacesList;
