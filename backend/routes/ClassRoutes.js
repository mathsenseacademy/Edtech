/**
 * @swagger
 * tags:
 *   name: Classes
 *   description: API for managing classes
 */



// backend/routes/ClassRoutes.js
import express from "express";
import { ClassController } from "../controllers/ClassController.js";

const router = express.Router();


/**
 * @swagger
 * /api/classes:
 *   get:
 *     summary: Get all classes
 *     tags: [Classes]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: optional query filters  
 *       2. Processing: fetch all classes from DB  
 *       3. Output: array of class objects
 *     responses:
 *       200:
 *         description: List of classes
 *       500:
 *         description: Server error
 */
router.get("/", ClassController.getAll);

/**
 * @swagger
 * /api/classes:
 *   post:
 *     summary: Create a new class
 *     tags: [Classes]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: class details in request body  
 *       2. Processing: validate input → save class to DB  
 *       3. Output: newly created class object
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: "10-A"
 *               description:
 *                 type: string
 *                 example: "Mathematics advanced class"
 *     responses:
 *       200:
 *         description: Class created successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", ClassController.create);

/**
 * @swagger
 * /api/classes/{id}:
 *   get:
 *     summary: Get class by ID
 *     tags: [Classes]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: class ID in URL path  
 *       2. Processing: fetch class from DB  
 *       3. Output: class object
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class returned successfully
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
router.get("/:id", ClassController.getById);

/**
 * @swagger
 * /api/classes/{id}:
 *   put:
 *     summary: Update class by ID
 *     tags: [Classes]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: class ID in path + updated fields in body  
 *       2. Processing: validate input → update class in DB  
 *       3. Output: updated class object
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Class updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
router.put("/:id", ClassController.update);

/**
 * @swagger
 * /api/classes/{id}:
 *   delete:
 *     summary: Delete class by ID
 *     tags: [Classes]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: class ID in path  
 *       2. Processing: remove class from DB  
 *       3. Output: success message confirming deletion
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Class ID
 *     responses:
 *       200:
 *         description: Class deleted successfully
 *       404:
 *         description: Class not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", ClassController.delete);



// router.get("/", ClassController.getAll);

// router.post("/", ClassController.create);

// router.get("/:id", ClassController.getById);

// router.put("/:id", ClassController.update);

// router.delete("/:id", ClassController.delete);

export default router;
