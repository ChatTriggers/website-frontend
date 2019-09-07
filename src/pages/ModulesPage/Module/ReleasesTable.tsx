import React from 'react';
import { TextField, Theme, Button, Container } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { StyleRules } from '@material-ui/core/styles';
import MaterialTable, { Column, EditComponentProps } from 'material-table';
import { toJS } from 'mobx';
import { StyledComponent } from '~components';
import { IRelease, createRelease, IModule, BASE_URL } from '~api';
import { modulesStore, authStore, action } from '~store';
import { updateRelease, deleteRelease } from '~api/raw';

interface IReleasesTableProps {
  module: IModule;
  style?: React.CSSProperties;
}

const styles = (theme: Theme): StyleRules => ({
  root: {
    margin: theme.spacing(5),
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2)
  }
});

class ReleasesTable extends StyledComponent<typeof styles, IReleasesTableProps> {
  private fileInput = React.createRef<HTMLInputElement>();

  private get module() {
    return this.props.module;
  }

  private columns: Array<Column<IRelease>> = [
    {
      title: 'Release Version',
      field: 'releaseVersion',
      editable: 'onAdd'
    },
    {
      title: 'Mod Version',
      field: 'modVersion'
    },
    {
      title: 'Downloads',
      field: 'downloads',
      editable: 'never'
    },
    {
      title: 'Scripts',
      field: 'scripts',
      editComponent: props => {
        return (
          <>
            <input
              ref={this.fileInput}
              id="module-file-upload"
              accept=".zip"
              type="file"
            />
            <label htmlFor="module-file-upload">
              <Button
                color="secondary"
                variant="contained"
              >
                Upload Scripts
              </Button>
            </label>
          </>
        );
      },
      render: release => {
        const onClick = async () => {
          window.open(`${BASE_URL}/modules/${this.module.id}/releases/${release.id}?file=scripts`, 'scripts.zip');
        };

        return (
          <div>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={onClick}
            >
              Download
            </Button>
          </div>
        );
      }
    },
    {
      title: 'Changelog',
      field: 'changelog',
      editComponent: (props: EditComponentProps<IRelease>) => {
        const onChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>) => {
          event.persist();
          props.onChange(event.target.value);
        };

        return (
          <TextField
            multiline
            value={props.value}
            onChange={onChange}
          />
        );
      },
      render: release => (
        <div style={{ whiteSpace: 'pre-wrap' }}>
          {release.changelog}
        </div>
      )
    }
  ];

  private onRowAdd = async (release: IRelease): Promise<void> => {
    console.log('before onRowAdd: ', release);
    release.scripts = (this.fileInput.current && this.fileInput.current.files && this.fileInput.current.files[0]) || undefined;
    console.log('after onRowAdd: ', release);

    if (!release.scripts) return;
    console.log(1);

    try {
      await createRelease(this.module.id, release.releaseVersion, release.modVersion, release.scripts, release.changelog);
      console.log(2);
    } catch (e) {
      console.log(3);
      // TODO: Handle error
      console.error(e);
    }

    action(() => {
      console.log(4);
      const moduleIndex = modulesStore.modules.findIndex(m => m.id === this.module.id);
      console.log(5);

      if (moduleIndex === -1)
        throw new Error('Module id is unrecognized, this should never happen');
      console.log(6);

      modulesStore.modules[moduleIndex] = {
        ...modulesStore.modules[moduleIndex],
        releases: [...modulesStore.modules[moduleIndex].releases, release]
      };

      console.log(7);
    })();
  }

  private onRowUpdate = async (release: IRelease, oldRelease?: IRelease): Promise<void> => {
    const modVersion = oldRelease ? (
      release.modVersion === oldRelease.modVersion ? undefined : release.modVersion
    ) : undefined;

    const changelog = oldRelease ? (
      release.changelog === oldRelease.changelog ? undefined : release.changelog
    ) : undefined;

    try {
      await updateRelease(this.module.id, release.id, modVersion, changelog);
    } catch (e) {
      console.error(e);
    }

    action(() => {
      const moduleIndex = modulesStore.modules.findIndex(m => m.id === this.module.id);

      if (moduleIndex === -1)
        throw new Error('Module id is unrecognized, this should never happen');

      modulesStore.modules[moduleIndex].releases = [
        ...modulesStore.modules[moduleIndex].releases.filter(r => r.id !== release.id),
        {
          ...release,
          modVersion: modVersion || (oldRelease && oldRelease.modVersion) || release.modVersion,
          changelog: changelog || (oldRelease && oldRelease.changelog) || release.changelog
        }
      ];
    })();
  }

  private onRowDelete = async (release: IRelease) => {
    deleteRelease(this.module.id, release.id);

    action(() => {
      modulesStore.modules = [
        ...modulesStore.modules.filter(m => m.id !== this.module.id)
      ];
    })();
  }

  get authed() {
    return authStore.user && authStore.user.id === this.module.owner.id;
  }

  public render() {
    return (
      <div className={this.classes.root}>
        <MaterialTable
          title="Module Releases"
          columns={this.columns}
          data={toJS(this.module.releases)}
          components={{
            Container: Container
          }}
          options={{
            rowStyle: {
              padding: 0
            }
          }}
          editable={this.authed ? {
            onRowAdd: this.onRowAdd,
            onRowUpdate: this.onRowUpdate,
            onRowDelete: this.onRowDelete
          } : undefined}
        />
      </div>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ReleasesTable);
