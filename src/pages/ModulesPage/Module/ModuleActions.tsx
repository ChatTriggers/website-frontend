import React from 'react';
import clsx from 'clsx';
import { Button, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { observer, observable, action } from '~store';
import EditModuleDialog from '~src/pages/ModulesPage/Dialogs/EditModuleDialog';
import DeleteModuleDialog from '~src/pages/ModulesPage/Dialogs/DeleteModuleDialog';
import { StyledComponent } from '~components';

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
  moduleId: number;
  description: string;
  image?: string;
  tags?: string[];
}

@observer
class ModuleActions extends StyledComponent<typeof styles, IModuleActionsProps> {
  @observable
  private editDialogOpen = false;

  @observable
  private deleteDialogOpen = false;

  @action
  private readonly onEditDialogClose = () => {
    this.editDialogOpen = false;
  }

  @action
  private readonly onClickEditModule = () => {
    this.editDialogOpen = true;
    this.deleteDialogOpen = false;
  }

  @action
  private readonly onDeleteDialogClose = () => {
    this.deleteDialogOpen = false;
  }

  @action
  private readonly onClickDeleteModule = () => {
    this.editDialogOpen = false;
    this.deleteDialogOpen = true;
  }

  public render() {
    return (
      <>
        <EditModuleDialog
          open={this.editDialogOpen}
          close={this.onEditDialogClose}
          moduleId={this.props.moduleId}
          description={this.props.description}
          image={this.props.image}
          tags={this.props.tags}
        />
        <DeleteModuleDialog
          open={this.deleteDialogOpen}
          close={this.onDeleteDialogClose}
          moduleId={this.props.moduleId}
        />
        <div className={this.props.className}>
          <Button
            className={this.classes.button}
            fullWidth
            size="small"
            variant="contained"
          >
            View Releases
          </Button>
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
