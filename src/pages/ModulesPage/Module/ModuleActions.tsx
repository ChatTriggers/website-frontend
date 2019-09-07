import React from 'react';
import clsx from 'clsx';
import { Button, Theme, Tooltip } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { Link } from 'react-scroll';
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
  opened: boolean;
  setOpenDialog(openDialog?: 'edit' | 'delete' | 'releases'): void;
}

class ModuleActions extends StyledComponent<typeof styles, IModuleActionsProps> {
  private readonly onClickReleases = this.props.setOpenDialog.bind(this, 'releases');

  private readonly onClickEditModule = this.props.setOpenDialog.bind(this, 'edit');

  private readonly onClickDeleteModule = this.props.setOpenDialog.bind(this, 'delete');

  public render() {
    const releasesButton = (
      <Button
        className={this.classes.button}
        fullWidth
        size="small"
        variant="contained"
        onClick={this.onClickReleases}
        disabled={this.props.module.releases.length === 0 && !this.props.authed}
      >
        {this.props.authed ? 'Manage' : 'View'} Releases
      </Button>
    );

    return (
      <>
        <div className={this.props.className}>
          <Tooltip
            title="This module has no releases"
            placement="top"
            open={this.props.module.releases.length === 0 ? undefined : false}
          >
            <div>
              {this.props.opened ? releasesButton : (
                <Link to={`module-${this.props.module.id}`} smooth offset={-30} duration={500}>
                  {releasesButton}
                </Link>
              )}
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
