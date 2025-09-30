import { describe, it, expect, beforeEach, vi } from 'vitest';
import express from 'express';
import request from 'supertest';
import { registerRoutes } from './routes.js';
import { storage } from './storage.js';

describe('API Routes', () => {
  let app;
  let server;

  beforeEach(async () => {
    app = express();
    app.use(express.json());
    server = await registerRoutes(app);
    
    vi.spyOn(storage, 'getAllParcels').mockResolvedValue([]);
    vi.spyOn(storage, 'getAllDepartments').mockResolvedValue([]);
  });

  describe('GET /api/parcels', () => {
    it('should return all parcels', async () => {
      const mockParcels = [
        {
          id: '1',
          parcelId: 'TEST-001',
          weight: 5,
          value: 100,
          department: 'mail',
          status: 'completed',
          requiresInsurance: false,
          insuranceApproved: false,
          processingTime: new Date(),
          errorMessage: null,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];
      
      storage.getAllParcels.mockResolvedValue(mockParcels);

      const response = await request(app).get('/api/parcels');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].parcelId).toBe('TEST-001');
    });

    it('should filter parcels by department', async () => {
      const mockParcels = [
        { id: '1', parcelId: 'TEST-001', department: 'mail', status: 'completed' },
        { id: '2', parcelId: 'TEST-002', department: 'heavy', status: 'completed' }
      ];
      
      storage.getAllParcels.mockResolvedValue(mockParcels);

      const response = await request(app).get('/api/parcels?department=mail');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].department).toBe('mail');
    });

    it('should filter parcels by status', async () => {
      const mockParcels = [
        { id: '1', parcelId: 'TEST-001', status: 'completed' },
        { id: '2', parcelId: 'TEST-002', status: 'pending' }
      ];
      
      storage.getAllParcels.mockResolvedValue(mockParcels);

      const response = await request(app).get('/api/parcels?status=completed');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].status).toBe('completed');
    });

    it('should search parcels by parcelId', async () => {
      const mockParcels = [
        { id: '1', parcelId: 'TEST-001', department: 'mail' },
        { id: '2', parcelId: 'TEST-002', department: 'heavy' }
      ];
      
      storage.getAllParcels.mockResolvedValue(mockParcels);

      const response = await request(app).get('/api/parcels?search=001');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].parcelId).toBe('TEST-001');
    });
  });

  describe('GET /api/parcels/:id', () => {
    it('should return a single parcel', async () => {
      const mockParcel = {
        id: '1',
        parcelId: 'TEST-001',
        weight: 5,
        value: 100,
        department: 'mail',
        status: 'completed'
      };
      
      vi.spyOn(storage, 'getParcel').mockResolvedValue(mockParcel);

      const response = await request(app).get('/api/parcels/1');
      
      expect(response.status).toBe(200);
      expect(response.body.parcelId).toBe('TEST-001');
    });

    it('should return 404 for non-existent parcel', async () => {
      vi.spyOn(storage, 'getParcel').mockResolvedValue(undefined);

      const response = await request(app).get('/api/parcels/non-existent');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Parcel not found');
    });
  });

  describe('GET /api/dashboard/metrics', () => {
    it('should return dashboard metrics', async () => {
      const mockParcels = [
        { status: 'completed', department: 'mail', requiresInsurance: false },
        { status: 'completed', department: 'regular', requiresInsurance: false },
        { status: 'insurance_review', department: 'heavy', requiresInsurance: true, insuranceApproved: false },
        { status: 'error', department: 'mail', requiresInsurance: false }
      ];
      
      storage.getAllParcels.mockResolvedValue(mockParcels);

      const response = await request(app).get('/api/dashboard/metrics');
      
      expect(response.status).toBe(200);
      expect(response.body.totalParcels).toBe(4);
      expect(response.body.processed).toBe(2);
      expect(response.body.pendingInsurance).toBe(1);
      expect(response.body.errors).toBe(1);
    });
  });

  describe('GET /api/departments', () => {
    it('should return all departments', async () => {
      const mockDepartments = [
        {
          id: '1',
          name: 'Mail Department',
          description: 'Handles mail parcels',
          color: 'blue',
          icon: 'mail',
          isCustom: false,
          createdAt: new Date()
        }
      ];
      
      storage.getAllDepartments.mockResolvedValue(mockDepartments);

      const response = await request(app).get('/api/departments');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Mail Department');
    });
  });

  describe('POST /api/departments', () => {
    it('should create a new department', async () => {
      const newDepartment = {
        name: 'Express Department',
        description: 'Fast delivery',
        color: 'red',
        icon: 'zap'
      };

      const createdDepartment = {
        ...newDepartment,
        id: '123',
        isCustom: true,
        createdAt: new Date()
      };
      
      vi.spyOn(storage, 'createDepartment').mockResolvedValue(createdDepartment);

      const response = await request(app)
        .post('/api/departments')
        .send(newDepartment);
      
      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Express Department');
      expect(response.body.id).toBe('123');
    });

    it('should return 400 for invalid department data', async () => {
      const invalidDepartment = {
        name: 'Test'
      };

      const response = await request(app)
        .post('/api/departments')
        .send(invalidDepartment);
      
      expect(response.status).toBe(400);
      expect(response.body.message).toBe('Invalid department data');
    });
  });

  describe('DELETE /api/departments/:id', () => {
    it('should delete a department', async () => {
      vi.spyOn(storage, 'deleteDepartment').mockResolvedValue(true);

      const response = await request(app).delete('/api/departments/123');
      
      expect(response.status).toBe(200);
      expect(response.body.message).toBe('Department deleted successfully');
    });

    it('should return 404 for non-existent department', async () => {
      vi.spyOn(storage, 'deleteDepartment').mockResolvedValue(false);

      const response = await request(app).delete('/api/departments/non-existent');
      
      expect(response.status).toBe(404);
      expect(response.body.message).toBe('Department not found');
    });
  });
});
