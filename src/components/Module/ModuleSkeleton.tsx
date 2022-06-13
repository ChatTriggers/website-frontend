import { Paper, Theme, withTheme, withWidth } from '@material-ui/core';
import { Skeleton } from '@material-ui/lab';
import { makeStyles } from '@material-ui/styles';

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    [theme.breakpoints.only('xs')]: {
      margin: theme.spacing(2),
    },
    [theme.breakpoints.between('sm', 'md')]: {
      margin: theme.spacing(3),
    },
    [theme.breakpoints.up('lg')]: {
      margin: theme.spacing(4),
      padding: theme.spacing(1),
      maxWidth: `calc(1000px - ${theme.spacing(1) * 2}px)`,
      width: '100%',
    },
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  titleContainer: {
    padding: theme.spacing(2, 0, 0, 2),
    width: `calc(100% - 64px - ${theme.spacing(2) * 3}px)`,
  },
  title: {
    [theme.breakpoints.only('xs')]: {
      width: '100%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '40%',
    },
  },
  author: {
    marginTop: 0,
    [theme.breakpoints.only('xs')]: {
      width: '70%',
    },
    [theme.breakpoints.up('sm')]: {
      width: '20%',
    },
  },
  titleChip: {
    display: 'flex',
  },
  versionChip: {
    marginRight: theme.spacing(1),
  },
  body: {
    display: 'flex',
    flexDirection: 'column',
    padding: theme.spacing(0, 2, 0, 2),
  },
  imageOuter: {
    alignSelf: 'center',
    justifySelf: 'center',
    flexGrow: 1,
    paddingLeft: 0,
  },
  image: {
    maxWidth: `calc(100vw - ${theme.spacing(2) * 4}px)`,
    maxHeight: '180px',
  },
  actions: {
    width: '300px',
  },
  markdownViewer: {
    paddingBottom: theme.spacing(1),
  },
  viewButton: {
    margin: theme.spacing(4, 2, 2, 0),
  },
}));

interface IModuleSkeletonProps {
  theme: Theme;
  width: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
}

export default withTheme(
  withWidth()(({ theme, width: deviceWidth }: IModuleSkeletonProps) => {
    const classes = useStyles();

    return (
      <Paper className={classes.root} square>
        <div className={classes.header}>
          <div className={classes.titleContainer}>
            <div className={classes.titleChip}>
              <Skeleton className={classes.title} height={24} />
            </div>
            <Skeleton className={classes.author} />
          </div>
          <Skeleton className={classes.viewButton} />
        </div>
        <div className={classes.body}>
          <div className={classes.markdownViewer}>
            {(() => {
              let short = false;

              const desktop = deviceWidth === 'lg' || deviceWidth === 'xl';

              let normalLengthVariation: number;
              let shortLengthVariation: number;
              const minNormalLines = 2;
              const shortLineProb = 0.7;
              const units = desktop ? '%' : 'vw';

              return Array(Math.floor(Math.random() * 4 + 3))
                .fill(undefined)
                .map((_, i) => i)
                .map(n => {
                  if (desktop) {
                    normalLengthVariation = Math.random() * 10 + 5;
                    shortLengthVariation = Math.random() * 20 + 40;
                  } else {
                    normalLengthVariation = Math.random() * 20 + 10;
                    shortLengthVariation = Math.random() * 20 + 60;
                  }

                  short = !short && Math.random() <= shortLineProb && n > minNormalLines;
                  const width = `calc(100${units} - ${
                    desktop ? 0 : theme.spacing(2) * 2
                  }px -
                            ${
                              short ? shortLengthVariation : normalLengthVariation
                            }${units})`;

                  return <Skeleton key={n} style={{ width }} />;
                });
            })()}
          </div>
        </div>
      </Paper>
    );
  }),
);
