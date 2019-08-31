import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  ButtonGroup,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
  Typography,
  Theme,
  StyleRulesCallback
} from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { observer } from '~store';
import { IRelease } from '~api';
import { StyledComponent } from '~components';

interface IReleasesDialogProps {
  open: boolean;
  close(): void;
  releases: IRelease[];
}

const styles: StyleRulesCallback<Theme, {}> = (theme: Theme) => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    overflowX: 'auto'
  },
  dialogRoot: {
    maxWidth: 800
  },
  tableHeader: {
    // paddingRight: 0
    whiteSpace: 'nowrap'
  },
  table: {
    minWidth: 750
  },
  releases: {
    whiteSpace: 'pre-wrap'
  }
});

@observer
export class ReleasesDialog extends StyledComponent<typeof styles, IReleasesDialogProps> {
  public render() {
    return (
      <Dialog
        open={this.props.open}
        onClose={this.props.close}
        className={this.classes.root}
        classes={{
          paper: this.classes.dialogRoot
        }}
      >
        <DialogTitle>
          <Typography variant="h5">
            Module Releases
            </Typography>
        </DialogTitle>
        <DialogContent>
          <Table className={this.classes.table}>
            <TableHead>
              <TableRow>
                <TableCell classes={{ head: this.classes.tableHeader }}>Release Version</TableCell>
                <TableCell classes={{ head: this.classes.tableHeader }}>Mod Version</TableCell>
                <TableCell classes={{ head: this.classes.tableHeader }}>Downloads</TableCell>
                <TableCell classes={{ head: this.classes.tableHeader }}>Changelog</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {this.props.releases.map(release => (
                <TableRow key={release.id}>
                  <TableCell>{release.releaseVersion}</TableCell>
                  <TableCell>{release.modVersion}</TableCell>
                  <TableCell align="right">{release.downloads}</TableCell>
                  <TableCell className={this.classes.releases}>{release.changelog}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.props.close} variant="contained" color="secondary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ReleasesDialog);
