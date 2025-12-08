import { Router } from "express";
import { vehiclesController } from './vehicles.controller';
import auth from '../../middleware/auth';

const router = Router()

router.post('/',auth("admin"),vehiclesController.createVehicles)

router.get('/',vehiclesController.getVehicles)

router.get('/:vehicleId',vehiclesController.getSingleVehicles)

router.put('/:vehicleId',auth("admin"),vehiclesController.updateVehicles)

router.delete('/:vehicleId',auth("admin"),vehiclesController.deleteVehicles)

export const vehiclesRouter = router;