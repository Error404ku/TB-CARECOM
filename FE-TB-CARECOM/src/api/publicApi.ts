// api/publicApi.ts
import { publicClient } from './client';

// Public APIs that don't require authentication

// Edukasi/Education content
export const getAllEducationContent = () => {
  return publicClient.get('/public/edukasi');
};

export const getEducationContentById = (id: number) => {
  return publicClient.get(`/public/edukasi/${id}`);
};

export const getEducationCategories = () => {
  return publicClient.get('/public/edukasi/categories');
};

// Public information
export const getAppInfo = () => {
  return publicClient.get('/public/app-info');
};

export const getHealthTips = () => {
  return publicClient.get('/public/health-tips');
};

export const getPublicStatistics = () => {
  return publicClient.get('/public/statistics');
};

// Contact and support
export const submitContactForm = (data: { name: string; email: string; message: string }) => {
  return publicClient.post('/public/contact', data);
};

export const getPublicFAQ = () => {
  return publicClient.get('/public/faq');
};

// Barcode scanning (for public access to scan medication)
export const scanBarcode = (barcodeId: string) => {
  return publicClient.get(`/public/scan/${barcodeId}`);
};

export const getBarcodeHistory = (barcodeId: string) => {
  return publicClient.get(`/public/scan/${barcodeId}/history`);
}; 