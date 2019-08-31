import React from 'react';
import { Paper, Table, TableBody, TableHead, TableCell, TableRow, Theme } from '@material-ui/core';
import { withStyles } from '@material-ui/styles';
import { StyledComponent } from '~components';
import { StyleRules } from '@material-ui/core/styles';
import { IRelease } from '~api';

interface IReleasesTableProps {
  releases: IRelease[];
}

const styles = (theme: Theme): StyleRules => ({
  root: {
    width: '100%',
    marginTop: theme.spacing(2),
    overflowX: 'auto'
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

class ReleasesTable extends StyledComponent<typeof styles, IReleasesTableProps> {
  public render() {
    return (
      <Paper
        className={this.classes.root}
        elevation={4}
        square
      >
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
      </Paper>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ReleasesTable);
