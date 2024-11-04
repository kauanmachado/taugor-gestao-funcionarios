import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';

export default function Employee() {
  return (
      <ListItem alignItems="flex-start" className="shadow rounded bg-white">
        <ListItemAvatar>
          <Avatar alt="Cindy Baker" src="/static/images/avatar/3.jpg" />
        </ListItemAvatar>
        <div className="flex flex-col">
        <p className="font-bold text-baseBlue">Kauan Machado</p>
        <p className="text-gray-600 text-sm">kauan@gmail.com</p>
        <p className="text-gray-600 text-sm">Desenvolvedor Web - Setor TI</p>
        </div>
      </ListItem>
  );
}
