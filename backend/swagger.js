// backend/swagger.js
import swaggerJsDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "EdTech Platform API",
      version: "1.0.0",
      description: `
        API documentation for EdTech platform using Swagger UI.

        ## 🔄 Data Flow Visualization
        Each API will clearly show:
        - **Input:** What data is being passed (body, params, query)
        - **Processing:** What happens inside your backend (Firebase + business logic)
        - **Output:** Exact response format

        ✅ Multiple models (Students, Classes, Batches) are defined under **Schemas**.
        ✅ These schemas are reused across routes using \`$ref\`.
      `,
    },
    servers: [
      {
        url: "http://localhost:5000",
        description: "Local Development Server",
      },
    ],
    components: {
      schemas: {
        Student: {
          type: "object",
          description: "Student schema defining Firestore structure",
          properties: {
            uid: { type: "string", example: "google-auth-uid-12345" },
            student_id: { type: "string", example: "STU00123" },
            first_name: { type: "string", example: "John" },
            middle_name: { type: "string", example: "Michael" },
            last_name: { type: "string", example: "Doe" },
            date_of_birth: { type: "string", format: "date", example: "2005-08-15" },
            contact_number_1: { type: "string", example: "9876543210" },
            contact_number_2: { type: "string", example: "9123456789" },
            student_class: { type: "string", example: "10-A" },
            school_or_college_name: { type: "string", example: "Springfield School" },
            board_or_university_name: { type: "string", example: "CBSE" },
            address: { type: "string", example: "221B Baker Street" },
            city: { type: "string", example: "Mumbai" },
            district: { type: "string", example: "Mumbai Suburban" },
            state: { type: "string", example: "Maharashtra" },
            pin: { type: "string", example: "400001" },
            notes: { type: "string", example: "Good performance in mathematics" },
            email: { type: "string", format: "email", example: "john.doe@example.com" },
            google_uid: { type: "string", example: "firebase-google-oauth-uid" },
            google_photo_url: { type: "string", example: "https://photo.url/image.jpg" },
            student_photo_path: { type: "string", example: "/uploads/students/john.jpg" },
            is_verified: { type: "boolean", example: false },
            is_registered: { type: "boolean", example: true },
            fees_status: { type: "string", enum: ["Yes", "No"], example: "No" },
            registered_at: { type: "string", format: "date-time", example: "2025-10-18T10:20:30Z" },
            updated_at: { type: "string", format: "date-time", example: "2025-10-18T10:20:30Z" },
          },
          required: ["uid", "first_name", "last_name", "contact_number_1", "email", "student_class"],
        },
        Class: {
          type: "object",
          description: "Class schema",
          properties: {
            id: { type: "string", example: "CLASS101" },
            name: { type: "string", example: "10-A" },
            description: { type: "string", example: "Advanced Mathematics Batch" },
          },
          required: ["name"],
        },
      },
    },
  },
  apis: ["./server.js", "./routes/*.js", "./controllers/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

const swaggerDocs = (app) => {
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log("✅ Swagger Docs available at http://localhost:5000/api-docs");
};

export default swaggerDocs;
