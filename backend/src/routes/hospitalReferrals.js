"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("../config/database");
// import { authenticateToken, requirePermission } from '../middleware/auth';
const uuid_1 = require("uuid");
const router = express_1.default.Router();
// Get all hospital referrals
router.get('/', async (req, res) => {
    try {
        const { page = 1, limit = 10, search = '', status = '', urgency = '', hospital = '', department = '' } = req.query;
        const offset = (Number(page) - 1) * Number(limit);
        let whereClause = 'WHERE 1=1';
        const queryParams = [];
        let paramIndex = 1;
        // Search filter (patient name, phone, or medical condition)
        if (search) {
            whereClause += ` AND (patient_name ILIKE $${paramIndex} OR patient_phone ILIKE $${paramIndex} OR medical_condition ILIKE $${paramIndex})`;
            queryParams.push(`%${search}%`);
            paramIndex++;
        }
        // Status filter
        if (status) {
            whereClause += ` AND status = $${paramIndex}`;
            queryParams.push(status);
            paramIndex++;
        }
        // Urgency filter
        if (urgency) {
            whereClause += ` AND urgency = $${paramIndex}`;
            queryParams.push(urgency);
            paramIndex++;
        }
        // Hospital filter
        if (hospital) {
            whereClause += ` AND hospital_name ILIKE $${paramIndex}`;
            queryParams.push(`%${hospital}%`);
            paramIndex++;
        }
        // Department filter
        if (department) {
            whereClause += ` AND department = $${paramIndex}`;
            queryParams.push(department);
            paramIndex++;
        }
        // Get total count
        const countResult = await (0, database_1.query)(`SELECT COUNT(*) FROM hospital_referrals ${whereClause}`, queryParams);
        const totalReferrals = parseInt(countResult.rows[0].count);
        // Get referrals with pagination
        const referralsResult = await (0, database_1.query)(`SELECT id, patient_name, patient_phone, patient_age, patient_gender, 
              medical_condition, urgency, hospital_name, department, doctor_name,
              appointment_date, status, referral_date, notes, estimated_cost,
              created_at, updated_at
       FROM hospital_referrals ${whereClause}
       ORDER BY 
         CASE urgency 
           WHEN 'critical' THEN 1
           WHEN 'high' THEN 2
           WHEN 'medium' THEN 3
           WHEN 'low' THEN 4
         END,
         referral_date DESC
       LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`, [...queryParams, Number(limit), offset]);
        const referrals = referralsResult.rows.map(referral => ({
            id: referral.id,
            patientName: referral.patient_name,
            patientPhone: referral.patient_phone,
            patientAge: referral.patient_age,
            patientGender: referral.patient_gender,
            medicalCondition: referral.medical_condition,
            urgency: referral.urgency,
            hospitalName: referral.hospital_name,
            department: referral.department,
            doctorName: referral.doctor_name,
            appointmentDate: referral.appointment_date,
            status: referral.status,
            referralDate: referral.referral_date,
            notes: referral.notes,
            estimatedCost: referral.estimated_cost ? parseFloat(referral.estimated_cost) : null,
            createdAt: referral.created_at,
            updatedAt: referral.updated_at
        }));
        res.json({
            success: true,
            data: {
                referrals,
                pagination: {
                    page: Number(page),
                    limit: Number(limit),
                    total: totalReferrals,
                    totalPages: Math.ceil(totalReferrals / Number(limit))
                }
            }
        });
    }
    catch (error) {
        console.error('Get hospital referrals error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Get hospital referral by ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const referralResult = await (0, database_1.query)(`SELECT id, patient_name, patient_phone, patient_age, patient_gender, patient_address,
              medical_condition, urgency, hospital_name, department, doctor_name,
              appointment_date, status, referral_date, notes, estimated_cost,
              actual_cost, payment_status, insurance_info, emergency_contact,
              created_at, updated_at, created_by
       FROM hospital_referrals WHERE id = $1`, [id]);
        if (referralResult.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hospital referral not found'
            });
        }
        const referral = referralResult.rows[0];
        res.json({
            success: true,
            data: {
                referral: {
                    id: referral.id,
                    patientName: referral.patient_name,
                    patientPhone: referral.patient_phone,
                    patientAge: referral.patient_age,
                    patientGender: referral.patient_gender,
                    patientAddress: referral.patient_address,
                    medicalCondition: referral.medical_condition,
                    urgency: referral.urgency,
                    hospitalName: referral.hospital_name,
                    department: referral.department,
                    doctorName: referral.doctor_name,
                    appointmentDate: referral.appointment_date,
                    status: referral.status,
                    referralDate: referral.referral_date,
                    notes: referral.notes,
                    estimatedCost: referral.estimated_cost ? parseFloat(referral.estimated_cost) : null,
                    actualCost: referral.actual_cost ? parseFloat(referral.actual_cost) : null,
                    paymentStatus: referral.payment_status,
                    insuranceInfo: referral.insurance_info,
                    emergencyContact: referral.emergency_contact,
                    createdAt: referral.created_at,
                    updatedAt: referral.updated_at,
                    createdBy: referral.created_by
                }
            }
        });
    }
    catch (error) {
        console.error('Get hospital referral error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Create new hospital referral
router.post('/', async (req, res) => {
    try {
        const { patientName, patientPhone, patientAge, patientGender, patientAddress, medicalCondition, urgency = 'medium', hospitalName, department, doctorName, appointmentDate, referralDate, notes, estimatedCost, insuranceInfo, emergencyContact } = req.body;
        // Validation
        if (!patientName || !patientPhone || !medicalCondition || !hospitalName || !department) {
            return res.status(400).json({
                success: false,
                message: 'Required fields: patientName, patientPhone, medicalCondition, hospitalName, department'
            });
        }
        // Validate urgency
        const validUrgencies = ['low', 'medium', 'high', 'critical'];
        if (!validUrgencies.includes(urgency)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid urgency level'
            });
        }
        // Validate gender if provided
        if (patientGender && !['male', 'female', 'other'].includes(patientGender)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid gender'
            });
        }
        // Generate referral number
        const referralNumber = `HR-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`;
        // Create hospital referral
        const referralId = (0, uuid_1.v4)();
        await (0, database_1.query)(`INSERT INTO hospital_referrals (
        id, referral_number, patient_name, patient_phone, patient_age, patient_gender, patient_address,
        medical_condition, urgency, hospital_name, department, doctor_name,
        appointment_date, status, referral_date, notes, estimated_cost,
        payment_status, insurance_info, emergency_contact, created_at, created_by
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW(), $21)`, [
            referralId, referralNumber, patientName, patientPhone, patientAge, patientGender, patientAddress,
            medicalCondition, urgency, hospitalName, department, doctorName,
            appointmentDate, 'pending', referralDate || new Date().toISOString().split('T')[0], notes, estimatedCost,
            'pending', insuranceInfo, emergencyContact, null
        ]);
        res.status(201).json({
            success: true,
            message: 'Hospital referral created successfully',
            data: {
                referral: {
                    id: referralId,
                    referralNumber,
                    patientName,
                    patientPhone,
                    patientAge,
                    patientGender,
                    patientAddress,
                    medicalCondition,
                    urgency,
                    hospitalName,
                    department,
                    doctorName,
                    appointmentDate,
                    status: 'pending',
                    referralDate: referralDate || new Date().toISOString().split('T')[0],
                    notes,
                    estimatedCost: estimatedCost ? parseFloat(estimatedCost) : null,
                    paymentStatus: 'pending',
                    insuranceInfo,
                    emergencyContact
                }
            }
        });
    }
    catch (error) {
        console.error('Create hospital referral error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Update hospital referral
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { patientName, patientPhone, patientAge, patientGender, patientAddress, medicalCondition, urgency, hospitalName, department, doctorName, appointmentDate, status, notes, estimatedCost, actualCost, paymentStatus, insuranceInfo, emergencyContact } = req.body;
        // Check if referral exists
        const existingReferral = await (0, database_1.query)('SELECT id FROM hospital_referrals WHERE id = $1', [id]);
        if (existingReferral.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hospital referral not found'
            });
        }
        // Build update query
        const updateFields = [];
        const updateValues = [];
        let paramIndex = 1;
        if (patientName !== undefined) {
            updateFields.push(`patient_name = $${paramIndex}`);
            updateValues.push(patientName);
            paramIndex++;
        }
        if (patientPhone !== undefined) {
            updateFields.push(`patient_phone = $${paramIndex}`);
            updateValues.push(patientPhone);
            paramIndex++;
        }
        if (patientAge !== undefined) {
            updateFields.push(`patient_age = $${paramIndex}`);
            updateValues.push(patientAge);
            paramIndex++;
        }
        if (patientGender !== undefined) {
            if (!['male', 'female', 'other'].includes(patientGender)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid gender'
                });
            }
            updateFields.push(`patient_gender = $${paramIndex}`);
            updateValues.push(patientGender);
            paramIndex++;
        }
        if (patientAddress !== undefined) {
            updateFields.push(`patient_address = $${paramIndex}`);
            updateValues.push(patientAddress);
            paramIndex++;
        }
        if (medicalCondition !== undefined) {
            updateFields.push(`medical_condition = $${paramIndex}`);
            updateValues.push(medicalCondition);
            paramIndex++;
        }
        if (urgency !== undefined) {
            const validUrgencies = ['low', 'medium', 'high', 'critical'];
            if (!validUrgencies.includes(urgency)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid urgency level'
                });
            }
            updateFields.push(`urgency = $${paramIndex}`);
            updateValues.push(urgency);
            paramIndex++;
        }
        if (hospitalName !== undefined) {
            updateFields.push(`hospital_name = $${paramIndex}`);
            updateValues.push(hospitalName);
            paramIndex++;
        }
        if (department !== undefined) {
            updateFields.push(`department = $${paramIndex}`);
            updateValues.push(department);
            paramIndex++;
        }
        if (doctorName !== undefined) {
            updateFields.push(`doctor_name = $${paramIndex}`);
            updateValues.push(doctorName);
            paramIndex++;
        }
        if (appointmentDate !== undefined) {
            updateFields.push(`appointment_date = $${paramIndex}`);
            updateValues.push(appointmentDate);
            paramIndex++;
        }
        if (status !== undefined) {
            const validStatuses = ['pending', 'approved', 'scheduled', 'completed', 'cancelled', 'rejected'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid status'
                });
            }
            updateFields.push(`status = $${paramIndex}`);
            updateValues.push(status);
            paramIndex++;
        }
        if (notes !== undefined) {
            updateFields.push(`notes = $${paramIndex}`);
            updateValues.push(notes);
            paramIndex++;
        }
        if (estimatedCost !== undefined) {
            updateFields.push(`estimated_cost = $${paramIndex}`);
            updateValues.push(estimatedCost);
            paramIndex++;
        }
        if (actualCost !== undefined) {
            updateFields.push(`actual_cost = $${paramIndex}`);
            updateValues.push(actualCost);
            paramIndex++;
        }
        if (paymentStatus !== undefined) {
            const validPaymentStatuses = ['pending', 'partial', 'paid', 'refunded', 'waived'];
            if (!validPaymentStatuses.includes(paymentStatus)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid payment status'
                });
            }
            updateFields.push(`payment_status = $${paramIndex}`);
            updateValues.push(paymentStatus);
            paramIndex++;
        }
        if (insuranceInfo !== undefined) {
            updateFields.push(`insurance_info = $${paramIndex}`);
            updateValues.push(insuranceInfo);
            paramIndex++;
        }
        if (emergencyContact !== undefined) {
            updateFields.push(`emergency_contact = $${paramIndex}`);
            updateValues.push(emergencyContact);
            paramIndex++;
        }
        if (updateFields.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No fields to update'
            });
        }
        updateFields.push(`updated_at = NOW()`);
        updateValues.push(id);
        await (0, database_1.query)(`UPDATE hospital_referrals SET ${updateFields.join(', ')} WHERE id = $${paramIndex}`, updateValues);
        // Get updated referral
        const updatedReferral = await (0, database_1.query)(`SELECT id, patient_name, patient_phone, patient_age, patient_gender, patient_address,
              medical_condition, urgency, hospital_name, department, doctor_name,
              appointment_date, status, referral_date, notes, estimated_cost,
              actual_cost, payment_status, insurance_info, emergency_contact, updated_at
       FROM hospital_referrals WHERE id = $1`, [id]);
        const referral = updatedReferral.rows[0];
        res.json({
            success: true,
            message: 'Hospital referral updated successfully',
            data: {
                referral: {
                    id: referral.id,
                    patientName: referral.patient_name,
                    patientPhone: referral.patient_phone,
                    patientAge: referral.patient_age,
                    patientGender: referral.patient_gender,
                    patientAddress: referral.patient_address,
                    medicalCondition: referral.medical_condition,
                    urgency: referral.urgency,
                    hospitalName: referral.hospital_name,
                    department: referral.department,
                    doctorName: referral.doctor_name,
                    appointmentDate: referral.appointment_date,
                    status: referral.status,
                    referralDate: referral.referral_date,
                    notes: referral.notes,
                    estimatedCost: referral.estimated_cost ? parseFloat(referral.estimated_cost) : null,
                    actualCost: referral.actual_cost ? parseFloat(referral.actual_cost) : null,
                    paymentStatus: referral.payment_status,
                    insuranceInfo: referral.insurance_info,
                    emergencyContact: referral.emergency_contact,
                    updatedAt: referral.updated_at
                }
            }
        });
    }
    catch (error) {
        console.error('Update hospital referral error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Delete hospital referral (admin only)
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        // Check if referral exists
        const existingReferral = await (0, database_1.query)('SELECT id FROM hospital_referrals WHERE id = $1', [id]);
        if (existingReferral.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Hospital referral not found'
            });
        }
        // Soft delete (mark as cancelled) instead of hard delete
        await (0, database_1.query)('UPDATE hospital_referrals SET status = $1, updated_at = NOW() WHERE id = $2', ['cancelled', id]);
        res.json({
            success: true,
            message: 'Hospital referral cancelled successfully'
        });
    }
    catch (error) {
        console.error('Delete hospital referral error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
// Get hospital referral statistics
router.get('/stats/overview', async (req, res) => {
    try {
        const statsResult = await (0, database_1.query)(`
      SELECT 
        COUNT(*) as total_referrals,
        COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_referrals,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_referrals,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_referrals,
        COUNT(CASE WHEN urgency = 'critical' THEN 1 END) as critical_cases,
        COUNT(CASE WHEN urgency = 'high' THEN 1 END) as high_priority_cases,
        COUNT(CASE WHEN payment_status = 'paid' THEN 1 END) as paid_referrals,
        COUNT(CASE WHEN referral_date >= NOW() - INTERVAL '30 days' THEN 1 END) as referrals_last_month,
        COALESCE(SUM(CASE WHEN actual_cost IS NOT NULL THEN actual_cost ELSE estimated_cost END), 0) as total_cost
      FROM hospital_referrals
    `);
        const stats = statsResult.rows[0];
        res.json({
            success: true,
            data: {
                totalReferrals: parseInt(stats.total_referrals),
                pendingReferrals: parseInt(stats.pending_referrals),
                approvedReferrals: parseInt(stats.approved_referrals),
                completedReferrals: parseInt(stats.completed_referrals),
                criticalCases: parseInt(stats.critical_cases),
                highPriorityCases: parseInt(stats.high_priority_cases),
                paidReferrals: parseInt(stats.paid_referrals),
                referralsLastMonth: parseInt(stats.referrals_last_month),
                totalCost: parseFloat(stats.total_cost)
            }
        });
    }
    catch (error) {
        console.error('Get hospital referral stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
});
exports.default = router;
//# sourceMappingURL=hospitalReferrals.js.map