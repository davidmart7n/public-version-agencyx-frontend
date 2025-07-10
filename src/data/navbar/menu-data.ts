import team1 from 'assets/images/team/team-1.jpg';
import team2 from 'assets/images/team/team-2.jpg';
import team3 from 'assets/images/team/team-3.jpg';
import team4 from 'assets/images/team/team-4.jpg';
import team5 from 'assets/images/team/team-5.jpg';
import { uniqueId } from 'lodash';
import paths, { rootPaths } from 'routes/path';

export interface IProfileOptions {
  id: string;
  title: string;
  icon: string;
  href: string;
  disabled?: boolean; // Añadir la propiedad opcional 'disabled'
}


interface INotification {
  id: string;
  avatar: string;
  title: string;
  subtitle: string;
}