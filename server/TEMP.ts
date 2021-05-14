/* eslint-disable */
export {router as login} from './login.router';
export {router as logout} from './logout.router';
export {router as checkin} from './checkin.router';
export {router as forgotPassword} from './forgotPassword.router';



router.get('/', checkSession(true), checkRole(UserRole.ADMIN), userController.getUsers) => Users[]
router.post('/', userController.createUser) => User
router.patch('/:id', checkSession(true), checkUserUpdate(), userController.updateUser) => UpdatedUser // change details (user), password (user) or role (admin); findOneAndUpdate
router.delete('/:id', checkSession(true), checkRole(UserRole.ADMIN), userController.deleteUser) => User

const checkUserUpdate = (req: Request, res: Response, next: NextFunction) => {
  if (req.body.role) return checkRole(UserRole.ADMIN);
  return next();
}




const filter = { name: 'Jean-Luc Picard' };
const update = { age: 59 };
// bcrypt password
const doc = await User.findOneAndUpdate(filter, update, {new: true});

const params = req.params;

export {router as register} from './register.router';
export {router as updateUser} from './updateUser.router';
export {router as changePassword} from './changePassword.router';
export {router as changeRole} from './changeRole.router';
export {router as getUsers} from './getUsers.router';
export {router as deleteUsers} from './deleteUsers.router';

export {router as getLocations} from './getLocations.router';
export {router as addLocation} from './addLocation.router';
export {router as renameLocation} from './renameLocation.router';
export {router as deleteLocation} from './deleteLocation.router';
export {router as getWorkspaces} from './getWorkspaces.router';
export {router as addWorkspace} from './addWorkspace.router';
export {router as updateWorkspace} from './updateWorkspace.router';
export {router as deleteWorkspaces} from './deleteWorkspaces.router';
export {router as findWorkspaces} from './findWorkspaces.router';
export {router as getReservations} from './getReservations.router';
export {router as addReservation} from './addReservation.router';
export {router as updateReservation} from './updateReservation.router';
export {router as deleteReservations} from './deleteReservations.router';
export {router as getUserReservations} from './getUserReservations.router';
export {router as deleteUserReservations} from './deleteUserReservations.router';
export {router as requestServices} from './requestServices.router';
export {router as removeUserService} from './removeUserService.router';
export {router as getServices} from './getServices.router';
export {router as processServices} from './processServices.router';
export {router as deleteServices} from './deleteServices.router';
