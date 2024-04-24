import { Router } from "express";
import { ProjectController } from "../controllers/ProjectController";
import { body,param } from "express-validator";
import { handleInputErrors } from "../middleware/validation";
import { TaskController } from "../controllers/TaskController";
import { projectExists} from "../middleware/project";
import { taskBelongsToProject, taskExists } from "../middleware/task";

const router=Router()

router.post('/',
body('projectName')
.notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
body('clientName')
.notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
body('description')
.notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),
handleInputErrors,
ProjectController.createProjects)

router.get('/',ProjectController.getAllProjects)

router.get('/:id',
param('id').isMongoId().withMessage('ID no vàlido'),
handleInputErrors,
ProjectController.geProjectById)

router.put('/:id',
//param('id').isMongoId().withMessage('ID no vàlido'),
body('projectName')
.notEmpty().withMessage('El Nombre del Proyecto es Obligatorio'),
body('clientName')
.notEmpty().withMessage('El Nombre del Cliente es Obligatorio'),
body('description')
.notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),
handleInputErrors,
ProjectController.updateProject)

router.delete('/:id',
param('id').isMongoId().withMessage('ID no vàlido'),
handleInputErrors,
ProjectController.deleteProject)

// va aqui porque una tarea se tiene que agregar a un proyecto existente
//Routes for Tasks
// /api/proyects/12345/tasks
router.param('projectId',projectExists)
router.post('/:projectId/tasks',

body('name')
.notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
body('description')
.notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),
handleInputErrors,
    TaskController.createTask
)

router.get('/:projectId/tasks',
    TaskController.getProjectTasks
)

router.param('taskId',taskExists)
router.param('taskId',taskBelongsToProject)

router.get('/:projectId/tasks/:taskId',
param('taskId').isMongoId().withMessage('ID no vàlido'),
handleInputErrors,
    TaskController.getTaskById
)

router.put('/:projectId/tasks/:taskId',
param('taskId').isMongoId().withMessage('ID no vàlido'),
body('name')
.notEmpty().withMessage('El Nombre de la Tarea es Obligatorio'),
body('description')
.notEmpty().withMessage('La Descripcion del Proyecto es Obligatoria'),
handleInputErrors,
    TaskController.updateTask
)

router.delete('/:projectId/tasks/:taskId',
param('taskId').isMongoId().withMessage('ID no vàlido'),
handleInputErrors,
    TaskController.deleteTask
)

router.post('/:projectId/tasks/:taskId/status',
param('taskId').isMongoId().withMessage('ID no vàlido'),
body('status')
.notEmpty().withMessage('El estado es obligatorio'),
handleInputErrors,
TaskController.updateStatus
)

export default router 