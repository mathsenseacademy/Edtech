/**
 * @swagger
 * tags:
 *   name: Students
 *   description: API for managing student registration, profiles, and fees
 */

import express from "express";
import { StudentController } from "../controllers/StudentController.js";

const router = express.Router();

/**
 * @swagger
 * /api/student/register:
 *   post:
 *     summary: Register a new student
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: name, email, phone, class  
 *       2. Processing:  
 *          - Check if email/phone exists  
 *          - If not, create student in DB with status 'pending'  
 *          - Optionally send OTP/verification  
 *       3. Output: Success message with UID or error
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - phone
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: john@example.com
 *               phone:
 *                 type: string
 *                 example: "9876543210"
 *               class:
 *                 type: string
 *                 example: "10-A"
 *     responses:
 *       200:
 *         description: Student registered successfully
 *       400:
 *         description: Student exists or invalid input
 *       500:
 *         description: Server error
 */
router.post("/register", StudentController.register);

/**
 * @swagger
 * /api/student/check-registration:
 *   get:
 *     summary: Check if a student is already registered
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: email or phone query params  
 *       2. Processing: search DB for student  
 *       3. Output: exists=true/false
 *     parameters:
 *       - in: query
 *         name: email
 *         schema:
 *           type: string
 *         description: Email to check
 *       - in: query
 *         name: phone
 *         schema:
 *           type: string
 *         description: Phone to check
 *     responses:
 *       200:
 *         description: Student existence returned
 *       500:
 *         description: Server error
 */
router.get("/check-registration", StudentController.checkRegistration);

/**
 * @swagger
 * /api/student:
 *   get:
 *     summary: Get all students
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: optional query params (filters)  
 *       2. Processing: fetch students from DB  
 *       3. Output: array of student objects
 *     responses:
 *       200:
 *         description: List of students
 *       500:
 *         description: Server error
 */
router.get("/", StudentController.getAll);

/**
 * @swagger
 * /api/student/verified:
 *   get:
 *     summary: Get verified students
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: optional filters  
 *       2. Processing: query DB for verified students  
 *       3. Output: array of verified students
 *     responses:
 *       200:
 *         description: List of verified students
 *       500:
 *         description: Server error
 */
router.get("/verified", StudentController.getVerified);

/**
 * @swagger
 * /api/student/profile/{uid}:
 *   get:
 *     summary: Get student profile by UID
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: UID in URL path  
 *       2. Processing: fetch student from DB  
 *       3. Output: student object
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *         description: Student UID
 *     responses:
 *       200:
 *         description: Student profile returned
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get("/profile/:uid", StudentController.getProfile);

/**
 * @swagger
 * /api/student/{id}:
 *   get:
 *     summary: Get student by ID
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: student ID in path  
 *       2. Processing: fetch student from DB  
 *       3. Output: student object
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Database student ID
 *     responses:
 *       200:
 *         description: Student returned
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.get("/:id", StudentController.getById);

/**
 * @swagger
 * /api/student/{id}:
 *   put:
 *     summary: Update student details
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: student ID in path + updated fields in body  
 *       2. Processing: validate and update in DB  
 *       3. Output: updated student object
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
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: Student updated successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.put("/:id", StudentController.update);

/**
 * @swagger
 * /api/student/{uid}/fees:
 *   put:
 *     summary: Toggle student fee status (Yes/No)
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: UID in path + optional status in body  
 *       2. Processing: fetch student → update fee status in DB  
 *       3. Output: updated student fee status
 *     parameters:
 *       - in: path
 *         name: uid
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               feesPaid:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Fee status updated
 *       404:
 *         description: Student not found
 *       500:
 *         description: Server error
 */
router.put("/:uid/fees", StudentController.toggleFees);

/**
 * @swagger
 * /api/student/reset-fees:
 *   post:
 *     summary: Reset monthly fees for all students
 *     tags: [Students]
 *     description: |
 *       **Data Flow:**  
 *       1. Input: none (or optional filter)  
 *       2. Processing: update all students → set feesPaid = false  
 *       3. Output: success message
 *     responses:
 *       200:
 *         description: All student fees reset
 *       500:
 *         description: Server error
 */
router.post("/reset-fees", StudentController.resetMonthlyFees);




export default router;
