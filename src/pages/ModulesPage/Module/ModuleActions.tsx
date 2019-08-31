import React from 'react';
import clsx from 'clsx';
import { Button, Theme, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { observer, observable, action } from '~store';
import EditModuleDialog from '~modules/Dialogs/EditModuleDialog';
import DeleteModuleDialog from '~modules/Dialogs/DeleteModuleDialog';
import ReleasesDialog from '~modules/Dialogs/ReleasesDialog';
import { StyledComponent } from '~components';
import { IModule } from '~api';

const styles = (theme: Theme) => ({
  root: {
    width: '100%'
  },
  button: {
    marginBottom: 10
  },
  buttonEdit: {
    backgroundColor: '#ffeb3b'
  },
  buttonDelete: {
    backgroundColor: theme.palette.error.main,
    color: theme.palette.error.contrastText
  }
});

interface IModuleActionsProps {
  className?: string;
  authed: boolean;
  module: IModule;
}

@observer
class ModuleActions extends StyledComponent<typeof styles, IModuleActionsProps> {
  @observable
  private openDialog: 'edit' | 'delete' | 'releases' | undefined;

  @action
  private readonly onDialogClose = () => {
    this.openDialog = undefined;
  }

  @action
  private readonly onClickEditModule = () => {
    this.openDialog = 'edit';
  }

  @action
  private readonly onClickDeleteModule = () => {
    this.openDialog = 'delete';
  }

  @action
  private readonly onClickReleases = () => {
    this.openDialog = 'releases';
  }

  public render() {
    const releasesButton = (
      <Button
        className={this.classes.button}
        fullWidth
        size="small"
        variant="contained"
        onClick={this.onClickReleases}
        disabled={this.props.module.releases.length === 0}
      >
        View Releases
      </Button>
    );

    return (
      <>
        <EditModuleDialog
          open={this.openDialog === 'edit'}
          close={this.onDialogClose}
          moduleId={this.props.module.id}
          description={this.props.module.description}
          image={this.props.module.image}
          tags={this.props.module.tags}
        />
        <DeleteModuleDialog
          open={this.openDialog === 'delete'}
          close={this.onDialogClose}
          moduleId={this.props.module.id}
        />
        <ReleasesDialog
          open={this.openDialog === 'releases'}
          close={this.onDialogClose}
          releases={this.props.module.releases}
        />
        <div className={this.props.className}>
          <Tooltip
            title="This module has no releases"
            placement="top"
            open={this.props.module.releases.length === 0 ? undefined : false}
          >
            <div>
              <Button
                className={this.classes.button}
                fullWidth
                size="small"
                variant="contained"
                onClick={this.onClickReleases}
                disabled={this.props.module.releases.length === 0}
              >
                View Releases
              </Button>
            </div>
          </Tooltip>
          {this.props.authed && (
            <>
              <Button
                className={clsx(this.classes.button, this.classes.buttonEdit)}
                fullWidth
                size="small"
                variant="contained"
                onClick={this.onClickEditModule}
              >
                Edit Module
              </Button>
              <Button
                className={clsx(this.classes.button, this.classes.buttonDelete)}
                fullWidth
                size="small"
                variant="contained"
                onClick={this.onClickDeleteModule}
              >
                Delete Module
              </Button>
            </>
          )}
        </div>
      </>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ModuleActions);
