import { Router } from "express";
import { vehiclesController } from './vehicles.controller';

const router = Router()

router.post('/',vehiclesController.createVehicles)

router.get('/',vehiclesController.getVehicles)

router.get('/:vehicleId',vehiclesController.getSingleVehicles)

router.put('/:vehicleId',vehiclesController.updateVehicles)

router.delete('/:vehicleId',vehiclesController.deleteVehicles)

export const vehiclesRouter = router;